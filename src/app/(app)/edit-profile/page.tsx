
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CalendarIcon, User, Camera, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal('')),
  schoolName: z.string().optional(),
  schoolId: z.string().optional(),
  className: z.string().optional(), // Using string for Select component
  board: z.string().optional(),
  stream: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  examTarget: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("India"),
  avatarUrl: z.string().optional(), // For storing the URL
});

type ProfileFormData = z.infer<typeof profileSchema>;

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "Competitive Exams"];
const boards = ["CBSE", "ICSE", "State", "Other"];
const streams = ["Science", "Commerce", "Arts", "Other"]; // "Other" for those not in 11/12 or different stream
const genders = ["Male", "Female", "Other"];

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loginType, setLoginType] = useState<string | null>(null);
  const [isSchoolLogin, setIsSchoolLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: "India",
    },
  });
  
  const avatarUrlPreview = watch("avatarUrl");


  useEffect(() => {
    const typeParam = searchParams.get("loginType");
    const isNew = searchParams.get("isNewUser") === "true";
    
    setLoginType(typeParam);
    setIsSchoolLogin(typeParam === "school");

    let defaultValues: Partial<ProfileFormData> = { country: "India" };

    if (typeParam === "school") {
      defaultValues = {
        ...defaultValues,
        schoolId: searchParams.get("schoolId") || "",
        fullName: searchParams.get("fullName") || "Mock School User", 
        schoolName: searchParams.get("schoolName") || "Mock School Name", 
        className: searchParams.get("className") || "", 
        email: searchParams.get("email") || "school.user@example.com", 
      };
    } else if (typeParam === "direct") {
      if (isNew) {
        defaultValues = { ...defaultValues, email: searchParams.get("email") || "" };
      } else {
        defaultValues = {
          ...defaultValues,
          fullName: "Existing User",
          email: searchParams.get("email") || "existing.user@example.com",
          phoneNumber: "9876543210",
          className: "11 Science",
          board: "CBSE",
          stream: "Science", // This will be set correctly if className is "11 Science"
          dateOfBirth: new Date(2005, 7, 15), // month is 0-indexed
          city: "Mumbai",
          state: "Maharashtra",
          avatarUrl: "https://placehold.co/100x100.png",
        };
      }
    }
    reset(defaultValues); 
    setInitialDataLoading(false);
  }, [searchParams, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsLoading(true);
    console.log("Profile Data to Save:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Profile Saved (Simulated)",
      description: "Your profile information has been updated.",
    });
    setIsLoading(false);
    router.push("/profile"); 
  };
  
  const handleAvatarUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG).",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('avatarUrl', reader.result as string, { shouldValidate: true });
        toast({ title: "Avatar Preview Updated", description: "New avatar is shown. Save profile to keep changes." });
      };
      reader.onerror = () => {
        toast({
          title: "Error Reading File",
          description: "Could not read the selected image file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };


  if (initialDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <User className="h-7 w-7" />
              <BilingualText en="Edit Your Profile" hi="अपनी प्रोफ़ाइल संपादित करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Keep your information up to date." hi="अपनी जानकारी अपडेट रखें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={avatarUrlPreview || `https://placehold.co/100x100.png?text=${watch('fullName')?.substring(0,1) || 'U'}`} alt={watch('fullName')} data-ai-hint="user avatar" />
                <AvatarFallback>{watch('fullName')?.substring(0,2).toUpperCase() || "NA"}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAvatarUploadButtonClick}>
                <Camera className="mr-2 h-4 w-4" />
                <BilingualText en="Change Picture" hi=" तस्वीर बदलें" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName"><BilingualText en="Full Name" hi="पूरा नाम" />*</Label>
                <Controller name="fullName" control={control} render={({ field }) => <Input id="fullName" {...field} placeholder_en="e.g., Aarav Sharma" placeholder_hi="उदा., आरव शर्मा" />} />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email"><BilingualText en="Email" hi="ईमेल" />*</Label>
                <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} placeholder_en="you@example.com" placeholder_hi="आप@उदाहरण.कॉम" readOnly={loginType === "direct" && !searchParams.get("isNewUser") === true} />} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div>
                <Label htmlFor="phoneNumber"><BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label>
                <Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" type="tel" {...field} placeholder_en="e.g., 9876543210" placeholder_hi="उदा., 9876543210" />} />
                {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" /></Label>
                <Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} placeholder_en="Your School Name" placeholder_hi="आपके स्कूल का नाम" readOnly={isSchoolLogin} />} />
              </div>
              {isSchoolLogin && (
                <div>
                  <Label htmlFor="schoolId"><BilingualText en="School ID" hi="स्कूल आईडी" /></Label>
                  <Controller name="schoolId" control={control} render={({ field }) => <Input id="schoolId" {...field} readOnly />} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="className"><BilingualText en="Class" hi="कक्षा" /></Label>
                <Controller
                  name="className"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="className"><SelectValue placeholder_en="Select Class" placeholder_hi="कक्षा चुनें" /></SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="board"><BilingualText en="Board" hi="बोर्ड" /></Label>
                <Controller
                  name="board"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="board"><SelectValue placeholder_en="Select Board" placeholder_hi="बोर्ड चुनें" /></SelectTrigger>
                      <SelectContent>
                        {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {(watch("className")?.includes("11") || watch("className")?.includes("12")) && (
                <div>
                  <Label htmlFor="stream"><BilingualText en="Stream" hi="स्ट्रीम" /></Label>
                   <Controller
                    name="stream"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="stream"><SelectValue placeholder_en="Select Stream" placeholder_hi="स्ट्रीम चुनें" /></SelectTrigger>
                        <SelectContent>
                            {streams.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    )}
                    />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth"><BilingualText en="Date of Birth" hi="जन्म की तारीख" /></Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd-MM-yyyy") : <span><BilingualText en="Pick a date" hi="एक तारीख चुनें"/></span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1990}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="gender"><BilingualText en="Gender" hi="लिंग" /></Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="gender"><SelectValue placeholder_en="Select Gender" placeholder_hi="लिंग चुनें" /></SelectTrigger>
                      <SelectContent>
                        {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="examTarget"><BilingualText en="Exam Target(s)" hi="परीक्षा लक्ष्य" /></Label>
              <Controller name="examTarget" control={control} render={({ field }) => <Input id="examTarget" {...field} placeholder_en="e.g., NEET, JEE, CUET" placeholder_hi="उदा., NEET, JEE, CUET" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city"><BilingualText en="City" hi="शहर" /></Label>
                <Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} placeholder_en="Your City" placeholder_hi="आपका शहर" />} />
              </div>
              <div>
                <Label htmlFor="state"><BilingualText en="State" hi="राज्य" /></Label>
                <Controller name="state" control={control} render={({ field }) => <Input id="state" {...field} placeholder_en="Your State" placeholder_hi="आपका राज्य" />} />
              </div>
              <div>
                <Label htmlFor="country"><BilingualText en="Country" hi="देश" /></Label>
                <Controller name="country" control={control} render={({ field }) => <Input id="country" {...field} readOnly />} />
              </div>
            </div>

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

// For placeholder_en and placeholder_hi in SelectValue (this is a conceptual extension as SelectValue doesn't directly support dual placeholders)
// A custom component would be needed or use a single language placeholder. For now, the default placeholder for SelectValue will be used.
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}

