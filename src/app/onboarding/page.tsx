
"use client";
import { WelcomeMessageCard } from "@/components/shared/WelcomeMessageCard";
import { useRouter } from "next/navigation"; // Corrected import for App Router

export default function OnboardingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to home page or next onboarding step
    router.push('/'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <WelcomeMessageCard onGetStarted={handleGetStarted} />
      {/* Add more onboarding steps/slides here if needed */}
    </div>
  );
}
