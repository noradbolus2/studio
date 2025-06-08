
"use client";
import { useState, type FormEvent, useEffect } from "react";
import Image from "next/image";
import { Languages, LogIn, UserPlus, KeyRound, Mail, User as UserIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AuthPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    // You can use roleParam if you want to customize the auth page title or behavior based on role
    // For now, it's not explicitly used to change the form itself.
  }, [searchParams]);

  const handleLanguageToggle = () => {
    setCurrentLang(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'signUp') {
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        toast({ title: "Error", description: "All fields are required for sign up.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      // Simulate sign up
      localStorage.setItem(`userCredentials_${email}`, JSON.stringify({ password, fullName }));
      localStorage.setItem('loggedInUser', JSON.stringify({ email, fullName }));
      localStorage.setItem('userProfileData', JSON.stringify({ email, fullName, avatarUrl: '', country: 'India' }));

      toast({ title: "Sign Up Successful", description: "Welcome! Please complete your profile." });
      router.push(`/edit-profile?email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&isNewUser=true`);
    } else { // Sign In
      if (!email.trim() || !password.trim()) {
        toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const storedCredentialsString = localStorage.getItem(`userCredentials_${email}`);
      if (storedCredentialsString) {
        const storedCredentials = JSON.parse(storedCredentialsString);
        if (storedCredentials.password === password) {
          localStorage.setItem('loggedInUser', JSON.stringify({ email, fullName: storedCredentials.fullName }));
          toast({ title: "Sign In Successful", description: "Welcome back!" });
          router.push('/');
        } else {
          toast({ title: "Sign In Failed", description: "Invalid credentials.", variant: "destructive" });
        }
      } else {
        toast({ title: "Sign In Failed", description: "User not found. Please sign up.", variant: "destructive" });
      }
    }
    setIsLoading(false);
  };

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
        className="absolute top-6 right-6 text-foreground hover:bg-accent/10 py-1 px-2 text-sm h-auto z-10"
      >
        <Languages className="h-4 w-4 mr-1.5" />
        {currentLang === 'en' ? 'हिंदी' : 'English'}
      </Button>

      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Image
            src="https://placehold.co/100x100/FF8C00/FFFFFF?text=O&font=poppins"
            alt="OSO App Logo"
            width={80}
            height={80}
            className="mx-auto mb-3 rounded-full border-2 border-primary p-1 shadow-lg"
            data-ai-hint="oso logo orange"
          />
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {mode === 'signIn' ? (
                <BilingualText en="Sign In" hi="साइन इन करें" lang={currentLang} />
              ) : (
                <BilingualText en="Sign Up" hi="साइन अप करें" lang={currentLang} />
              )}
            </CardTitle>
            <CardDescription>
              {mode === 'signIn' ? (
                <BilingualText en="Welcome back! Please enter your details." hi="वापसी पर स्वागत है! कृपया अपना विवरण दर्ज करें।" lang={currentLang} />
              ) : (
                <BilingualText en="Create your OSO account." hi="अपना OSO खाता बनाएं।" lang={currentLang} />
              )}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mode === 'signUp' && (
                <div className="space-y-1 text-left">
                  <Label htmlFor="fullName" className="flex items-center text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-1.5 text-primary/70" />
                    <BilingualText en="Full Name" hi="पूरा नाम" lang={currentLang} />
                  </Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder_en="Enter your full name" placeholder_hi="अपना पूरा नाम दर्ज करें" required={mode === 'signUp'} />
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
                <div className="space-y-1 text-left">
                  <Label htmlFor="confirmPassword" className="flex items-center text-muted-foreground">
                    <KeyRound className="h-4 w-4 mr-1.5 text-primary/70" />
                    <BilingualText en="Confirm Password" hi="पासवर्ड की पुष्टि करें" lang={currentLang} />
                  </Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder_en="Confirm your password" placeholder_hi="अपने पासवर्ड की पुष्टि करें" required={mode === 'signUp'} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : mode === 'signIn' ? <LogIn className="mr-2"/> : <UserPlus className="mr-2"/>}
                {mode === 'signIn' ? (
                  <BilingualText en="Sign In" hi="साइन इन करें" lang={currentLang} />
                ) : (
                  <BilingualText en="Sign Up" hi="साइन अप करें" lang={currentLang} />
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
