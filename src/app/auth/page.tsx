
"use client";
import { useState, type FormEvent, useEffect } from "react";
import Image from "next/image";
import { Languages, LogIn, UserPlus, KeyRound, Mail, User as UserIcon, ArrowLeft, Briefcase, School as SchoolIconLucide, Sparkles as CreatorIcon, Edit3, Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schoolDesignations = ["Principal", "Vice Principal", "Coordinator", "Teacher", "Accountant", "Admin Staff", "Librarian", "IT Support", "Other"];

// Simplified interface for staff member data stored/retrieved for login
interface LoggedInStaff {
  email: string;
  password?: string; // Password check is direct within handleSubmit
  name: string;
  role: string; // This 'role' is the designation from schoolStaff list
  schoolId: string;
}


export default function AuthPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolId, setSchoolId] = useState(''); // Added state for School ID
  const [schoolDesignation, setSchoolDesignation] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const selectedRole = searchParams.get('role');

  useEffect(() => {
    if (selectedRole !== 'school') {
      setSchoolDesignation('');
    }
  }, [selectedRole]);

  const handleLanguageToggle = () => {
    setCurrentLang(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    if (selectedRole) queryParams.set('role', selectedRole);
    queryParams.set('email', email); // Pass email for profile page context

    if (mode === 'signUp') {
      // --- Sign Up Validations ---
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast({ title: "Error", description: "All fields are required for sign up.", variant: "destructive" });
        setIsLoading(false); return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
        setIsLoading(false); return;
      }

      if (selectedRole === 'school') {
        if (!schoolDesignation) {
          toast({ title: "Error", description: "Please select your designation for school registration.", variant: "destructive" });
          setIsLoading(false); return;
        }
        // --- School Admin Sign Up Logic ---
        localStorage.setItem('tempInitialAdminCredentials', JSON.stringify({ email, password, fullName: name, designation: schoolDesignation }));
        
        queryParams.set('isSchoolSetup', 'true'); 
        queryParams.set('name', name); 
        queryParams.set('designation', schoolDesignation); 
        const schoolSignupRedirectPath = `/edit-profile?${queryParams.toString()}`;
        
        toast({ title: "Admin Registration Initiated", description: "Please complete school profile setup." });
        router.push(schoolSignupRedirectPath);
        setIsLoading(false); 
        return; 
      } else {
        // --- Other Roles Sign Up Logic ---
        localStorage.setItem(`userCredentials_${email}`, JSON.stringify({ password, fullName: name, role: selectedRole || 'student' }));
        localStorage.setItem('loggedInUser', JSON.stringify({ email, fullName: name, role: selectedRole || 'student' }));
        queryParams.set('isNewUser', 'true');
        queryParams.set('name', name);
        const otherSignupRedirectPath = `/edit-profile?${queryParams.toString()}`;

        toast({ title: "Sign Up Successful", description: "Please complete your profile." });
        router.push(otherSignupRedirectPath);
        setIsLoading(false);
        return; 
      }
    } else { // Sign In
      // --- Sign In Validations ---
      if (!email.trim() || !password.trim()) {
        toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
        setIsLoading(false); return;
      }

      let signinRedirectPath = '/'; 

      if (selectedRole === 'school') {
        // --- School Staff Sign In Logic ---
        if (!schoolId.trim()) {
          toast({ title: "Error", description: "School ID is required for School Partner login.", variant: "destructive" });
          setIsLoading(false); return;
        }
        
        const schoolStaffString = localStorage.getItem(`schoolStaff_${schoolId}`);
        if (!schoolStaffString) {
          toast({ title: "Sign In Failed", description: "Invalid School ID or no staff found for this school.", variant: "destructive" });
          setIsLoading(false); return;
        }
        
        const schoolStaffList: LoggedInStaff[] = JSON.parse(schoolStaffString);
        const staffMember = schoolStaffList.find(staff => staff.email === email && staff.password === password);

        if (staffMember) {
          localStorage.setItem('loggedInUser', JSON.stringify({
            email: staffMember.email,
            fullName: staffMember.name,
            role: 'school', 
            designation: staffMember.role, 
            schoolId: staffMember.schoolId 
          }));
          toast({ title: "Sign In Successful", description: `Welcome back, ${staffMember.name}!` });
          signinRedirectPath = '/school-dashboard';
        } else {
          toast({ title: "Sign In Failed", description: "Invalid staff credentials or staff account not found.", variant: "destructive" });
          setIsLoading(false); return;
        }
      } else { // Other roles sign in
        const storedCredentialsString = localStorage.getItem(`userCredentials_${email}`);
        if (storedCredentialsString) {
          const storedCredentials = JSON.parse(storedCredentialsString);
          if (storedCredentials.password === password) {
            const userRole = storedCredentials.role || selectedRole || 'student';
            localStorage.setItem('loggedInUser', JSON.stringify({ email, fullName: storedCredentials.fullName, role: userRole }));
            toast({ title: "Sign In Successful", description: "Welcome back!" });
            switch (userRole) {
              case 'parent': signinRedirectPath = '/parent-mode'; break;
              case 'vendor': signinRedirectPath = '/vendor-dashboard'; break;
              case 'creator': signinRedirectPath = '/creator-dashboard'; break;
              case 'teacher': signinRedirectPath = '/coaching-panel'; break;
              case 'rider': signinRedirectPath = '/rider-dashboard'; break;
              case 'platform-admin': signinRedirectPath = '/platform-admin'; break;
              case 'student': default: signinRedirectPath = '/'; break;
            }
          } else {
            toast({ title: "Sign In Failed", description: "Invalid credentials.", variant: "destructive" });
            setIsLoading(false); return;
          }
        } else {
          toast({ title: "Sign In Failed", description: "User not found. Please sign up.", variant: "destructive" });
          setIsLoading(false); return;
        }
      }
      router.push(signinRedirectPath);
      setIsLoading(false);
      return; 
    }
    // Fallback if no explicit return was hit, though all paths should be covered.
    setIsLoading(false);
  };


  const getFullNameLabel = () => {
    if (selectedRole === 'school' && mode === 'signUp') {
        return { en: "Your Full Name (Admin/Principal)", hi: "आपका पूरा नाम (एडमिन/प्रधानाचार्य)" };
    }
    switch (selectedRole) {
        case 'vendor':
        case 'creator':
            return { en: "Contact Person Name", hi: "संपर्क व्यक्ति का नाम" };
        default:
            return { en: "Your Full Name", hi: "आपका पूरा नाम" };
    }
  };
  const nameFieldLabel = getFullNameLabel();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-6 font-body relative">
      <div className="absolute top-6 left-6 z-10">
        <Button
            onClick={() => router.push('/login')}
            variant="outline"
            size="icon"
            className="text-foreground hover:bg-accent/10"
            aria-label="Back to role selection"
        >
            <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <Button
        onClick={handleLanguageToggle}
        variant="outline"
        className="absolute top-6 right-6 bg-card/50 backdrop-blur-sm border-border/30 hover:bg-card/70 text-foreground py-1 px-2 text-sm h-auto z-10"
      >
        <Languages className="h-4 w-4 mr-1.5" />
        {currentLang === 'en' ? 'हिंदी' : 'English'}
      </Button>

      <div className="w-full max-w-md text-center">
        <div className="mb-8">
           <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary text-4xl font-bold text-primary-foreground shadow-xl">
            OSO
          </div>
        </div>

        <Card className="shadow-xl border-border bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {mode === 'signIn' ? (
                <BilingualText en="Sign In" hi="साइन इन करें" lang={currentLang} />
              ) : (
                <BilingualText en="Sign Up" hi="साइन अप करें" lang={currentLang} />
              )}
              {selectedRole && (
                <span className="text-sm text-muted-foreground block mt-1">
                  (<BilingualText en={`as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`} hi={`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} के रूप में`} lang={currentLang} />
                  {mode === 'signUp' && selectedRole === 'school' && " Administrator"}
                  )
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {mode === 'signIn' ? (
                <BilingualText en="Welcome back! Please enter your details." hi="वापसी पर स्वागत है! कृपया अपना विवरण दर्ज करें।" lang={currentLang} />
              ) : (
                <BilingualText 
                    en={selectedRole === 'school' ? "Register as School Administrator to set up your school." : "Create your OSO account."} 
                    hi={selectedRole === 'school' ? "अपने स्कूल को स्थापित करने के लिए स्कूल प्रशासक के रूप में पंजीकरण करें।" : "अपना OSO खाता बनाएं।"} lang={currentLang} />
              )}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
               {mode === 'signIn' && selectedRole === 'school' && (
                 <div className="space-y-1 text-left">
                  <Label htmlFor="schoolId" className="flex items-center text-muted-foreground">
                    <SchoolIconLucide className="h-4 w-4 mr-1.5 text-primary/70" />
                    <BilingualText en="School ID" hi="स्कूल आईडी" lang={currentLang} />
                  </Label>
                  <Input id="schoolId" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} placeholder_en="Enter your School ID" placeholder_hi="अपना स्कूल आईडी दर्ज करें" required />
                </div>
               )}
              {mode === 'signUp' && (
                <div className="space-y-1 text-left">
                  <Label htmlFor="name" className="flex items-center text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-1.5 text-primary/70" />
                    <BilingualText en={nameFieldLabel.en} hi={nameFieldLabel.hi} lang={currentLang} />
                  </Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder_en={`Enter ${nameFieldLabel.en.toLowerCase()}`} placeholder_hi={`${nameFieldLabel.hi} दर्ज करें`} required={mode === 'signUp'} />
                </div>
              )}
              <div className="space-y-1 text-left">
                <Label htmlFor="email" className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1.5 text-primary/70" />
                  <BilingualText en="Email" hi="ईमेल" lang={currentLang} />
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder_en="you@example.com" placeholder_hi="आप@उदाहरण.कॉम" required />
              </div>
              <div className="space-y-1 text-left">
                <Label htmlFor="password" className="flex items-center text-muted-foreground">
                  <KeyRound className="h-4 w-4 mr-1.5 text-primary/70" />
                  <BilingualText en="Password" hi="पासवर्ड" lang={currentLang} />
                </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder_en="Enter your password" placeholder_hi="अपना पासवर्ड दर्ज करें" required />
              </div>
              {mode === 'signUp' && (
                <>
                  <div className="space-y-1 text-left">
                    <Label htmlFor="confirmPassword" className="flex items-center text-muted-foreground">
                      <KeyRound className="h-4 w-4 mr-1.5 text-primary/70" />
                      <BilingualText en="Confirm Password" hi="पासवर्ड की पुष्टि करें" lang={currentLang} />
                    </Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder_en="Confirm your password" placeholder_hi="अपने पासवर्ड की पुष्टि करें" required={mode === 'signUp'} />
                  </div>
                  {selectedRole === 'school' && (
                    <div className="space-y-1 text-left">
                        <Label htmlFor="schoolDesignation" className="flex items-center text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 mr-1.5 text-primary/70" />
                            <BilingualText en="Your Designation (as Admin)" hi="आपकी पदवी (एडमिन के रूप में)" lang={currentLang} />*
                        </Label>
                        <Select value={schoolDesignation} onValueChange={setSchoolDesignation} required>
                            <SelectTrigger id="schoolDesignation">
                                <SelectValue placeholder_en="Select your designation" placeholder_hi="अपनी पदवी चुनें" />
                            </SelectTrigger>
                            <SelectContent>
                                {schoolDesignations.map(desig => (
                                    <SelectItem key={desig} value={desig}>{desig}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : mode === 'signIn' ? <LogIn className="mr-2"/> : <UserPlus className="mr-2"/>}
                {mode === 'signIn' ? (
                  <BilingualText en="Sign In" hi="साइन इन करें" lang={currentLang} />
                ) : (
                  <BilingualText en={selectedRole === 'school' ? "Register School Admin & Proceed" : "Sign Up & Proceed"} hi={selectedRole === 'school' ? "स्कूल एडमिन पंजीकृत करें और आगे बढ़ें" : "साइन अप करें और आगे बढ़ें"} lang={currentLang} />
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {mode === 'signIn' ? (
                  <BilingualText en="Don't have an account? Sign Up" hi="खाता नहीं है? साइन अप करें" lang={currentLang} />
                ) : (
                  <BilingualText en="Already have an account? Sign In" hi="पहले से ही खाता है? साइन इन करें" lang={currentLang} />
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
    
