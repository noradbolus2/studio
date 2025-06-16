
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
import { CalendarIcon, User, Camera, Save, Mail, Phone, School, Users, TargetIcon, MapPin, Briefcase, Building, Percent, Info, Edit3, Link2, Palette, Code2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  // Common fields used by most/all
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal('')),
  avatarUrl: z.string().optional(),
  dataAiHint: z.string().optional(), // Added for avatar hint
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("India"),

  // Student/Parent specific or general 'person' name
  fullName: z.string().optional(), 

  // School specific fields
  schoolName: z.string().optional(), // Also used for student's school
  schoolId: z.string().optional(), // School's affiliation/UDISE or student's ID at school
  addressLine1: z.string().optional(), // School's address
  pincode: z.string().optional(),
  boardAffiliation: z.string().optional(), // School's board
  principalName: z.string().optional(),
  aboutSchool: z.string().max(500, "About school should be max 500 characters").optional(),

  // Student specific
  className: z.string().optional(), 
  board: z.string().optional(), // Student's board
  stream: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  examTarget: z.string().optional(),

  // Vendor specific
  contactPersonName: z.string().optional(), // Can be pre-filled from signup 'fullName'
  businessName: z.string().optional(),
  gstin: z.string().optional().or(z.literal('')),
  productCategories: z.string().optional(), // Comma-separated or textarea
  businessAddress: z.string().optional(), // Added missing field

  // Creator specific
  creatorName: z.string().optional(), // Can be pre-filled from signup 'fullName'
  expertise: z.string().optional(), // Comma-separated or textarea
  bio: z.string().max(300, "Bio must be 300 characters or less").optional(),
  portfolioLink: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  
  // Role - hidden, but used for logic
  role: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

const studentClasses = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "Competitive Exams"];
const studentBoards = ["CBSE", "ICSE", "State", "Other"];
const studentStreams = ["Science", "Commerce", "Arts", "Other"]; 
const genders = ["Male", "Female", "Other"];
const schoolBoards = ["CBSE", "ICSE", "State Board (Specify State)", "IB", "Cambridge (IGCSE)", "Other"];
const indianStatesAndUTs = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", 
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi (NCT)", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", 
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal"
].sort();

const stateCityData: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  "Delhi (NCT)": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
};

const examTargets = [
  "School Exams", "JEE Main", "JEE Advanced", "BITSAT", "NEET UG (MBBS, BDS, AYUSH, B.V.Sc)", "CAT", "CLAT (UG)", "UPSC Civil Services Examination (IAS, IPS, IFS, etc.)", "SSC CGL", "IBPS PO", "NDA & NA Examination", "CUET UG", "Other Competitive Exam"
].sort();


export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [citiesForSelectedState, setCitiesForSelectedState] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { country: "India" }, // Set default country
  });
  
  const avatarUrlPreview = watch("avatarUrl");
  const selectedState = watch("state");
  const formFullName = watch("fullName");
  const formContactPersonName = watch("contactPersonName");
  const formCreatorName = watch("creatorName");
  const formSchoolName = watch("schoolName");
  const formBusinessName = watch("businessName");


  useEffect(() => {
    setInitialDataLoading(true);
    const roleFromParams = searchParams.get("role") || "student"; 
    setCurrentRole(roleFromParams);

    const emailFromParam = searchParams.get("email");
    const nameFromParam = searchParams.get("name"); 

    let profileDataKey = 'userProfileData'; 
    if (roleFromParams === 'vendor') profileDataKey = 'vendorProfileData';
    else if (roleFromParams === 'creator') profileDataKey = 'creatorProfileData';
    else if (roleFromParams === 'school') profileDataKey = 'schoolProfileData';

    let currentDefaultValues: Partial<ProfileFormData> = { country: "India", role: roleFromParams, dataAiHint: `${roleFromParams} avatar` };

    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem(profileDataKey);
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData & {dateOfBirth?: string};
          currentDefaultValues = {
            ...parsedProfile,
            dateOfBirth: parsedProfile.dateOfBirth ? new Date(parsedProfile.dateOfBirth) : undefined,
            role: roleFromParams, 
            dataAiHint: parsedProfile.dataAiHint || `${roleFromParams} avatar`,
          };
        } catch (e) {
          console.error(`Failed to parse ${profileDataKey} from localStorage`, e);
        }
      }
    }
    
    if (searchParams.get("isNewUser") === "true") {
      if (emailFromParam) currentDefaultValues.email = emailFromParam;
      if (nameFromParam) {
        if (roleFromParams === 'vendor' || roleFromParams === 'school') currentDefaultValues.contactPersonName = nameFromParam;
        else if (roleFromParams === 'creator') currentDefaultValues.creatorName = nameFromParam;
        else currentDefaultValues.fullName = nameFromParam; 
      }
    }
    
    reset(currentDefaultValues); 
    setInitialDataLoading(false);
  }, [searchParams, reset]);

  useEffect(() => {
    if (selectedState) {
      setCitiesForSelectedState(stateCityData[selectedState] || []);
      const currentCity = watch('city');
      if (currentCity && !(stateCityData[selectedState] || []).includes(currentCity)) {
          setValue('city', '', { shouldValidate: true }); 
      }
    } else {
      setCitiesForSelectedState([]);
      setValue('city', '', { shouldValidate: true });
    }
  }, [selectedState, setValue, watch]);


  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsLoading(true);
    
    const dataToStore = {
      ...data,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : undefined,
      role: currentRole, 
      dataAiHint: data.dataAiHint || `${currentRole} avatar`
    };

    let profileDataKey = 'userProfileData';
    let redirectPath = '/profile'; 
    let displayNameForToast = data.fullName;

    if (currentRole === 'parent') redirectPath = '/parent-mode';
    else if (currentRole === 'vendor') {
      profileDataKey = 'vendorProfileData';
      redirectPath = '/vendor-dashboard';
      displayNameForToast = data.businessName || data.contactPersonName;
    } else if (currentRole === 'creator') {
      profileDataKey = 'creatorProfileData';
      redirectPath = '/creator-dashboard';
      displayNameForToast = data.creatorName || data.contactPersonName;
    } else if (currentRole === 'school') {
      profileDataKey = 'schoolProfileData';
      redirectPath = '/school-dashboard';
      displayNameForToast = data.schoolName || data.contactPersonName;
    }
    
    console.log("Submitting to backend (simulated):", JSON.stringify(dataToStore, null, 2));
    console.log("TODO: Replace localStorage with actual API call here.");

    // For now, we'll keep saving to localStorage so the app continues to function visually
    if (typeof window !== "undefined") {
        localStorage.setItem(profileDataKey, JSON.stringify(dataToStore));
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            try {
                const loggedInUserDetails = JSON.parse(loggedInUserString);
                const currentDisplayName = loggedInUserDetails.fullName;
                let newDisplayName = data.fullName; 
                if (currentRole === 'vendor') newDisplayName = data.businessName || data.contactPersonName;
                else if (currentRole === 'creator') newDisplayName = data.creatorName || data.contactPersonName;
                else if (currentRole === 'school') newDisplayName = data.schoolName || data.contactPersonName;

                if (loggedInUserDetails.email === data.email && currentDisplayName !== newDisplayName && newDisplayName) {
                    localStorage.setItem('loggedInUser', JSON.stringify({ email: data.email, fullName: newDisplayName, role: currentRole }));
                }
            } catch (e) { console.error("Error updating loggedInUser name:", e); }
        }
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    toast({
      title: "Profile Data Ready for Backend",
      description: `${displayNameForToast || 'Your'} profile data logged to console. Next step: Implement API call.`,
    });
    setIsLoading(false);
    // router.push(redirectPath); // Commenting out redirect for now to see console log
  };
  
  const handleAvatarUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('avatarUrl', reader.result as string, { shouldValidate: true });
        toast({ title: "Avatar Preview Updated", description: "Save profile to keep changes." });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarFallbackText = () => {
    if (currentRole === 'vendor') return formBusinessName?.substring(0,2).toUpperCase() || formContactPersonName?.substring(0,2).toUpperCase() || "VE";
    if (currentRole === 'creator') return formCreatorName?.substring(0,2).toUpperCase() || formContactPersonName?.substring(0,2).toUpperCase() || "CR";
    if (currentRole === 'school') return formSchoolName?.substring(0,2).toUpperCase() || "SC";
    return formFullName?.substring(0,2).toUpperCase() || "NA";
  };
  
  const getAvatarAltText = () => {
    if (currentRole === 'vendor') return formBusinessName || formContactPersonName || "Vendor";
    if (currentRole === 'creator') return formCreatorName || formContactPersonName || "Creator";
    if (currentRole === 'school') return formSchoolName || "School";
    return formFullName || "User";
  }

  const getAvatarButtonText = () => {
    if (currentRole === 'vendor') return { en: "Upload Shop Logo", hi: "दुकान लोगो अपलोड करें" };
    if (currentRole === 'creator') return { en: "Change Profile Picture", hi: "प्रोफ़ाइल चित्र बदलें" };
    if (currentRole === 'school') return { en: "Upload School Logo", hi: "स्कूल लोगो अपलोड करें" };
    return { en: "Change Picture", hi: "तस्वीर बदलें" };
  };
  const avatarButtonText = getAvatarButtonText();
  const currentDataAiHint = watch('dataAiHint') || `${currentRole} avatar`;


  if (initialDataLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size={48} /><p className="ml-4">Loading profile editor...</p></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <User className="h-7 w-7" />
              <BilingualText en="Edit Profile" hi="प्रोफ़ाइल संपादित करें" />
              {currentRole && <span className="text-base text-muted-foreground">({currentRole.charAt(0).toUpperCase() + currentRole.slice(1)})</span>}
            </CardTitle>
            <CardDescription><BilingualText en="Keep your information up to date." hi="अपनी जानकारी अपडेट रखें।" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage 
                  src={avatarUrlPreview || `https://placehold.co/100x100.png`} 
                  alt={getAvatarAltText()} 
                  data-ai-hint={currentDataAiHint || "avatar"}
                />
                <AvatarFallback>{getAvatarFallbackText()}</AvatarFallback>
              </Avatar>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <Button type="button" variant="outline" size="sm" onClick={handleAvatarUploadButtonClick}>
                <Camera className="mr-2 h-4 w-4" /> <BilingualText en={avatarButtonText.en} hi={avatarButtonText.hi} />
              </Button>
            </div>

            {/* Common Fields */}
            <div>
              <Label htmlFor="email"><Mail className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Email" hi="ईमेल" />*</Label>
              <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} placeholder_en="you@example.com" placeholder_hi="आप@उदाहरण.कॉम" readOnly={!(searchParams.get("isNewUser") === "true")} />} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label>
              <Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" type="tel" {...field} placeholder_en="e.g., 9876543210" placeholder_hi="उदा., 9876543210" />} />
              {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Role-Specific Fields */}
            {(currentRole === 'student' || currentRole === 'parent') && (
              <>
                <div>
                  <Label htmlFor="fullName"><User className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Full Name" hi="पूरा नाम" />*</Label>
                  <Controller name="fullName" control={control} render={({ field }) => <Input id="fullName" {...field} placeholder_en="e.g., Aarav Sharma" placeholder_hi="उदा., आरव शर्मा" />} />
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="schoolName"><School className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="School Name (Student's)" hi="स्कूल का नाम (छात्र का)" /></Label>
                  <Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} placeholder_en="Your School Name" placeholder_hi="आपके स्कूल का नाम" />} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="className"><Percent className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Class" hi="कक्षा" /></Label>
                    <Controller name="className" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="className"><SelectValue placeholder_en="Select Class" placeholder_hi="कक्षा चुनें" /></SelectTrigger><SelectContent>{studentClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                    )} />
                  </div>
                  <div>
                    <Label htmlFor="board"><List className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Board" hi="बोर्ड" /></Label>
                    <Controller name="board" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="board"><SelectValue placeholder_en="Select Board" placeholder_hi="बोर्ड चुनें" /></SelectTrigger><SelectContent>{studentBoards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
                    )} />
                  </div>
                  {(watch("className")?.includes("11") || watch("className")?.includes("12")) && (
                    <div><Label htmlFor="stream"><Palette className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Stream" hi="स्ट्रीम" /></Label>
                     <Controller name="stream" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="stream"><SelectValue placeholder_en="Select Stream" placeholder_hi="स्ट्रीम चुनें" /></SelectTrigger><SelectContent>{studentStreams.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>)} />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth"><CalendarIcon className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Date of Birth" hi="जन्म की तारीख" /></Label>
                    <Controller name="dateOfBirth" control={control} render={({ field }) => (
                      <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span><BilingualText en="Pick a date" hi="एक तारीख चुनें"/></span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus captionLayout="buttons" fromYear={1990} toYear={new Date().getFullYear()} /></PopoverContent></Popover>
                    )} />
                  </div>
                  <div>
                    <Label htmlFor="gender"><Users className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Gender" hi="लिंग" /></Label>
                    <Controller name="gender" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="gender"><SelectValue placeholder_en="Select Gender" placeholder_hi="लिंग चुनें" /></SelectTrigger><SelectContent>{genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="examTarget"><TargetIcon className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Exam Target" hi="परीक्षा लक्ष्य" /></Label>
                  <Controller name="examTarget" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="examTarget"><SelectValue placeholder_en="Select Exam Target" placeholder_hi="परीक्षा लक्ष्य चुनें" /></SelectTrigger><SelectContent>{examTargets.map(target => (<SelectItem key={target} value={target}>{target}</SelectItem>))}</SelectContent></Select>)} />
                  {errors.examTarget && <p className="text-xs text-destructive mt-1">{errors.examTarget.message}</p>}
                </div>
              </>
            )}

            {currentRole === 'vendor' && (
              <>
                <div>
                  <Label htmlFor="contactPersonName"><User className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Contact Person Name" hi="संपर्क व्यक्ति का नाम" />*</Label>
                  <Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} placeholder_en="e.g., Abhishek Verma" placeholder_hi="उदा., अभिषेक वर्मा" />} />
                  {errors.contactPersonName && <p className="text-xs text-destructive mt-1">{errors.contactPersonName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="businessName"><Briefcase className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Business/Shop Name" hi="व्यवसाय/दुकान का नाम" />*</Label>
                  <Controller name="businessName" control={control} render={({ field }) => <Input id="businessName" {...field} placeholder_en="e.g., Verma Stationery Mart" placeholder_hi="उदा., वर्मा स्टेशनरी मार्ट" />} />
                  {errors.businessName && <p className="text-xs text-destructive mt-1">{errors.businessName.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="businessAddress"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Business Address" hi="व्यवसाय का पता" />*</Label>
                  <Controller name="businessAddress" control={control} render={({ field }) => <Textarea id="businessAddress" {...field} placeholder_en="Full Shop Address" placeholder_hi="दुकान का पूरा पता" />} />
                  {errors.businessAddress && <p className="text-xs text-destructive mt-1">{errors.businessAddress.message}</p>}
                </div>
                <div>
                  <Label htmlFor="gstin"><Info className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="GSTIN (Optional)" hi="जीएसटीआईएन (वैकल्पिक)" /></Label>
                  <Controller name="gstin" control={control} render={({ field }) => <Input id="gstin" {...field} placeholder="15-digit GSTIN" />} />
                </div>
                <div>
                  <Label htmlFor="productCategories"><List className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Product Categories" hi="उत्पाद श्रेणियाँ" /></Label>
                  <Controller name="productCategories" control={control} render={({ field }) => <Textarea id="productCategories" {...field} placeholder_en="e.g., Notebooks, Pens, Art Supplies, Exam Guides" placeholder_hi="उदा., नोटबुक, पेन, कला सामग्री, परीक्षा गाइड" />} />
                </div>
              </>
            )}

            {currentRole === 'creator' && (
              <>
                 <div>
                  <Label htmlFor="contactPersonName"><User className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Your Full Name" hi="आपका पूरा नाम" />*</Label>
                  <Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} placeholder_en="e.g., Ananya Sharma" placeholder_hi="उदा., अनन्या शर्मा" />} />
                  {errors.contactPersonName && <p className="text-xs text-destructive mt-1">{errors.contactPersonName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="creatorName"><Edit3 className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Creator/Channel Name (Optional)" hi="निर्माता/चैनल का नाम (वैकल्पिक)" /></Label>
                  <Controller name="creatorName" control={control} render={({ field }) => <Input id="creatorName" {...field} placeholder_en="e.g., Creative Minds Hub" placeholder_hi="उदा., क्रिएटिव माइंड्स हब" />} />
                </div>
                 <div>
                  <Label htmlFor="expertise"><Code2 className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Expertise/Skills" hi="विशेषज्ञता/कौशल" /></Label>
                  <Controller name="expertise" control={control} render={({ field }) => <Textarea id="expertise" {...field} placeholder_en="e.g., Science Projects, Python Coding, Oil Painting" placeholder_hi="उदा., विज्ञान प्रोजेक्ट, पायथन कोडिंग, तेल चित्रकला" />} />
                </div>
                 <div>
                  <Label htmlFor="bio"><Info className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Short Bio (Max 300 chars)" hi="संक्षिप्त बायो (अधिकतम 300 अक्षर)" /></Label>
                  <Controller name="bio" control={control} render={({ field }) => <Textarea id="bio" {...field} className="min-h-[80px]" placeholder_en="Tell us about yourself and your creative work." placeholder_hi="हमें अपने और अपने रचनात्मक काम के बारे में बताएं।" />} />
                   {errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>}
                </div>
                <div>
                  <Label htmlFor="portfolioLink"><Link2 className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Portfolio/Website Link (Optional)" hi="पोर्टफोलियो/वेबसाइट लिंक (वैकल्पिक)" /></Label>
                  <Controller name="portfolioLink" control={control} render={({ field }) => <Input id="portfolioLink" type="url" {...field} placeholder="https://yourportfolio.com" />} />
                  {errors.portfolioLink && <p className="text-xs text-destructive mt-1">{errors.portfolioLink.message}</p>}
                </div>
              </>
            )}
            
            {currentRole === 'school' && (
               <>
                <div>
                  <Label htmlFor="contactPersonName"><User className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Contact Person Name" hi="संपर्क व्यक्ति का नाम" />*</Label>
                  <Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} placeholder_en="e.g., Mrs. Anjali Sharma" placeholder_hi="उदा., श्रीमती अंजली शर्मा" />} />
                  {errors.contactPersonName && <p className="text-xs text-destructive mt-1">{errors.contactPersonName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="schoolName"><Building className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="School Name" hi="स्कूल का नाम" />*</Label>
                  <Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} placeholder_en="e.g., Delhi Public School" placeholder_hi="उदा., दिल्ली पब्लिक स्कूल" />} />
                  {errors.schoolName && <p className="text-xs text-destructive mt-1">{errors.schoolName.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolId"><Info className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="School ID (Affiliation/UDISE)" hi="स्कूल आईडी (संबद्धता/यूडीआईएसई)" /></Label>
                    <Controller name="schoolId" control={control} render={({ field }) => <Input id="schoolId" {...field} placeholder_en="e.g., CBSE/12345" placeholder_hi="उदा., सीबीएसई/12345" />} />
                  </div>
                  <div>
                    <Label htmlFor="boardAffiliation"><List className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Board Affiliation" hi="बोर्ड संबद्धता" />*</Label>
                    <Controller name="boardAffiliation" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="boardAffiliation"><SelectValue placeholder_en="Select Board" placeholder_hi="बोर्ड चुनें" /></SelectTrigger><SelectContent>{schoolBoards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent></Select>
                    )} />
                    {errors.boardAffiliation && <p className="text-xs text-destructive mt-1">{errors.boardAffiliation.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="addressLine1"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Full Address" hi="पूरा पता" />*</Label>
                  <Controller name="addressLine1" control={control} render={({ field }) => <Input id="addressLine1" {...field} placeholder_en="Building No., Street Name, Area" placeholder_hi="बिल्डिंग नंबर, गली का नाम, क्षेत्र" />} />
                  {errors.addressLine1 && <p className="text-xs text-destructive mt-1">{errors.addressLine1.message}</p>}
                </div>
                <div>
                  <Label htmlFor="pincode"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Pincode" hi="पिनकोड" />*</Label>
                  <Controller name="pincode" control={control} render={({ field }) => <Input id="pincode" {...field} placeholder_en="e.g., 110001" placeholder_hi="उदा., 110001" />} />
                  {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="principalName"><User className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Principal's Name (Optional)" hi="प्रधानाचार्य का नाम (वैकल्पिक)" /></Label>
                  <Controller name="principalName" control={control} render={({ field }) => <Input id="principalName" {...field} placeholder_en="e.g., Dr. R. K. Verma" placeholder_hi="उदा., डॉ. आर. के. वर्मा" />} />
                </div>
                <div>
                  <Label htmlFor="aboutSchool"><Info className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="About School (Optional)" hi="स्कूल के बारे में (वैकल्पिक)" /></Label>
                  <Controller name="aboutSchool" control={control} render={({ field }) => <Textarea id="aboutSchool" {...field} className="min-h-[100px]" placeholder_en="Brief school description (max 500 chars)" placeholder_hi="स्कूल का संक्षिप्त विवरण (अधिकतम 500 अक्षर)" />} />
                  {errors.aboutSchool && <p className="text-xs text-destructive mt-1">{errors.aboutSchool.message}</p>}
                </div>
              </>
            )}

            {/* Location Fields (Common for most roles except maybe a very basic student profile) */}
            {(currentRole === 'student' || currentRole === 'parent' || currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'school') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <Label htmlFor="state"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="State" hi="राज्य" /></Label>
                  <Controller name="state" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="state"><SelectValue placeholder_en="Select State" placeholder_hi="राज्य चुनें" /></SelectTrigger><SelectContent>{indianStatesAndUTs.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
                  )} />
                </div>
                <div>
                  <Label htmlFor="city"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="City / District" hi="शहर / जिला" /></Label>
                  <Controller name="city" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState || citiesForSelectedState.length === 0}><SelectTrigger id="city"><SelectValue placeholder_en={!selectedState ? "Select State first" : "Select City/District"} placeholder_hi={!selectedState ? "पहले राज्य चुनें" : "शहर/जिला चुनें"} /></SelectTrigger><SelectContent>{citiesForSelectedState.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select>
                  )} />
                  {citiesForSelectedState.length === 0 && selectedState && <p className="text-xs text-muted-foreground mt-1">No cities listed for {selectedState}. Type to add.</p>}
                </div>
                <div>
                  <Label htmlFor="country"><MapPin className="inline mr-1 h-4 w-4 text-muted-foreground" /> <BilingualText en="Country" hi="देश" /></Label>
                  <Controller name="country" control={control} render={({ field }) => <Input id="country" {...field} readOnly />} />
                </div>
              </div>
            )}

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
