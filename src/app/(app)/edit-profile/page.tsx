
"use client";

import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, isValid } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { User, Save, UploadCloud, School, Briefcase, Sparkles as CreatorIcon, Users as ParentIcon, Edit3, KeyRound, ShieldCheck } from "lucide-react";

const schoolDesignations = ["Principal", "Vice Principal", "Coordinator", "Teacher", "Accountant", "Admin Staff", "Librarian", "IT Support", "Other"];
const vendorCategories = ["Stationery", "Books", "Uniforms", "Electronics", "Snacks", "Project Kits", "Other"];
const creatorExpertiseAreas = ["Science Projects", "Art & Craft", "Coding & AI", "Robotics", "Essay Writing", "Video Content", "Tutoring", "Other"];
const DEFAULT_SCHOOL_ID = "defaultSchool"; 

const profileSchema = z.object({
  role: z.string().optional(),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().optional(),
  dataAiHint: z.string().optional(),

  // Student specific
  phoneNumber: z.string().optional(),
  schoolName: z.string().optional(), 
  schoolId: z.string().optional(), 
  className: z.string().optional(), 
  board: z.string().optional(),
  stream: z.string().optional(),
  dateOfBirth: z.string().optional(), 
  gender: z.string().optional(),
  examTarget: z.string().optional(), 
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional().default("India"),

  // School specific (when role is 'school')
  schoolAddress: z.string().optional(),
  schoolContact: z.string().optional(),
  affiliationNumber: z.string().optional(),
  principalName: z.string().optional(), 
  schoolDesignation: z.string().optional(), 
  
  // Vendor specific
  businessName: z.string().optional(),
  vendorCategory: z.string().optional(),
  gstin: z.string().optional(),
  businessAddress: z.string().optional(),
  
  // Creator specific
  creatorName: z.string().optional(), 
  expertise: z.string().optional(), 
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  
  // Parent specific
  childName: z.string().optional(),
  childClass: z.string().optional(),
  childSchoolName: z.string().optional(),

  contactPersonName: z.string().optional(), 
  contactPersonEmail: z.string().email("Invalid email").optional().or(z.literal('')),
  contactPersonPhone: z.string().optional(),
  
  apiSchoolId: z.string().optional(), 

}).refine(data => {
  if (data.dateOfBirth) {
    const parsedDate = parse(data.dateOfBirth, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate);
  }
  return true;
}, {
  message: "Invalid date of birth format. Use YYYY-MM-DD.",
  path: ["dateOfBirth"],
}).refine(data => {
  if (data.role === 'school' && !data.schoolName?.trim()) {
    return false;
  }
  return true;
}, { message: "School Name is required for school role.", path: ["schoolName"] });

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [currentRole, setCurrentRole] = useState<string | null>("student");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isInitialSchoolSetup, setIsInitialSchoolSetup] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState<ProfileFormData | null>(null); // To hold existing school profile if staff editing

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting: isRhfSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: "student",
      fullName: "", 
      email: "",    
      country: "India",
      avatarUrl: "",
      dataAiHint: "student avatar",
      portfolioUrl: "",
      contactPersonEmail: "",
    },
  });

  const watchedAvatarUrl = watch("avatarUrl");

  useEffect(() => {
    setInitialDataLoading(true);
    const roleFromParams = searchParams.get("role") || "student";
    const isSchoolSetupParam = searchParams.get("isSchoolSetup") === 'true';
    setIsInitialSchoolSetup(isSchoolSetupParam);
    setCurrentRole(roleFromParams);
    
    let initialProfileData: Partial<ProfileFormData> = { role: roleFromParams, country: "India" };

    if (typeof window !== "undefined") {
        const emailFromParam = searchParams.get("email");
        const nameFromParam = searchParams.get("name"); 
        const designationFromParam = searchParams.get("designation");

        if (emailFromParam) initialProfileData.email = emailFromParam;
        if (nameFromParam) {
            initialProfileData.fullName = nameFromParam; 
            initialProfileData.contactPersonName = nameFromParam;
        }
        if (designationFromParam && roleFromParams === 'school') {
            initialProfileData.schoolDesignation = designationFromParam;
        }

        const profileKey = `${roleFromParams}ProfileData`;
        const genericProfileKey = 'userProfileData';
        
        let storedProfile: ProfileFormData | null = null;

        if (!isSchoolSetupParam) { // Only load existing if not initial school setup
            const specificProfileString = localStorage.getItem(profileKey);
            const genericProfileString = localStorage.getItem(genericProfileKey);

            if (specificProfileString) {
                try { storedProfile = JSON.parse(specificProfileString); } 
                catch (e) { console.error(`Failed to parse ${profileKey}`, e); }
            }
            if (!storedProfile && genericProfileString) {
                 try { 
                    const parsedGeneric = JSON.parse(genericProfileString);
                    // Ensure generic profile matches current user if email is available
                    if (parsedGeneric.role === roleFromParams && (!emailFromParam || parsedGeneric.email === emailFromParam)) {
                        storedProfile = parsedGeneric;
                    }
                } 
                catch (e) { console.error(`Failed to parse ${genericProfileKey}`, e); }
            }
        }
        
        if (storedProfile) {
            initialProfileData = { ...storedProfile, ...initialProfileData, role: roleFromParams };
             if (roleFromParams === 'school') {
                setSchoolProfile(storedProfile); // Store loaded school profile for reference
            }
        }
        
        if (isSchoolSetupParam && roleFromParams === 'school' && nameFromParam) {
            initialProfileData.principalName = nameFromParam; // Sets Principal's name from query param for new school
        }
    }
    reset(initialProfileData);
    if(initialProfileData.avatarUrl) setPreviewUrl(initialProfileData.avatarUrl);
    setInitialDataLoading(false);
  }, [searchParams, reset]);


  const handleAvatarUploadButtonClick = () => {
    avatarFileRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "Image must be less than 2MB.", variant: "destructive" });
        return;
      }
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setValue("avatarUrl", reader.result as string); 
        setValue("dataAiHint", file.name.toLowerCase().includes("female") || file.name.toLowerCase().includes("girl") ? "female avatar" : 
                               file.name.toLowerCase().includes("male") || file.name.toLowerCase().includes("boy") ? "male avatar" : "person avatar");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getAvatarInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "??";
  const getAvatarColor = (name?: string) => {
    if (!name) return "bg-gray-500";
    const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };
  const getAvatarFallback = (name?: string) => (
    <AvatarFallback className={`${getAvatarColor(name)} text-white`}>
      {getAvatarInitials(name)}
    </AvatarFallback>
  );

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmittingProfile(true);
    let schoolApiIdFromResponse: string | null = null;
    let finalSchoolIdForStorage: string = data.schoolId || DEFAULT_SCHOOL_ID;

    if (currentRole === 'school') {
        const schoolApiData = {
            schoolName: data.schoolName,
            address: data.schoolAddress,
            contactNumber: data.schoolContact,
            principalName: data.principalName,
            affiliationNumber: data.affiliationNumber,
            email: data.email, // The admin's email is the school's primary contact email
            contactPersonName: data.contactPersonName || data.fullName,
            contactPersonEmail: data.contactPersonEmail || data.email,
            contactPersonPhone: data.contactPersonPhone,
            designation: data.schoolDesignation,
        };

        if (isInitialSchoolSetup) { // API call only for initial setup
            try {
                console.log("Attempting to POST to school API:", JSON.stringify(schoolApiData));
                const response = await fetch('https://us-central1-oso-app-425800.cloudfunctions.net/schoolProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(schoolApiData),
                });
                const responseData = await response.json();
                if (response.ok && responseData.id) {
                    schoolApiIdFromResponse = responseData.id;
                    finalSchoolIdForStorage = schoolApiIdFromResponse; // Use API ID if available
                    toast({ title: "School Profile Registered with API", description: `School "${data.schoolName}" registered. ID: ${schoolApiIdFromResponse}` });
                } else {
                    const errorMessage = responseData.error || responseData.message || `Failed to register school with API. Status: ${response.status}`;
                    toast({ title: "School API Error", description: errorMessage, variant: "destructive" });
                    console.error("School API Error:", errorMessage, "Response Body:", responseData);
                    setIsSubmittingProfile(false);
                    return; // Critical failure for initial setup
                }
            } catch (apiError: any) {
                toast({ title: "School API Connection Error", description: `Could not connect to school registration service: ${apiError.message}`, variant: "destructive" });
                console.error("School API Connection Error:", apiError);
                setIsSubmittingProfile(false);
                return; // Critical failure for initial setup
            }
        } else if (schoolProfile?.apiSchoolId) { // For existing schools, use their stored API ID
            schoolApiIdFromResponse = schoolProfile.apiSchoolId;
            finalSchoolIdForStorage = schoolProfile.apiSchoolId;
        } else if (schoolProfile?.schoolId && schoolProfile.schoolId !== DEFAULT_SCHOOL_ID) {
             finalSchoolIdForStorage = schoolProfile.schoolId; // Use manually set school ID if API one not there
        }


        // Save school's main profile data
        const schoolProfileToSave: ProfileFormData = {
            ...data,
            schoolId: finalSchoolIdForStorage,
            apiSchoolId: schoolApiIdFromResponse || data.apiSchoolId, // Persist API ID if obtained
            role: 'school',
        };
        localStorage.setItem(`schoolProfileData_${finalSchoolIdForStorage}`, JSON.stringify(schoolProfileToSave));

        if (isInitialSchoolSetup) {
            const tempAdminCredsString = localStorage.getItem('tempInitialAdminCredentials');
            if (!tempAdminCredsString) {
                toast({ title: "Critical Setup Error", description: "Temporary admin credentials not found. Please try signing up again.", variant: "destructive" });
                setIsSubmittingProfile(false);
                return;
            }
            let tempAdminCreds;
            try {
                tempAdminCreds = JSON.parse(tempAdminCredsString);
            } catch (parseError) {
                console.error("Error parsing tempAdminCredsString:", parseError);
                toast({ title: "Critical Setup Error", description: "Could not parse temporary admin credentials. Please try signing up again.", variant: "destructive"});
                setIsSubmittingProfile(false);
                return;
            }

            const adminStaffEntry = {
                id: `staff_${Date.now()}`,
                name: tempAdminCreds.fullName,
                email: tempAdminCreds.email,
                password: tempAdminCreds.password,
                designation: tempAdminCreds.designation,
                schoolId: finalSchoolIdForStorage,
                status: "Active"
            };
            localStorage.setItem(`schoolStaff_${finalSchoolIdForStorage}`, JSON.stringify([adminStaffEntry]));
            localStorage.removeItem('tempInitialAdminCredentials');
            
            localStorage.setItem('loggedInUser', JSON.stringify({
                email: adminStaffEntry.email,
                fullName: adminStaffEntry.name,
                role: 'school',
                designation: adminStaffEntry.designation,
                schoolId: adminStaffEntry.schoolId
            }));

            // Save the admin's own user profile separately
            const adminUserProfileData: ProfileFormData = {
                fullName: tempAdminCreds.fullName,
                email: tempAdminCreds.email,
                role: 'school',
                schoolDesignation: tempAdminCreds.designation,
                schoolId: finalSchoolIdForStorage,
                apiSchoolId: schoolApiIdFromResponse || data.apiSchoolId,
                avatarUrl: data.avatarUrl, 
                dataAiHint: data.dataAiHint,
            };
            localStorage.setItem('userProfileData', JSON.stringify(adminUserProfileData)); // This is the admin's individual profile
            
            toast({ title: "School & Admin Profile Saved!", description: `School "${data.schoolName}" and your admin profile have been set up.` });
            router.push('/school-dashboard');
        } else { // Existing school staff editing their profile
            const staffUserProfileData: ProfileFormData = {
                ...data,
                role: 'school',
                schoolId: finalSchoolIdForStorage, 
                apiSchoolId: schoolApiIdFromResponse || data.apiSchoolId,
            };
            localStorage.setItem('userProfileData', JSON.stringify(staffUserProfileData)); // Update current staff's profile
            toast({ title: "Profile Updated!", description: "Your school staff profile has been updated." });
            router.push('/school-dashboard');
        }

    } else if (currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'parent' || currentRole === 'student') {
        const profileKey = `${currentRole}ProfileData`;
        localStorage.setItem(profileKey, JSON.stringify(data));
        localStorage.setItem('userProfileData', JSON.stringify(data)); // Generic user profile update
        
        toast({ title: "Profile Saved!", description: "Your profile information has been updated." });
        
        let redirectPath = '/';
        if (currentRole === 'vendor') redirectPath = '/vendor-dashboard';
        else if (currentRole === 'parent') redirectPath = '/parent-mode';
        else if (currentRole === 'creator') redirectPath = '/creator-dashboard';
        router.push(redirectPath);
    }
    
    setIsSubmittingProfile(false);
  };

  if (initialDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Loading profile editor...</p>
      </div>
    );
  }
  
  const currentFormName = watch('fullName') || watch('schoolName') || watch('businessName') || watch('creatorName');

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              {currentRole === 'student' && <User className="h-7 w-7" />}
              {currentRole === 'parent' && <ParentIcon className="h-7 w-7" />}
              {currentRole === 'school' && <School className="h-7 w-7" />}
              {currentRole === 'vendor' && <Briefcase className="h-7 w-7" />}
              {currentRole === 'creator' && <CreatorIcon className="h-7 w-7" />}
              <BilingualText 
                en={isInitialSchoolSetup ? "Register Your School" : `Edit ${currentRole ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1) : ''} Profile`} 
                hi={isInitialSchoolSetup ? "अपना स्कूल पंजीकृत करें" : `${currentRole ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1) : ''} प्रोफ़ाइल संपादित करें`} 
              />
            </CardTitle>
            <CardDescription>
              <BilingualText 
                en={isInitialSchoolSetup ? "Provide details about your school to get started." : "Keep your information up to date."} 
                hi={isInitialSchoolSetup ? "शुरू करने के लिए अपने स्कूल के बारे में विवरण प्रदान करें।" : "अपनी जानकारी अपडेट रखें।" }
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
                {previewUrl ? <AvatarImage src={previewUrl} alt="Avatar Preview" /> : <AvatarImage src={watchedAvatarUrl || `https://placehold.co/100x100.png`} alt="Avatar" />}
                {getAvatarFallback(currentFormName)}
              </Avatar>
              <input type="file" ref={avatarFileRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={handleAvatarUploadButtonClick}>
                <UploadCloud className="mr-2 h-4 w-4" /> <BilingualText en="Upload Photo" hi="फ़ोटो अपलोड करें" />
              </Button>
              {selectedFileName && <p className="text-xs text-muted-foreground">{selectedFileName}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">
                  <BilingualText 
                    en={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' ? "Contact Person Name" : "Full Name"} 
                    hi={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' ? "संपर्क व्यक्ति का नाम" : "पूरा नाम"} 
                  />*
                </Label>
                <Controller name="fullName" control={control} render={({ field }) => <Input id="fullName" {...field} placeholder="Your full name" />} />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">
                   <BilingualText 
                    en={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' ? "Contact Email" : "Email"} 
                    hi={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' ? "संपर्क ईमेल" : "ईमेल"} 
                  />*
                </Label>
                <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} placeholder="you@example.com" readOnly={!isInitialSchoolSetup && currentRole === 'school'} />} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {currentRole === 'student' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="phoneNumber"><BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label><Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" {...field} placeholder="+91 XXXXXXXXXX" />} /></div>
                    <div><Label htmlFor="dateOfBirth"><BilingualText en="Date of Birth" hi="जन्म की तारीख" /></Label><Controller name="dateOfBirth" control={control} render={({ field }) => <Input id="dateOfBirth" type="date" {...field} />} />{errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth.message}</p>}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="gender"><BilingualText en="Gender" hi="लिंग" /></Label><Controller name="gender" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                    <div><Label htmlFor="className"><BilingualText en="Class" hi="कक्षा" /></Label><Controller name="className" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger><SelectContent>{[...Array(12)].map((_, i) => <SelectItem key={i+1} value={String(i+1)}>{`Class ${i+1}`}</SelectItem>)}<SelectItem value="Nursery">Nursery</SelectItem><SelectItem value="LKG">LKG</SelectItem><SelectItem value="UKG">UKG</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="board"><BilingualText en="Board" hi="बोर्ड" /></Label><Controller name="board" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger><SelectContent><SelectItem value="CBSE">CBSE</SelectItem><SelectItem value="ICSE">ICSE</SelectItem><SelectItem value="State Board">State Board</SelectItem><SelectItem value="IB">IB</SelectItem><SelectItem value="IGCSE">IGCSE</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                    <div><Label htmlFor="stream"><BilingualText en="Stream (for 11/12th)" hi="स्ट्रीम (11/12वीं के लिए)" /></Label><Controller name="stream" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger><SelectContent><SelectItem value="Science">Science</SelectItem><SelectItem value="Commerce">Commerce</SelectItem><SelectItem value="Arts">Arts/Humanities</SelectItem><SelectItem value="NA">Not Applicable</SelectItem></SelectContent></Select>)} /></div>
                </div>
                 <div><Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" /></Label><Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} placeholder="Your school's name" />} /></div>
                 <div><Label htmlFor="schoolId"><BilingualText en="School ID (Provided by OSO)" hi="स्कूल आईडी (OSO द्वारा प्रदान)" /></Label><Controller name="schoolId" control={control} render={({ field }) => <Input id="schoolId" {...field} placeholder="Enter your school's OSO ID" />} /></div>
                 <div><Label htmlFor="examTarget"><BilingualText en="Primary Exam Target" hi="प्राथमिक परीक्षा लक्ष्य" /></Label><Controller name="examTarget" control={control} render={({ field }) => <Input id="examTarget" {...field} placeholder="e.g., NEET, JEE, UPSC, CAT" />} /></div>
              </>
            )}
            {currentRole === 'parent' && (
              <>
                <div><Label htmlFor="phoneNumber"><BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label><Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" {...field} placeholder="+91 XXXXXXXXXX" />} /></div>
                <div><Label htmlFor="childName"><BilingualText en="Child's Full Name" hi="बच्चे का पूरा नाम" /></Label><Controller name="childName" control={control} render={({ field }) => <Input id="childName" {...field} />} /></div>
                <div><Label htmlFor="childClass"><BilingualText en="Child's Class" hi="बच्चे की कक्षा" /></Label><Controller name="childClass" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Child's Class" /></SelectTrigger><SelectContent>{[...Array(12)].map((_, i) => <SelectItem key={i+1} value={String(i+1)}>{`Class ${i+1}`}</SelectItem>)}<SelectItem value="Nursery">Nursery</SelectItem><SelectItem value="LKG">LKG</SelectItem><SelectItem value="UKG">UKG</SelectItem></SelectContent></Select>)} /></div>
                <div><Label htmlFor="childSchoolName"><BilingualText en="Child's School Name" hi="बच्चे के स्कूल का नाम" /></Label><Controller name="childSchoolName" control={control} render={({ field }) => <Input id="childSchoolName" {...field} />} /></div>
              </>
            )}
            {currentRole === 'school' && (
              <>
                <div><Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" />*</Label><Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} required />} />{errors.schoolName && <p className="text-xs text-destructive mt-1">{errors.schoolName.message}</p>}</div>
                <div><Label htmlFor="schoolAddress"><BilingualText en="School Address" hi="स्कूल का पता" /></Label><Controller name="schoolAddress" control={control} render={({ field }) => <Textarea id="schoolAddress" {...field} />} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="schoolContact"><BilingualText en="School Contact Number" hi="स्कूल संपर्क नंबर" /></Label><Controller name="schoolContact" control={control} render={({ field }) => <Input id="schoolContact" {...field} />} /></div>
                    <div><Label htmlFor="affiliationNumber"><BilingualText en="Affiliation Number" hi="संबद्धता संख्या" /></Label><Controller name="affiliationNumber" control={control} render={({ field }) => <Input id="affiliationNumber" {...field} />} /></div>
                </div>
                <div><Label htmlFor="principalName"><BilingualText en="Principal's Name" hi="प्रधानाचार्य का नाम" /></Label><Controller name="principalName" control={control} render={({ field }) => <Input id="principalName" {...field} />} /></div>
                
                <Card className="bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">OSO Account Contact Person</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPersonPhone"><BilingualText en="Contact Person Phone" hi="संपर्क व्यक्ति फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} />} /></div>
                    <div>
                        <Label htmlFor="schoolDesignation" className="mt-4 block"><BilingualText en="Your Designation" hi="आपकी पदवी" />*</Label>
                        <Controller name="schoolDesignation" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value} required><SelectTrigger><SelectValue placeholder="Select your designation" /></SelectTrigger><SelectContent>{schoolDesignations.map(desig => (<SelectItem key={desig} value={desig}>{desig}</SelectItem>))}</SelectContent></Select>)} />
                        {errors.schoolDesignation && <p className="text-xs text-destructive mt-1">{errors.schoolDesignation.message}</p>}
                    </div>
                </Card>
              </>
            )}
            {currentRole === 'vendor' && (
              <>
                <div><Label htmlFor="businessName"><BilingualText en="Business Name" hi="व्यवसाय का नाम" />*</Label><Controller name="businessName" control={control} render={({ field }) => <Input id="businessName" {...field} required />} /></div>
                <div><Label htmlFor="vendorCategory"><BilingualText en="Vendor Category" hi="विक्रेता श्रेणी" /></Label><Controller name="vendorCategory" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{vendorCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select>)} /></div>
                <div><Label htmlFor="gstin"><BilingualText en="GSTIN (Optional)" hi="जीएसटीआईएन (वैकल्पिक)" /></Label><Controller name="gstin" control={control} render={({ field }) => <Input id="gstin" {...field} />} /></div>
                <div><Label htmlFor="businessAddress"><BilingualText en="Business Address" hi="व्यावसायिक पता" /></Label><Controller name="businessAddress" control={control} render={({ field }) => <Textarea id="businessAddress" {...field} />} /></div>
                <Card className="bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">Contact Person (for OSO)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPersonPhone"><BilingualText en="Contact Phone" hi="संपर्क फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} />} /></div>
                </Card>
              </>
            )}
             {currentRole === 'creator' && (
              <>
                <div><Label htmlFor="creatorName"><BilingualText en="Creator/Brand Name" hi="निर्माता/ब्रांड नाम" />*</Label><Controller name="creatorName" control={control} render={({ field }) => <Input id="creatorName" {...field} placeholder="Your public creator name" required />} /></div>
                <div><Label htmlFor="expertise"><BilingualText en="Areas of Expertise" hi="विशेषज्ञता के क्षेत्र" /></Label><Controller name="expertise" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select primary expertise" /></SelectTrigger><SelectContent>{creatorExpertiseAreas.map(area => (<SelectItem key={area} value={area}>{area}</SelectItem>))}</SelectContent></Select>)} /></div>
                <div><Label htmlFor="portfolioUrl"><BilingualText en="Portfolio URL (Optional)" hi="पोर्टफोलियो यूआरएल (वैकल्पिक)" /></Label><Controller name="portfolioUrl" control={control} render={({ field }) => <Input id="portfolioUrl" type="url" {...field} placeholder="https://example.com/my-work" />} />{errors.portfolioUrl && <p className="text-xs text-destructive mt-1">{errors.portfolioUrl.message}</p>}</div>
                <Card className="bg-muted/50 p-4">
                     <p className="text-sm font-medium mb-2">Contact Details (Private, for OSO)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPersonPhone"><BilingualText en="Contact Phone" hi="संपर्क फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} />} /></div>
                </Card>
              </>
            )}

            {(currentRole === 'student' || currentRole === 'parent') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="city"><BilingualText en="City" hi="शहर" /></Label><Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} />} /></div>
                    <div><Label htmlFor="state"><BilingualText en="State" hi="राज्य" /></Label><Controller name="state" control={control} render={({ field }) => <Input id="state" {...field} />} /></div>
                </div>
            )}
             <div><Label htmlFor="country"><BilingualText en="Country" hi="देश" /></Label><Controller name="country" control={control} render={({ field }) => <Input id="country" {...field} />} /></div>

          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isRhfSubmitting || isSubmittingProfile}>
              {isRhfSubmitting || isSubmittingProfile ? <LoadingSpinner size={20} /> : <Save className="mr-2 h-5 w-5" />}
              <BilingualText en="Save Profile" hi="प्रोफ़ाइल सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
    
