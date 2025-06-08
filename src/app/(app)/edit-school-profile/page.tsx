
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { School, Camera, Save, Mail, Phone, MapPin, UserCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const schoolProfileSchema = z.object({
  schoolName: z.string().min(3, "School name must be at least 3 characters"),
  schoolId: z.string().optional(), // Affiliation code or UDISE
  email: z.string().email("Invalid email address"), // Pre-filled and potentially read-only
  contactPersonName: z.string().min(3, "Contact person name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  boardAffiliation: z.string().min(1, "Board affiliation is required"), // e.g., CBSE, ICSE, State Board
  principalName: z.string().optional(),
  aboutSchool: z.string().max(500, "About school should be max 500 characters").optional(),
  avatarUrl: z.string().optional(), // For school logo
});

export type SchoolProfileFormData = z.infer<typeof schoolProfileSchema>;

const boards = ["CBSE", "ICSE", "State Board (Specify State)", "IB", "Cambridge (IGCSE)", "Other"];
const indianStatesAndUTs = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", 
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi (NCT)", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", 
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal"
].sort();


export default function EditSchoolProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<SchoolProfileFormData>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      schoolName: "",
      schoolId: "",
      email: "",
      contactPersonName: "",
      phoneNumber: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      boardAffiliation: "",
      principalName: "",
      aboutSchool: "",
      avatarUrl: "",
    },
  });
  
  const avatarUrlPreview = watch("avatarUrl");

  useEffect(() => {
    setInitialDataLoading(true);
    const isNewUserFlow = searchParams.get("isNewUser") === "true";
    const emailFromParam = searchParams.get("email");
    const contactPersonNameFromParam = searchParams.get("contactPersonName"); // from sign up

    let currentDefaultValues: Partial<SchoolProfileFormData> = {};

    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('schoolProfileData');
      if (storedProfileString) {
        try {
          currentDefaultValues = JSON.parse(storedProfileString) as SchoolProfileFormData;
        } catch (e) {
          console.error("Failed to parse school profile from localStorage", e);
        }
      }
    }
    
    if (isNewUserFlow) {
      if (emailFromParam) currentDefaultValues.email = emailFromParam;
      if (contactPersonNameFromParam) currentDefaultValues.contactPersonName = contactPersonNameFromParam;
    }
    
    reset(currentDefaultValues); 
    setInitialDataLoading(false);
  }, [searchParams, reset]);


  const onSubmit: SubmitHandler<SchoolProfileFormData> = async (data) => {
    setIsLoading(true);
    console.log("School Profile Data to Save:", data);

    if (typeof window !== "undefined") {
        localStorage.setItem('schoolProfileData', JSON.stringify(data));
        // Update loggedInUser details if necessary (e.g., school name as main identifier)
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            try {
                const loggedInUserDetails = JSON.parse(loggedInUserString);
                if (loggedInUserDetails.email === data.email && loggedInUserDetails.fullName !== data.schoolName) { // Assuming schoolName is the main display name
                    localStorage.setItem('loggedInUser', JSON.stringify({ email: data.email, fullName: data.schoolName, role: 'school' }));
                }
            } catch (e) {
                console.error("Error updating loggedInUser in localStorage for school:", e);
            }
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); 
    toast({
      title: "School Profile Saved",
      description: "Your school's information has been updated.",
    });
    setIsLoading(false);
    router.push("/school-dashboard"); 
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
        toast({ title: "Logo Preview Updated", description: "New logo is shown. Save profile to keep changes." });
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
        <p className="ml-4">Loading school profile form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <School className="h-7 w-7" />
              <BilingualText en="Edit School Profile" hi="स्कूल प्रोफ़ाइल संपादित करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Provide your institution's details." hi="अपने संस्थान का विवरण प्रदान करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={avatarUrlPreview || `https://placehold.co/100x100.png?text=${watch('schoolName')?.substring(0,1) || 'S'}`} alt={watch('schoolName')} data-ai-hint="school logo" />
                <AvatarFallback>{watch('schoolName')?.substring(0,2).toUpperCase() || "SC"}</AvatarFallback>
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
                <BilingualText en="Upload School Logo" hi="स्कूल लोगो अपलोड करें" />
              </Button>
            </div>

            <div>
              <Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" />*</Label>
              <Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} placeholder_en="e.g., Delhi Public School" placeholder_hi="उदा., दिल्ली पब्लिक स्कूल" />} />
              {errors.schoolName && <p className="text-xs text-destructive mt-1">{errors.schoolName.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolId"><BilingualText en="School ID (Affiliation/UDISE)" hi="स्कूल आईडी (संबद्धता/यूडीआईएसई)" /></Label>
                <Controller name="schoolId" control={control} render={({ field }) => <Input id="schoolId" {...field} placeholder_en="e.g., CBSE/12345 or UDISE Code" placeholder_hi="उदा., सीबीएसई/12345 या यूडीआईएसई कोड" />} />
                {errors.schoolId && <p className="text-xs text-destructive mt-1">{errors.schoolId.message}</p>}
              </div>
              <div>
                <Label htmlFor="boardAffiliation"><BilingualText en="Board Affiliation" hi="बोर्ड संबद्धता" />*</Label>
                <Controller
                  name="boardAffiliation"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="boardAffiliation"><SelectValue placeholder_en="Select Board" placeholder_hi="बोर्ड चुनें" /></SelectTrigger>
                      <SelectContent>
                        {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.boardAffiliation && <p className="text-xs text-destructive mt-1">{errors.boardAffiliation.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email"><Mail className="inline mr-1 h-4 w-4"/> <BilingualText en="Official Email" hi="आधिकारिक ईमेल" />*</Label>
                <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} placeholder_en="school@example.com" placeholder_hi="स्कूल@उदाहरण.कॉम" readOnly={!(searchParams.get("isNewUser") === "true")} />} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber"><Phone className="inline mr-1 h-4 w-4"/> <BilingualText en="Contact Number" hi="संपर्क नंबर" />*</Label>
                <Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" type="tel" {...field} placeholder_en="e.g., 01123456789" placeholder_hi="उदा., 01123456789" />} />
                {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="addressLine1"><MapPin className="inline mr-1 h-4 w-4"/> <BilingualText en="Full Address" hi="पूरा पता" />*</Label>
              <Controller name="addressLine1" control={control} render={({ field }) => <Input id="addressLine1" {...field} placeholder_en="Building No., Street Name, Area" placeholder_hi="बिल्डिंग नंबर, गली का नाम, क्षेत्र" />} />
              {errors.addressLine1 && <p className="text-xs text-destructive mt-1">{errors.addressLine1.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city"><BilingualText en="City / Town" hi="शहर / कस्बा" />*</Label>
                <Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} placeholder_en="e.g., New Delhi" placeholder_hi="उदा., नई दिल्ली" />} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="state"><BilingualText en="State / UT" hi="राज्य / केंद्र शासित प्रदेश" />*</Label>
                 <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder_en="Select State" placeholder_hi="राज्य चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStatesAndUTs.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <Label htmlFor="pincode"><BilingualText en="Pincode" hi="पिनकोड" />*</Label>
                <Controller name="pincode" control={control} render={({ field }) => <Input id="pincode" {...field} placeholder="e.g., 110001" />} />
                {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contactPersonName"><UserCircle className="inline mr-1 h-4 w-4"/> <BilingualText en="Contact Person Name" hi="संपर्क व्यक्ति का नाम" />*</Label>
                    <Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} placeholder_en="e.g., Mrs. Anjali Sharma" placeholder_hi="उदा., श्रीमती अंजली शर्मा" />} />
                    {errors.contactPersonName && <p className="text-xs text-destructive mt-1">{errors.contactPersonName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="principalName"><UserCircle className="inline mr-1 h-4 w-4"/> <BilingualText en="Principal's Name (Optional)" hi="प्रधानाचार्य का नाम (वैकल्पिक)" /></Label>
                    <Controller name="principalName" control={control} render={({ field }) => <Input id="principalName" {...field} placeholder_en="e.g., Dr. R. K. Verma" placeholder_hi="उदा., डॉ. आर. के. वर्मा" />} />
                </div>
            </div>
            
            <div>
                <Label htmlFor="aboutSchool"><Info className="inline mr-1 h-4 w-4"/> <BilingualText en="About School (Optional)" hi="स्कूल के बारे में (वैकल्पिक)" /></Label>
                <Controller name="aboutSchool" control={control} render={({ field }) => <Textarea id="aboutSchool" {...field} placeholder_en="Brief description of the school, vision, etc. (max 500 characters)" placeholder_hi="स्कूल का संक्षिप्त विवरण, दृष्टिकोण, आदि। (अधिकतम 500 अक्षर)" className="min-h-[100px]" />} />
                {errors.aboutSchool && <p className="text-xs text-destructive mt-1">{errors.aboutSchool.message}</p>}
            </div>


          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <Save className="mr-2 h-5 w-5" />}
              <BilingualText en="Save School Profile" hi="स्कूल प्रोफ़ाइल सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

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
     interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}

    