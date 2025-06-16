
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { User, Save } from "lucide-react";

// Minimal schema for parsing test
const profileSchemaMinimal = z.object({
  email: z.string().email("Invalid email address").optional(),
  role: z.string().optional(),
});

export type ProfileFormDataMinimal = z.infer<typeof profileSchemaMinimal>;

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormDataMinimal>({
    resolver: zodResolver(profileSchemaMinimal),
    defaultValues: { role: "student" },
  });

  useEffect(() => {
    setInitialDataLoading(true);
    const roleFromParams = searchParams.get("role") || "student";
    setCurrentRole(roleFromParams);
    
    let initialEmail = "";
    if (typeof window !== "undefined") {
        const emailFromParam = searchParams.get("email");
        if (emailFromParam) {
            initialEmail = emailFromParam;
        }
    }
    reset({ role: roleFromParams, email: initialEmail });
    setInitialDataLoading(false);
  }, [searchParams, reset]);

  const onSubmitMinimal: SubmitHandler<ProfileFormDataMinimal> = async (data) => {
    setIsLoading(true);
    console.log("Minimal Form Data Submitted:", data);
    toast({
      title: "Profile Save Attempted (Minimal)",
      description: "Check console for data. Navigation to home.",
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    router.push('/'); // Navigate to home for simplicity
  };

  if (initialDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4">Loading profile editor...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmitMinimal)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <User className="h-7 w-7" />
              <BilingualText en="Edit Profile (Minimal)" hi="प्रोफ़ाइल संपादित करें (न्यूनतम)" />
              {currentRole && <span className="text-base text-muted-foreground">({currentRole.charAt(0).toUpperCase() + currentRole.slice(1)})</span>}
            </CardTitle>
            <CardDescription><BilingualText en="Keep your information up to date." hi="अपनी जानकारी अपडेट रखें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email"><BilingualText en="Email" hi="ईमेल" />*</Label>
              <Controller 
                name="email" 
                control={control} 
                render={({ field }) => (
                  <Input 
                    id="email" 
                    type="email" 
                    {...field} 
                    placeholder="you@example.com" 
                    value={field.value || ""} // Ensure value is not undefined
                  />
                )} 
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
             <p>Role: {currentRole}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <Save className="mr-2 h-5 w-5" />}
              <BilingualText en="Save Profile" hi="प्रोफ़ाइल सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
