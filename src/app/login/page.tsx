
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BilingualText } from "@/components/shared/BilingualText";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Image src="https://placehold.co/100x100.png" alt="OSO App Logo" width={60} height={60} className="mx-auto mb-3 rounded-full border border-primary data-ai-hint="app logo"" />
          <CardTitle className="text-2xl font-headline">
            <BilingualText en="Login to OSO App" hi="OSO ऐप में लॉगिन करें" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Continue your learning journey." hi="अपनी सीखने की यात्रा जारी रखें।" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Option A: School-issued ID login */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-center gap-2 py-6 text-base border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <ShieldCheck className="h-5 w-5" /> 
              <BilingualText en="Login with School ID" hi="स्कूल आईडी से लॉगिन करें" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <BilingualText en="Or" hi="या" />
              </span>
            </div>
          </div>
          
          {/* Option B: Regular student sign-up/login */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="email"><BilingualText en="Email or Phone" hi="ईमेल या फ़ोन" /></Label>
              <Input id="email" type="text" placeholder_en="your.email@example.com" placeholder_hi="आपका.ईमेल@उदाहरण.कॉम" />
            </div>
            <div>
              <Label htmlFor="password"><BilingualText en="Password" hi="पासवर्ड" /></Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
                <BilingualText en="Login" hi="लॉग इन करें" />
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <BilingualText en="Don't have an account?" hi="खाता नहीं है?" />{' '}
            <Link href="/onboarding" className="font-medium text-primary hover:underline">
              <BilingualText en="Sign Up" hi="साइन अप करें" />
            </Link>
          </div>

        </CardContent>
        <CardFooter className="flex-col space-y-2">
            {/* Option C: Parent login */}
            <Button variant="ghost" className="w-full justify-center gap-2 text-muted-foreground hover:text-primary">
              <Users className="h-5 w-5" /> 
              <BilingualText en="Parent Login" hi="अभिभावक लॉगिन" />
            </Button>
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
