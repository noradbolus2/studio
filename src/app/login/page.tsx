
"use client";
import { useState } from "react";
import Image from "next/image";
import { Languages, User, Briefcase, School, UserCheck, LogIn, Sparkles as CreatorIcon } from "lucide-react";
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
    router.push(`/auth?role=${role}`);
  };

  const roles = [
    { role: 'student', labelEn: 'Student', labelHi: 'छात्र', icon: User },
    { role: 'parent', labelEn: 'Parent', labelHi: 'अभिभावक', icon: UserCheck },
    { role: 'school', labelEn: 'School', labelHi: 'स्कूल', icon: School },
    { role: 'vendor', labelEn: 'Vendor', labelHi: 'विक्रेता', icon: Briefcase },
    { role: 'creator', labelEn: 'Creator', labelHi: 'निर्माता', icon: CreatorIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-6 font-body relative">
      <Button
        onClick={handleLanguageToggle}
        variant="outline"
        className="absolute top-6 right-6 bg-card/50 backdrop-blur-sm border-border/30 hover:bg-card/70 text-foreground py-1 px-2 text-sm h-auto z-10"
      >
        <Languages className="h-4 w-4 mr-1.5" />
        {currentLang === 'en' ? 'हिंदी' : 'English'}
      </Button>

      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <Image
            src="https://placehold.co/100x100/FF8C00/FFFFFF?text=O&font=poppins"
            alt="OSO App Logo"
            width={80}
            height={80}
            className="mx-auto mb-2 rounded-full border-2 border-primary p-0.5 shadow-xl"
            data-ai-hint="oso logo orange"
          />
           <p className="text-2xl font-bold text-primary mb-0.5">
            <BilingualText en="OSO App" hi="ओसो ऐप" lang={currentLang} />
          </p>
          <p className="text-md text-muted-foreground">
            <BilingualText en="Learn & Deliver" hi="सीखें और वितरित करें" lang={currentLang} />
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-headline text-primary">
              <BilingualText en="Welcome to OSO!" hi="OSO में आपका स्वागत है!" lang={currentLang} />
            </CardTitle>
            <CardDescription className="text-sm">
              <BilingualText en="Please select your role to continue." hi="कृपया जारी रखने के लिए अपनी भूमिका चुनें।" lang={currentLang} />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map(item => (
              <Button
                key={item.role}
                variant="outline"
                className="w-full justify-start text-base py-3 h-14 border-border/50 hover:bg-accent/20 hover:border-accent"
                onClick={() => handleRoleSelection(item.role)}
              >
                <item.icon className="h-6 w-6 mr-4 text-primary" />
                <BilingualText en={item.labelEn} hi={item.labelHi} lang={currentLang} />
              </Button>
            ))}
          </CardContent>
          <CardContent className="border-t border-border/30 pt-4 mt-2">
             <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base h-12"
                onClick={() => router.push('/auth')}
              >
                <LogIn className="mr-2 h-5 w-5" />
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
