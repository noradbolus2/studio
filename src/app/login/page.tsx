
"use client";
import { useState } from "react";
import Image from "next/image";
import { BookOpen, Users, School, ShoppingBag, Bike, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginRoleButtonProps {
  icon: React.ElementType;
  labelEn: string;
  labelHi: string;
  action: () => void;
  bgColorClass: string;
  glowClass: string;
  hoverGlowClass: string;
  lang: 'en' | 'hi';
}

const LoginRoleButton: React.FC<LoginRoleButtonProps> = ({ icon: Icon, labelEn, labelHi, action, bgColorClass, glowClass, hoverGlowClass, lang }) => {
  return (
    <button
      onClick={action}
      className={cn(
        "w-full flex items-center justify-center text-white font-bold uppercase text-base py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105",
        bgColorClass,
        glowClass,
        hoverGlowClass
      )}
    >
      <Icon className="h-6 w-6 mr-3" />
      <BilingualText en={labelEn} hi={labelHi} lang={lang} />
    </button>
  );
};

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const router = useRouter();
  const { toast } = useToast();

  const handleLanguageToggle = () => {
    setCurrentLang(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const handleStudentLogin = () => {
    toast({ title: "Student Login", description: "Proceeding to student login/signup..." });
    // In a real app, navigate to student login flow
     router.push("/edit-profile?loginType=direct&isNewUser=false"); // Example navigation
  };

  const handleParentLogin = () => {
    toast({ title: "Parent Login", description: "Proceeding to parent login/signup..." });
    // In a real app, navigate to parent login flow
    router.push("/parent-mode"); // Example navigation
  };

  const handleSchoolLogin = () => {
    toast({ title: "School Login", description: "Redirecting to OSO School Partner App..." });
    // In a real app, this would be an actual redirect: window.location.href = "https://school.osoapp.com";
    console.log("Redirecting to School Partner App (Simulated)");
  };

  const handleVendorLogin = () => {
    toast({ title: "Vendor Login", description: "Redirecting to OSO Vendor Partner App..." });
    console.log("Redirecting to Vendor Partner App (Simulated)");
    router.push("/vendor-dashboard");
  };

  const handleRiderLogin = () => {
    toast({ title: "Rider Login", description: "Redirecting to OSO Rider App..." });
    console.log("Redirecting to Rider Partner App (Simulated)");
    router.push("/rider-dashboard");
  };

  const loginRoles = [
    { icon: BookOpen, labelEn: "Student Login", labelHi: "छात्र लॉगिन", action: handleStudentLogin, bgColorClass: "bg-login-orange", glowClass: "shadow-glow-orange", hoverGlowClass: "hover:shadow-glow-orange-hover" },
    { icon: Users, labelEn: "Parent Login", labelHi: "अभिभावक लॉगिन", action: handleParentLogin, bgColorClass: "bg-login-orange", glowClass: "shadow-glow-orange", hoverGlowClass: "hover:shadow-glow-orange-hover" },
    { icon: School, labelEn: "School Login", labelHi: "स्कूल लॉगिन", action: handleSchoolLogin, bgColorClass: "bg-login-aqua-mint", glowClass: "shadow-glow-mint", hoverGlowClass: "hover:shadow-glow-mint-hover" },
    { icon: ShoppingBag, labelEn: "Vendor Login", labelHi: "विक्रेता लॉगिन", action: handleVendorLogin, bgColorClass: "bg-login-aqua-mint", glowClass: "shadow-glow-mint", hoverGlowClass: "hover:shadow-glow-mint-hover" },
    { icon: Bike, labelEn: "Rider Login", labelHi: "राइडर लॉगिन", action: handleRiderLogin, bgColorClass: "bg-login-aqua-mint", glowClass: "shadow-glow-mint", hoverGlowClass: "hover:shadow-glow-mint-hover" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-deep-purple to-darker-purple p-6 font-sans relative">
      <Button
        onClick={handleLanguageToggle}
        variant="ghost"
        className="absolute top-6 right-6 text-white hover:bg-white/10 py-1 px-2 text-sm h-auto"
      >
        <Languages className="h-4 w-4 mr-1.5" />
        {currentLang === 'en' ? 'हिंदी' : 'English'}
      </Button>

      <div className="w-full max-w-sm text-center">
        {/* Top Section: Branding */}
        <div className="mb-10">
          <Image
            src="https://placehold.co/100x100/FFB6C1/3B0A4E?text=OSO&font=poppins" // Placeholder, Light Pink glow
            alt="OSO App Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full shadow-logo-glow"
            data-ai-hint="app logo glowing"
          />
          <p className="text-base font-bold text-white">
            <BilingualText en="India’s 1st Edu + Delivery App" hi="भारत का पहला एडु + डिलीवरी ऐप" lang={currentLang} />
          </p>
        </div>

        {/* Middle Section: Choose Login Role */}
        <div className="space-y-4 mb-12">
          {loginRoles.map((role) => (
            <LoginRoleButton
              key={role.labelEn}
              icon={role.icon}
              labelEn={role.labelEn}
              labelHi={role.labelHi}
              action={role.action}
              bgColorClass={role.bgColorClass}
              glowClass={role.glowClass}
              hoverGlowClass={role.hoverGlowClass}
              lang={currentLang}
            />
          ))}
        </div>

        {/* Bottom Section: Info & Support */}
        <div className="text-xs text-login-support-text space-y-1">
          <p>
            <BilingualText en="Don’t have an account?" hi="खाता नहीं है?" lang={currentLang} />{' '}
            <BilingualText en="Register with your role." hi="अपनी भूमिका के साथ पंजीकरण करें।" lang={currentLang} />
          </p>
          <p>
            <BilingualText en="Need help?" hi="मदद चाहिए?" lang={currentLang} />{' '}
            <a href="#" className="underline hover:text-white">
              <BilingualText en="Contact OSO Support" hi="OSO सहायता से संपर्क करें" lang={currentLang} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
