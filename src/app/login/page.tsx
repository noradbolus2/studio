
"use client";

import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, School, User as UserIcon, Sparkles as CreatorIcon, Bike, ExternalLink, ShieldCheck, UserCheck, GraduationCap, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
  { id: 'student', labelEn: "Student", labelHi: "छात्र", icon: GraduationCap },
  { id: 'parent', labelEn: "Parent", labelHi: "अभिभावक", icon: UserCheck },
  { id: 'teacher', labelEn: "Teacher", labelHi: "शिक्षक", icon: Briefcase },
  { id: 'creator', labelEn: "Creator", labelHi: "निर्माता", icon: CreatorIcon },
  { id: 'school', labelEn: "School Partner", labelHi: "स्कूल पार्टनर", icon: School },
  { id: 'vendor', labelEn: "Vendor Partner", labelHi: "विक्रेता पार्टनर", icon: Briefcase },
  { id: 'rider', labelEn: "Rider Partner", labelHi: "राइडर पार्टनर", icon: Bike },
  { id: 'platform-admin', labelEn: "Platform Admin", labelHi: "प्लेटफ़ॉर्म एडमिन", icon: ShieldCheck },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  
  const handleRoleSelection = (role: string) => {
    if (role === 'student' || role === 'parent') {
        // For Student and Parent, we can directly log in/sign up as them
        router.push(`/auth?role=${role}`);
    } else {
        // For other roles, we guide them to the sign-in page
        router.push(`/auth?role=${role}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 font-body">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary bg-primary text-5xl font-bold text-primary-foreground shadow-2xl">
          OSO
        </div>
        <h1 className="text-3xl font-bold font-headline text-foreground">
          <BilingualText en="What is your role?" hi="आपकी भूमिका क्या है?" />
        </h1>
        <p className="text-muted-foreground mt-2">
          <BilingualText en="Choose your profile to continue." hi="जारी रखने के लिए अपनी प्रोफ़ाइल चुनें।" />
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {roles.map((role) => (
            <Card
              key={role.id}
              onClick={() => handleRoleSelection(role.id)}
              className="group cursor-pointer hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-200"
            >
              <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                <role.icon className="h-10 w-10 text-primary mb-3 transition-transform duration-200 group-hover:scale-110" />
                <p className="font-semibold text-center text-sm">
                  <BilingualText en={role.labelEn} hi={role.labelHi} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-xs text-muted-foreground">
          <BilingualText 
            en="Are you a school, vendor, or rider? Join our network!" 
            hi="क्या आप एक स्कूल, विक्रेता, या राइडर हैं? हमारे नेटवर्क में शामिल हों!"
          />
          <Button variant="link" className="p-0 h-auto ml-1 text-xs text-primary" asChild>
            <Link href="/partner-with-us"><BilingualText en="Partner with us" hi="हमारे साथ भागीदार बनें" /> <ExternalLink className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
