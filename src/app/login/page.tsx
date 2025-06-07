
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, Users, Briefcase, Bike, School, LogIn, ArrowLeft, Mail, Phone, KeyRound } from "lucide-react"; // Added KeyRound
import Image from "next/image";
import Link from "next/link";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type AuthStep = "initialSelection" | "studentLoginOptions" | "schoolIdLogin" | "directLogin" | "otherRolesLogin";
type OtherRole = "vendor" | "rider";

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState<AuthStep>("initialSelection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [selectedOtherRole, setSelectedOtherRole] = useState<OtherRole | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleStudentPath = () => {
    setCurrentStep("studentLoginOptions");
  };

  const handleOtherRolesPath = () => {
    setCurrentStep("otherRolesLogin");
  };
  
  const handleSchoolIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId.trim()) {
      toast({ title: "School ID Required", description: "Please enter your School ID.", variant: "destructive" });
      return;
    }
    console.log("School ID Login attempt with ID:", schoolId);
    // Simulate successful School ID login
    toast({ title: "School Login Successful (Simulated)", description: "Redirecting to your profile..." });
    // For a real app, you'd verify school ID and fetch prefilled data
    // For this demo, we pass some mock prefillable data.
    router.push(`/edit-profile?loginType=school&schoolId=${encodeURIComponent(schoolId)}&fullName=Rohit%20Verma&schoolName=Demo%20Public%20School&className=10`);
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Direct Login attempt with Email:", email);
    toast({ title: "Login Successful (Simulated)", description: "Redirecting to your dashboard..." });
    // Simulate login, then redirect. If existing user, could go to dashboard or prefilled edit-profile.
    // For demo, go to edit-profile as if existing user.
    router.push(`/edit-profile?loginType=direct&email=${encodeURIComponent(email)}`);
  };

  const handleDirectSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Direct Signup attempt with Email:", email);
    toast({ title: "Signup Successful (Simulated)", description: "Please complete your profile." });
    // Simulate signup, then redirect to blank profile
    router.push(`/edit-profile?loginType=direct&isNewUser=true&email=${encodeURIComponent(email)}`);
  };

  const handleOtherRoleSelect = (role: OtherRole) => {
    setSelectedOtherRole(role);
    // For this demo, directly simulate login and redirect for vendor/rider
    console.log(`Login attempt for role: ${role}`);
    toast({ title: `${role.charAt(0).toUpperCase() + role.slice(1)} Login (Simulated)`, description: "Redirecting to dashboard..." });
    if (role === "vendor") router.push("/vendor-dashboard");
    if (role === "rider") router.push("/rider-dashboard");
  };


  const renderInitialSelection = () => (
    <CardContent className="space-y-4">
        <Button onClick={handleStudentPath} variant="outline" className="w-full justify-center gap-2 py-6 text-lg border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <School className="h-6 w-6" /> <BilingualText en="I am a Student" hi="मैं एक छात्र हूँ" />
        </Button>
        <Button onClick={handleOtherRolesPath} variant="outline" className="w-full justify-center gap-2 py-6 text-lg border-muted-foreground text-muted-foreground hover:bg-muted/20">
            <Users className="h-6 w-6" /> <BilingualText en="Vendor / Rider Login" hi="विक्रेता / राइडर लॉगिन" />
        </Button>
    </CardContent>
  );

  const renderStudentLoginOptions = () => (
    <CardContent className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep("initialSelection")} className="mb-2 text-muted-foreground self-start px-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back" hi="वापस"/>
        </Button>
        <Button onClick={() => setCurrentStep("schoolIdLogin")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-600">
            <ShieldCheck className="h-5 w-5" /> <BilingualText en="Login with School ID" hi="स्कूल आईडी से लॉगिन करें" />
        </Button>
        <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground"><BilingualText en="OR" hi="या" /></span>
            </div>
        </div>
        <Button onClick={() => setCurrentStep("directLogin")} variant="outline" className="w-full justify-center gap-2 py-6 text-base">
            <LogIn className="h-5 w-5" /> <BilingualText en="OSO App Direct Login/Signup" hi="OSO ऐप डायरेक्ट लॉगिन/साइनअप" />
        </Button>
    </CardContent>
  );

  const renderSchoolIdLogin = () => (
     <CardContent className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep("studentLoginOptions")} className="mb-0 text-muted-foreground self-start px-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back to student options" hi="छात्र विकल्पों पर वापस"/>
        </Button>
        <form onSubmit={handleSchoolIdLogin} className="space-y-4">
            <div>
                <Label htmlFor="schoolId"><BilingualText en="Enter Your School ID" hi="अपनी स्कूल आईडी दर्ज करें" /></Label>
                <Input id="schoolId" type="text" placeholder_en="e.g., YourSchool123" placeholder_hi="उदा., आपकास्कूल123" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base">
                <ShieldCheck className="mr-2 h-5 w-5" /> <BilingualText en="Login with School ID" hi="स्कूल आईडी से लॉगिन करें" />
            </Button>
        </form>
    </CardContent>
  );

  const renderDirectLogin = () => (
    <CardContent className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep("studentLoginOptions")} className="mb-0 text-muted-foreground self-start px-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back to student options" hi="छात्र विकल्पों पर वापस"/>
        </Button>
        
        <Button 
            variant="default" 
            className="w-full justify-center gap-2 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => toast({title: "Coming Soon!", description:"Phone OTP login will be available soon."})}
        >
            <Phone className="h-5 w-5" /> <BilingualText en="Login/Signup with Phone OTP" hi="फ़ोन OTP से लॉगिन/साइनअप करें" />
        </Button>

        <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground"><BilingualText en="OR" hi="या" /></span>
            </div>
        </div>

        <form onSubmit={handleDirectLogin} className="space-y-4">
            <div>
                <Label htmlFor="email"><Mail className="inline mr-1 h-4 w-4" /><BilingualText en="Email" hi="ईमेल" /></Label>
                <Input id="email" type="email" placeholder_en="your.email@example.com" placeholder_hi="आपका.ईमेल@उदाहरण.कॉम" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="password"><KeyRound className="inline mr-1 h-4 w-4" /><BilingualText en="Password" hi="पासवर्ड" /></Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2 space-y-2 sm:space-y-0">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
                    <LogIn className="mr-2 h-5 w-5" /> <BilingualText en="Login with Email" hi="ईमेल से लॉग इन करें" />
                </Button>
                <Button type="button" onClick={handleDirectSignup} variant="outline" className="w-full py-3 text-base">
                    <UserPlus className="mr-2 h-5 w-5" /> <BilingualText en="Sign Up with Email" hi="ईमेल से साइन अप करें" />
                </Button>
            </div>
        </form>
        
        <div className="text-center text-sm mt-2">
            <BilingualText en="Forgot password?" hi="पासवर्ड भूल गए?" />{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
                <BilingualText en="Reset here" hi="यहां रीसेट करें" />
            </Link>
        </div>
    </CardContent>
  );

  const renderOtherRolesLogin = () => (
    <CardContent className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep("initialSelection")} className="mb-2 text-muted-foreground self-start px-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> <BilingualText en="Back" hi="वापस"/>
        </Button>
        <Button onClick={() => handleOtherRoleSelect("vendor")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-600">
            <Briefcase className="h-5 w-5" /> <BilingualText en="Login as Vendor" hi="विक्रेता के रूप में लॉगिन करें" />
        </Button>
        <Button onClick={() => handleOtherRoleSelect("rider")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-orange-500 text-orange-600 hover:bg-orange-500/10 hover:text-orange-600">
            <Bike className="h-5 w-5" /> <BilingualText en="Login as Rider" hi="राइडर के रूप में लॉगिन करें" />
        </Button>
    </CardContent>
  );
  
  const getTitle = () => {
    switch(currentStep) {
        case "initialSelection": return <BilingualText en="Welcome to OSO App!" hi="OSO ऐप में आपका स्वागत है!" />;
        case "studentLoginOptions": return <BilingualText en="Student Login/Signup" hi="छात्र लॉगिन/साइनअप" />;
        case "schoolIdLogin": return <BilingualText en="School ID Login" hi="स्कूल आईडी लॉगिन" />;
        case "directLogin": return <BilingualText en="OSO Direct Login/Signup" hi="OSO डायरेक्ट लॉगिन/साइनअप" />; // Updated title
        case "otherRolesLogin": return <BilingualText en="Vendor / Rider Login" hi="विक्रेता / राइडर लॉगिन" />;
        default: return <BilingualText en="Login / Signup" hi="लॉगिन / साइनअप" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Image src="https://placehold.co/100x100.png" alt="OSO App Logo" width={60} height={60} className="mx-auto mb-3 rounded-full border border-primary data-ai-hint="app logo" />
          <CardTitle className="text-2xl font-headline">{getTitle()}</CardTitle>
          <CardDescription>
             {currentStep === "initialSelection" ? 
                <BilingualText en="Please select how you'd like to continue." hi="कृपया चुनें कि आप कैसे जारी रखना चाहते हैं।" /> :
             currentStep === "directLogin" ?
                <BilingualText en="Use Phone OTP or Email to continue." hi="जारी रखने के लिए फ़ोन OTP या ईमेल का उपयोग करें।" /> :
                <BilingualText en="Continue your OSO journey." hi="अपनी OSO यात्रा जारी रखें।" />
             }
          </CardDescription>
        </CardHeader>

        {currentStep === "initialSelection" && renderInitialSelection()}
        {currentStep === "studentLoginOptions" && renderStudentLoginOptions()}
        {currentStep === "schoolIdLogin" && renderSchoolIdLogin()}
        {currentStep === "directLogin" && renderDirectLogin()}
        {currentStep === "otherRolesLogin" && renderOtherRolesLogin()}
        
        {currentStep !== "initialSelection" && (
            <CardFooter className="flex-col space-y-2 pt-4 border-t">
                 <p className="text-xs text-muted-foreground text-center">
                    <BilingualText en="By continuing, you agree to OSO App's" hi="जारी रखकर, आप OSO ऐप की" />
                    <Link href="/terms" className="underline hover:text-primary"> <BilingualText en="Terms of Service" hi="सेवा की शर्तें" /></Link> <BilingualText en="and" hi="और" />
                    <Link href="/privacy" className="underline hover:text-primary"> <BilingualText en="Privacy Policy" hi="गोपनीयता नीति" /></Link>.
                 </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

// Add placeholder to Input component for bilingual support if not already done
declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
