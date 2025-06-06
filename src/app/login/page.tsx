
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, Users, Briefcase, Bike, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation"; // For redirection

type Role = "student" | "vendor" | "rider";
type Step = "roleSelection" | "authForm";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("roleSelection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep("authForm");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with role:", selectedRole, "Email:", email);
    // --- Placeholder for Firebase Email/Password Login ---
    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    //   console.log("User logged in:", user.uid);
    //   // Redirect based on role
    //   redirectToDashboard(selectedRole);
    // } catch (error) {
    //   console.error("Login error:", error);
    //   alert("Login failed. Please check your credentials.");
    // }
    // --- End Placeholder ---
    
    // Simulate login and redirect
    alert(`Simulating login for ${selectedRole} with email ${email}. You would be redirected.`);
    redirectToDashboard(selectedRole);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt with role:", selectedRole, "Email:", email);
    // --- Placeholder for Firebase Email/Password Signup & Firestore Save ---
    // try {
    //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    //   console.log("User signed up:", user.uid);
    //   // Save user role to Firestore
    //   // await setDoc(doc(db, "users", user.uid), {
    //   //   email: user.email,
    //   //   role: selectedRole,
    //   //   createdAt: new Date(),
    //   // });
    //   // console.log("User role saved to Firestore.");
    //   // Redirect based on role
    //   redirectToDashboard(selectedRole);
    // } catch (error) {
    //   console.error("Signup error:", error);
    //   alert("Signup failed. Please try again.");
    // }
    // --- End Placeholder ---

    // Simulate signup and redirect
    alert(`Simulating signup for ${selectedRole} with email ${email}. Role would be saved to Firestore. You would be redirected.`);
    redirectToDashboard(selectedRole);
  };
  
  const redirectToDashboard = (role: Role | null) => {
    if (role === "student") {
      router.push("/student-dashboard");
    } else if (role === "vendor") {
      router.push("/vendor-dashboard");
    } else if (role === "rider") {
      router.push("/rider-dashboard");
    } else {
      router.push("/"); // Fallback to home
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Image src="https://placehold.co/100x100.png" alt="OSO App Logo" width={60} height={60} className="mx-auto mb-3 rounded-full border border-primary data-ai-hint="app logo"" />
          <CardTitle className="text-2xl font-headline">
            {currentStep === "roleSelection" ? (
              <BilingualText en="Select Your Role" hi="अपनी भूमिका चुनें" />
            ) : (
              <BilingualText en={`Login as ${selectedRole}`} hi={`${selectedRole} के रूप में लॉगिन करें`} />
            )}
          </CardTitle>
          <CardDescription>
            <BilingualText en="Continue your OSO journey." hi="अपनी OSO यात्रा जारी रखें।" />
          </CardDescription>
        </CardHeader>

        {currentStep === "roleSelection" && (
          <CardContent className="space-y-4">
            <Button onClick={() => handleRoleSelect("student")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <School className="h-5 w-5" /> <BilingualText en="I am a Student" hi="मैं एक छात्र हूँ" />
            </Button>
            <Button onClick={() => handleRoleSelect("vendor")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-600">
              <Briefcase className="h-5 w-5" /> <BilingualText en="I am a Vendor" hi="मैं एक विक्रेता हूँ" />
            </Button>
            <Button onClick={() => handleRoleSelect("rider")} variant="outline" className="w-full justify-center gap-2 py-6 text-base border-orange-500 text-orange-600 hover:bg-orange-500/10 hover:text-orange-600">
              <Bike className="h-5 w-5" /> <BilingualText en="I am a Rider" hi="मैं एक राइडर हूँ" />
            </Button>
          </CardContent>
        )}

        {currentStep === "authForm" && selectedRole && (
          <CardContent className="space-y-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep("roleSelection")} className="mb-2 text-muted-foreground">
                &larr; <BilingualText en="Back to role selection" hi="भूमिका चयन पर वापस"/>
            </Button>
            {/* Option A: School-issued ID login - This might need role-specific logic or be a separate flow */}
            {selectedRole === "student" && (
              <>
                <Button variant="outline" className="w-full justify-center gap-2 py-3 text-base border-primary text-primary hover:bg-primary/10 hover:text-primary">
                  <ShieldCheck className="h-5 w-5" /> 
                  <BilingualText en="Login with School ID" hi="स्कूल आईडी से लॉगिन करें" />
                </Button>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        <BilingualText en="Or continue with Email" hi="या ईमेल से जारी रखें" />
                    </span>
                    </div>
                </div>
              </>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email"><BilingualText en="Email or Phone" hi="ईमेल या फ़ोन" /></Label>
                <Input id="email" type="text" placeholder_en="your.email@example.com" placeholder_hi="आपका.ईमेल@उदाहरण.कॉम" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password"><BilingualText en="Password" hi="पासवर्ड" /></Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2 space-y-2 sm:space-y-0">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
                    <BilingualText en="Login" hi="लॉग इन करें" />
                </Button>
                <Button type="button" onClick={handleSignup} variant="outline" className="w-full py-3 text-base">
                    <UserPlus className="h-5 w-5 mr-2" />
                    <BilingualText en="Sign Up" hi="साइन अप करें" />
                </Button>
              </div>
            </form>
            
            <div className="text-center text-sm mt-4">
              <BilingualText en="Forgot password?" hi="पासवर्ड भूल गए?" />{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                <BilingualText en="Reset here" hi="यहां रीसेट करें" />
              </Link>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex-col space-y-2 pt-4">
            {/* Option C: Parent login - This is separate from the new role flow */}
             {currentStep === "roleSelection" && ( // Show parent login only at role selection step
                <>
                    <div className="relative w-full my-2">
                        <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            <BilingualText en="Are you a Parent?" hi="क्या आप अभिभावक हैं?" />
                        </span>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-center gap-2 text-muted-foreground hover:text-primary">
                        <Users className="h-5 w-5" /> 
                        <BilingualText en="Parent Login" hi="अभिभावक लॉगिन" />
                    </Button>
                </>
             )}
        </CardFooter>
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

    