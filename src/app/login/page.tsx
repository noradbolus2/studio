
"use client";
import { useState } from "react";
import Image from "next/image";
import { Languages, User, Briefcase, School, UserCheck, LogIn } from "lucide-react"; // Added new icons
import { Button } from "@/components/ui/button";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoleSelectionPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const router = useRouter();

  const handleLanguageToggle = () => {
    setCurrentLang(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const handleRoleSelection = (role: string) => {
    // For now, all roles will navigate to the auth page.
    // This can be customized later if different roles have different auth flows.
    router.push(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-6 font-body relative">
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
           <p className="text-lg font-semibold text-primary">
            <BilingualText en="OSO App" hi="ओसो ऐप" lang={currentLang} />
          </p>
          <p className="text-sm text-muted-foreground">
            <BilingualText en="Learn & Deliver" hi="सीखें और वितरित करें" lang={currentLang} />
          </p>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              <BilingualText en="Welcome to OSO!" hi="OSO में आपका स्वागत है!" lang={currentLang} />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Please select your role to continue." hi="कृपया जारी रखने के लिए अपनी भूमिका चुनें।" lang={currentLang} />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { role: 'student', labelEn: 'Student', labelHi: 'छात्र', icon: User },
              { role: 'parent', labelEn: 'Parent', labelHi: 'अभिभावक', icon: UserCheck },
              { role: 'school', labelEn: 'School', labelHi: 'स्कूल', icon: School },
              { role: 'vendor', labelEn: 'Vendor', labelHi: 'विक्रेता', icon: Briefcase },
            ].map(item => (
              <Button
                key={item.role}
                variant="outline"
                className="w-full justify-start text-lg py-6 h-auto hover:bg-primary/5 hover:border-primary"
                onClick={() => handleRoleSelection(item.role)}
              >
                <item.icon className="h-5 w-5 mr-3 text-primary" />
                <BilingualText en={item.labelEn} hi={item.labelHi} lang={currentLang} />
              </Button>
            ))}
          </CardContent>
          <CardContent className="border-t pt-4 mt-2">
             <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push('/auth')}
              >
                <LogIn className="mr-2" />
                <BilingualText en="Sign In / Sign Up" hi="साइन इन / साइन अप करें" lang={currentLang} />
              </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-xs text-muted-foreground space-y-1">
          <p>
            <BilingualText en="By continuing, you agree to OSO's Terms & Privacy Policy." hi="जारी रखने पर, आप OSO की शर्तों और गोपनीयता नीति से सहमत होते हैं।" lang={currentLang} />
          </p>
        </div>
      </div>
    </div>
  );
}
