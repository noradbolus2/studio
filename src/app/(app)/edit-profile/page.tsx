
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Save, UploadCloud, School, Briefcase, Sparkles as CreatorIcon, Users as ParentIcon, Edit3, KeyRound, ShieldCheck, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Corrected import

const schoolDesignations = ["Principal", "Vice Principal", "Coordinator", "Teacher", "Accountant", "Admin Staff", "Librarian", "IT Support", "Other"];
const vendorCategories = ["Stationery", "Books", "Uniforms", "Electronics", "Snacks", "Project Kits", "Other"];
const creatorExpertiseAreas = ["Science Projects", "Art & Craft", "Coding & AI", "Robotics", "Essay Writing", "Video Content", "Tutoring", "Other"];
const teacherSubjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"]; // Re-using creator for teacher subjects

const DEFAULT_SCHOOL_ID = "defaultSchool"; 

const competitiveExamsIndia = [
  "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE", "MET (Manipal)", "COMEDK UGET", "KIITEE", "WBJEE", "MHT CET (Engineering)", "GUJCET", "AP EAMCET (Engineering)", "TS EAMCET (Engineering)", "KCET (Engineering)", "GATE (for PG/PSU)",
  "NEET UG (MBBS, BDS, AYUSH, B.V.Sc)", "NEET PG (MD, MS, PG Diploma)", "INI CET (AIIMS, JIPMER, PGIMER, NIMHANS)", "NEET SS (DM, MCh)", "FMGE", "AIIMS Nursing", "Indian Army B.Sc Nursing / MNS", "AIAPGET (PG AYUSH)",
  "CAT", "XAT", "CMAT", "SNAP", "NMAT by GMAC", "MAT", "ATMA", "IIFT", "TISSNET", "IBSAT", "MICAT", "GMAT (for Indian B-schools)",
  "CLAT (UG & PG)", "AILET (UG & PG)", "LSAT India", "SLAT", "MH CET Law", "AP LAWCET", "TS LAWCET", "Kerala KLEE", "State Judicial Services Examination (PCS-J)",
  "UPSC CSE (IAS, IPS, IFS, IRS etc.)", "UPSC IFoS", "UPSC ESE/IES", "UPSC Combined Geo-Scientist", "UPSC CMS", "UPSC CAPF", "SSC CGL", "SSC CHSL", "SSC JE", "SSC Stenographer", "SSC MTS", "SSC GD Constable", "SSC CPO", "IBPS PO", "IBPS Clerk", "IBPS SO", "IBPS RRB", "SBI PO", "SBI Clerk", "SBI SO", "RBI Grade B", "RBI Assistant", "NABARD Grade A & B", "LIC AAO", "LIC ADO", "UIIC/NIACL Exams", "ESIC", "FCI", "RRB NTPC", "RRB JE", "RRB ALP", "RRB Group D", "State PSCs (General)", "State Level Police Recruitment", "High Court Exams",
  "NDA & NA", "CDS", "AFCAT", "INET", "Indian Army TES", "Indian Navy Sailors (SSR, AA, MR)", "Indian Air Force Airmen (Group X & Y)", "Indian Coast Guard (Navik, Yantrik)", "Territorial Army",
  "CUET UG", "CUET PG", "JMI Entrance", "AMU Entrance",
  "NID DAT", "UCEED", "CEED", "NIFT Entrance", "NATA", "JEE Main Paper 2 (B.Arch/B.Plan)", "AIEED",
  "NCHM JEE", "State IHM Entrances",
  "ICAR AIEEA (UG, PG, PhD)", "State Agriculture University Entrances",
  "CTET", "State TETs", "UGC NET", "CSIR UGC NET", "SET/SLET", "KVS Recruitment", "NVS Recruitment", "DSSSB", "B.Ed. Entrances",
  "GPAT", "State CETs for B.Pharm", "NIPER JEE",
  "UGC NET JRF", "CSIR NET JRF", "ICMR JRF", "DBT JRF", "University/Institute PhD Entrances",
  "CA (Foundation, Intermediate, Final)", "CS (CSEET, Executive, Professional)", "CMA (Foundation, Intermediate, Final)",
  "NTSE", "KVPY (Status to be checked by student)", "SOF Olympiads (NSO, IMO, IEO, etc.)", "Homi Bhabha Balvaidnyanik Spardha",
  "Other (Not Listed)"
];

const studentClasses = [
  "Nursery", "LKG", "UKG", 
  ...[...Array(12)].map((_, i) => String(i+1)), 
  "12+ (Passed)", "Other"
];

const profileSchema = z.object({
  role: z.string().optional(),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().optional(),
  dataAiHint: z.string().optional(),

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

  schoolAddress: z.string().optional(),
  schoolContact: z.string().optional(),
  affiliationNumber: z.string().optional(),
  principalName: z.string().optional(), 
  schoolDesignation: z.string().optional(), 
  
  businessName: z.string().optional(),
  vendorCategory: z.string().optional(),
  gstin: z.string().optional(),
  businessAddress: z.string().optional(),
  
  creatorName: z.string().optional(), 
  expertise: z.string().optional(), 
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  bio: z.string().max(300, "Bio must be 300 characters or less").optional(),
  availability_for_doubts: z.boolean().optional(),
  
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

const isClassNurseryTo12 = (className?: string): boolean => {
  if (!className) return false;
  const numericClass = parseInt(className.match(/\d+/)?.[0] || "-1");
  return (
    ["Nursery", "LKG", "UKG"].includes(className) ||
    (numericClass >= 1 && numericClass <= 12)
  );
};


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
  const [schoolProfile, setSchoolProfile] = useState<ProfileFormData | null>(null); 
  const [isSchoolOsoConnected, setIsSchoolOsoConnected] = useState<string>('no');


  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting: isRhfSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      avatarUrl: "",
      dataAiHint: "student avatar",
      phoneNumber: "",
      schoolName: "",
      schoolId: "",
      className: "",
      board: "",
      stream: "",
      dateOfBirth: "",
      gender: "",
      examTarget: "",
      city: "",
      state: "",
      country: "India",
      schoolAddress: "",
      schoolContact: "",
      affiliationNumber: "",
      principalName: "",
      schoolDesignation: "",
      businessName: "",
      vendorCategory: "",
      gstin: "",
      businessAddress: "",
      creatorName: "",
      expertise: "",
      portfolioUrl: "",
      bio: "",
      availability_for_doubts: false,
      childName: "",
      childClass: "",
      childSchoolName: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      apiSchoolId: "",
    },
  });

  const watchedAvatarUrl = watch("avatarUrl");
  const watchedClassName = watch("className");

  useEffect(() => {
    setInitialDataLoading(true);
    const roleFromParams = searchParams.get("role") || "student";
    const isSchoolSetupParam = searchParams.get("isSchoolSetup") === 'true';
    setIsInitialSchoolSetup(isSchoolSetupParam);
    setCurrentRole(roleFromParams);
    
    let initialProfileData: Partial<ProfileFormData> = { 
      role: roleFromParams, 
      country: "India",
      availability_for_doubts: false, 
    };

    if (typeof window !== "undefined") {
        const emailFromParam = searchParams.get("email");
        const nameFromParam = searchParams.get("name"); 
        const designationFromParam = searchParams.get("designation");

        if (emailFromParam) initialProfileData.email = emailFromParam;
        if (nameFromParam) {
            initialProfileData.fullName = nameFromParam; 
            if (roleFromParams === 'school' || roleFromParams === 'vendor' || roleFromParams === 'creator' || roleFromParams === 'teacher') {
              initialProfileData.contactPersonName = nameFromParam;
              if (roleFromParams === 'creator' || roleFromParams === 'teacher') {
                initialProfileData.creatorName = nameFromParam; 
              }
            }
        }
        if (designationFromParam && roleFromParams === 'school') {
            initialProfileData.schoolDesignation = designationFromParam;
        }

        const profileKey = (roleFromParams === 'teacher' || roleFromParams === 'student') ? 'userProfileData' : `${roleFromParams}ProfileData`;
        const genericProfileKey = 'userProfileData';
        
        let storedProfile: ProfileFormData | null = null;

        if (!isSchoolSetupParam) { 
            const specificProfileString = localStorage.getItem(profileKey);
            const genericProfileString = localStorage.getItem(genericProfileKey);

            if (specificProfileString) {
                try { 
                  const parsedSpecific = JSON.parse(specificProfileString);
                  if (parsedSpecific.role === roleFromParams || (roleFromParams === 'teacher' && parsedSpecific.role === 'creator')) { 
                     storedProfile = parsedSpecific;
                  }
                } 
                catch (e) { console.error(`Failed to parse ${profileKey}`, e); }
            }
            if (!storedProfile && genericProfileString) {
                 try { 
                    const parsedGeneric = JSON.parse(genericProfileString);
                    if (parsedGeneric.role === roleFromParams || (roleFromParams === 'teacher' && parsedGeneric.role === 'creator')) {
                        if (!emailFromParam || parsedGeneric.email === emailFromParam) {
                            storedProfile = parsedGeneric;
                        }
                    }
                } 
                catch (e) { console.error(`Failed to parse ${genericProfileKey}`, e); }
            }
        }
        
        if (storedProfile) {
            initialProfileData = { ...storedProfile, ...initialProfileData, role: roleFromParams };
             if (roleFromParams === 'school') {
                setSchoolProfile(storedProfile); 
            }
        }
        
        if (isSchoolSetupParam && roleFromParams === 'school' && nameFromParam) {
            initialProfileData.principalName = nameFromParam; 
        }
    }
    
    reset(initialProfileData); 

    if(initialProfileData.avatarUrl) setPreviewUrl(initialProfileData.avatarUrl);
    
    if (initialProfileData.schoolId && isClassNurseryTo12(initialProfileData.className)) {
        setIsSchoolOsoConnected('yes');
    } else {
        setIsSchoolOsoConnected('no');
    }

    setInitialDataLoading(false);
  }, [searchParams, reset, currentRole]); 

  useEffect(() => {
    if (currentRole === 'student' && !isClassNurseryTo12(watchedClassName)) {
      setIsSchoolOsoConnected('no');
      setValue('schoolId', undefined);
    }
  }, [watchedClassName, currentRole, setValue]);


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

  const handleIsSchoolConnectedChange = (value: 'yes' | 'no') => {
    setIsSchoolOsoConnected(value);
    if (value === 'no') {
      setValue('schoolId', ''); 
    }
  };

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
            email: data.email, 
            contactPersonName: data.contactPersonName || data.fullName, 
            contactPersonEmail: data.contactPersonEmail || data.email, 
            contactPersonPhone: data.contactPersonPhone, 
            designation: data.schoolDesignation, 
        };

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
                toast({ title: "Critical Setup Error", description: "Could not parse temporary admin credentials. Please try signing up again.", variant: "destructive"});
                setIsSubmittingProfile(false);
                return;
            }

            try {
                const response = await fetch('https://us-central1-oso-app-425800.cloudfunctions.net/schoolProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(schoolApiData),
                });
                const responseData = await response.json();
                if (response.ok && responseData.id) {
                    schoolApiIdFromResponse = responseData.id;
                    finalSchoolIdForStorage = schoolApiIdFromResponse; 
                    toast({ title: "School Profile Registered with API", description: `School "${data.schoolName}" registered. ID: ${schoolApiIdFromResponse}` });
                } else {
                    const errorMessage = responseData.error || responseData.message || `Failed to register school with API. Status: ${response.status}`;
                    toast({ title: "School API Error", description: errorMessage, variant: "destructive" });
                    setIsSubmittingProfile(false);
                    return; 
                }
            } catch (apiError: any) {
                toast({ title: "School API Connection Error", description: `Could not connect to school registration service: ${apiError.message}`, variant: "destructive" });
                setIsSubmittingProfile(false);
                return; 
            }
            
            const adminStaffEntry = {
                id: `staff_${Date.now()}`, 
                name: tempAdminCreds.fullName,
                email: tempAdminCreds.email,
                password: tempAdminCreds.password, 
                role: tempAdminCreds.designation, 
                subjectOrDepartment: "Administration", 
                contact: data.contactPersonPhone || data.schoolContact || "",
                status: "Active",
                schoolId: finalSchoolIdForStorage, 
            };
            localStorage.setItem(`schoolStaff_${finalSchoolIdForStorage}`, JSON.stringify([adminStaffEntry])); 
            localStorage.removeItem('tempInitialAdminCredentials'); 
            
            localStorage.setItem('loggedInUser', JSON.stringify({
                email: adminStaffEntry.email,
                fullName: adminStaffEntry.name,
                role: 'school', 
                designation: adminStaffEntry.role, 
                schoolId: adminStaffEntry.schoolId 
            }));

            const adminUserProfileData: ProfileFormData = {
                fullName: tempAdminCreds.fullName, 
                email: tempAdminCreds.email,       
                role: 'school',                     
                schoolDesignation: tempAdminCreds.designation, 
                schoolId: finalSchoolIdForStorage,
                apiSchoolId: schoolApiIdFromResponse, 
                avatarUrl: data.avatarUrl, 
                dataAiHint: data.dataAiHint,
                phoneNumber: "", schoolName: data.schoolName ?? "", className: "", board: "", stream: "", dateOfBirth: "", gender: "", examTarget: "", city: "", state: "", country: data.country ?? "India", schoolAddress: data.schoolAddress ?? "", schoolContact: data.schoolContact ?? "", affiliationNumber: data.affiliationNumber ?? "", principalName: data.principalName ?? "", businessName: "", vendorCategory: "", gstin: "", businessAddress: "", creatorName: "", expertise: "", portfolioUrl: "", bio:"", availability_for_doubts: false, childName: "", childClass: "", childSchoolName: "", contactPersonName: tempAdminCreds.fullName, contactPersonEmail: tempAdminCreds.email, contactPersonPhone: data.contactPersonPhone ?? ""
            };
            localStorage.setItem('userProfileData', JSON.stringify(adminUserProfileData)); 
            
            const schoolProfileToSave: ProfileFormData = {
                ...data,
                schoolId: finalSchoolIdForStorage, 
                apiSchoolId: schoolApiIdFromResponse, 
                role: 'school', 
            };
            localStorage.setItem(`schoolProfileData_${finalSchoolIdForStorage}`, JSON.stringify(schoolProfileToSave));

            toast({ title: "School & Admin Profile Saved!", description: `School "${data.schoolName}" and your admin profile have been set up.` });
            router.push('/school-dashboard'); 
        } else { 
            const schoolIdToUse = schoolProfile?.apiSchoolId || schoolProfile?.schoolId || finalSchoolIdForStorage;
            
            const staffUserProfileData: ProfileFormData = {
                ...data, 
                role: 'school',
                schoolId: schoolIdToUse, 
                apiSchoolId: schoolProfile?.apiSchoolId, 
            };
            localStorage.setItem('userProfileData', JSON.stringify(staffUserProfileData));
            
            const schoolProfileToSave: ProfileFormData = {
                ...data,
                schoolId: schoolIdToUse,
                apiSchoolId: schoolProfile?.apiSchoolId,
                role: 'school',
            };
            localStorage.setItem(`schoolProfileData_${schoolIdToUse}`, JSON.stringify(schoolProfileToSave));

            toast({ title: "Profile Updated!", description: "Your school staff profile has been updated." });
            router.push('/school-dashboard'); 
        }

    } else if (currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'parent' || currentRole === 'student' || currentRole === 'teacher') {
        const profileKey = (currentRole === 'student' || currentRole === 'teacher' || currentRole === 'creator') ? 'userProfileData' : `${currentRole}ProfileData`;
        const fullProfileData = { ...data, role: currentRole }; 
        localStorage.setItem(profileKey, JSON.stringify(fullProfileData));
        
        if(currentRole !== 'student' && currentRole !== 'teacher' && currentRole !== 'creator') { 
            localStorage.setItem('userProfileData', JSON.stringify(fullProfileData)); 
        }
        
        toast({ title: "Profile Saved!", description: "Your profile information has been updated." });
        
        let redirectPath = '/'; 
        if (currentRole === 'vendor') redirectPath = '/vendor-dashboard';
        else if (currentRole === 'parent') redirectPath = '/parent-mode';
        else if (currentRole === 'creator') redirectPath = '/creator-dashboard';
        else if (currentRole === 'teacher') redirectPath = '/coaching-panel';
        else if (currentRole === 'student') redirectPath = '/'; 
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
              {(currentRole === 'creator' || currentRole === 'teacher') && <CreatorIcon className="h-7 w-7" />}
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
                    en={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'teacher' ? "Contact Person Name" : "Full Name"} 
                    hi={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'teacher' ? "संपर्क व्यक्ति का नाम" : "पूरा नाम"} 
                  />*
                </Label>
                <Controller name="fullName" control={control} render={({ field }) => <Input id="fullName" {...field} value={field.value ?? ''} placeholder="Your full name" />} />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">
                   <BilingualText 
                    en={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'teacher' ? "Contact Email" : "Email"} 
                    hi={currentRole === 'school' || currentRole === 'vendor' || currentRole === 'creator' || currentRole === 'teacher' ? "संपर्क ईमेल" : "ईमेल"} 
                  />*
                </Label>
                <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} value={field.value ?? ''} placeholder="you@example.com" readOnly={!isInitialSchoolSetup && currentRole === 'school'} />} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {currentRole === 'student' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="phoneNumber"><BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label><Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" {...field} value={field.value ?? ''} placeholder="+91 XXXXXXXXXX" />} /></div>
                    <div><Label htmlFor="dateOfBirth"><BilingualText en="Date of Birth" hi="जन्म की तारीख" /></Label><Controller name="dateOfBirth" control={control} render={({ field }) => <Input id="dateOfBirth" type="date" {...field} value={field.value ?? ''} />} />{errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth.message}</p>}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="gender"><BilingualText en="Gender" hi="लिंग" /></Label><Controller name="gender" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value ?? ''}><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                    <div>
                        <Label htmlFor="className"><BilingualText en="Class" hi="कक्षा" /></Label>
                        <Controller 
                            name="className" 
                            control={control} 
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {studentClasses.map(cls => (
                                            <SelectItem key={cls} value={cls}>{cls.startsWith("12+") || cls.startsWith("Nursery") || cls.startsWith("LKG") || cls.startsWith("UKG") || cls.startsWith("Other") ? cls : `Class ${cls}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} 
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="board"><BilingualText en="Board" hi="बोर्ड" /></Label><Controller name="board" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value ?? ''}><SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger><SelectContent><SelectItem value="CBSE">CBSE</SelectItem><SelectItem value="ICSE">ICSE</SelectItem><SelectItem value="State Board">State Board</SelectItem><SelectItem value="IB">IB</SelectItem><SelectItem value="IGCSE">IGCSE</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                    <div><Label htmlFor="stream"><BilingualText en="Stream (for 11/12th)" hi="स्ट्रीम (11/12वीं के लिए)" /></Label><Controller name="stream" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value ?? ''}><SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger><SelectContent><SelectItem value="Science">Science</SelectItem><SelectItem value="Commerce">Commerce</SelectItem><SelectItem value="Arts">Arts/Humanities</SelectItem><SelectItem value="NA">Not Applicable</SelectItem></SelectContent></Select>)} /></div>
                </div>
                
                {isClassNurseryTo12(watchedClassName) && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-3">
                    <Label className="flex items-center gap-1.5 font-medium text-foreground">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <BilingualText en="OSO School Connection" hi="OSO स्कूल कनेक्शन" />
                    </Label>
                    <RadioGroup
                      value={isSchoolOsoConnected}
                      onValueChange={(val: string) => handleIsSchoolConnectedChange(val as 'yes' | 'no')}
                      className="flex space-x-6 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="osoConnectedYes" />
                        <Label htmlFor="osoConnectedYes" className="font-normal cursor-pointer">
                          <BilingualText en="Yes, my school is on OSO" hi="हाँ, मेरा स्कूल OSO पर है" />
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="osoConnectedNo" />
                        <Label htmlFor="osoConnectedNo" className="font-normal cursor-pointer">
                          <BilingualText en="No / I don't know" hi="नहीं / मुझे नहीं पता" />
                        </Label>
                      </div>
                    </RadioGroup>

                    {isSchoolOsoConnected === 'yes' && (
                      <div className="pt-3">
                        <Label htmlFor="schoolId">
                          <BilingualText en="School ID (Provided by OSO)" hi="स्कूल आईडी (OSO द्वारा प्रदान)" />*
                        </Label>
                        <Controller
                          name="schoolId"
                          control={control}
                          render={({ field }) => <Input id="schoolId" {...field} value={field.value ?? ''} placeholder="Enter your school's OSO ID" />}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div><Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" /></Label><Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} value={field.value ?? ''} placeholder="Your school's name" />} /></div>
                
                <div>
                    <Label htmlFor="examTarget" className="flex items-center gap-1.5"><Target className="h-4 w-4"/> <BilingualText en="Primary Exam Target" hi="प्राथमिक परीक्षा लक्ष्य" /></Label>
                    <Controller 
                        name="examTarget" 
                        control={control} 
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                <SelectTrigger id="examTarget">
                                    <SelectValue placeholder={<BilingualText en="Select Exam Target" hi="परीक्षा लक्ष्य चुनें" />} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[250px]">
                                    {competitiveExamsIndia.map(exam => (
                                        <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )} 
                    />
                 </div>
              </>
            )}
            {currentRole === 'parent' && (
              <>
                <div><Label htmlFor="phoneNumber"><BilingualText en="Phone Number" hi="फ़ोन नंबर" /></Label><Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" {...field} value={field.value ?? ''} placeholder="+91 XXXXXXXXXX" />} /></div>
                <div><Label htmlFor="childName"><BilingualText en="Child's Full Name" hi="बच्चे का पूरा नाम" /></Label><Controller name="childName" control={control} render={({ field }) => <Input id="childName" {...field} value={field.value ?? ''} />} /></div>
                <div>
                  <Label htmlFor="childClass"><BilingualText en="Child's Class" hi="बच्चे की कक्षा" /></Label>
                  <Controller 
                    name="childClass" 
                    control={control} 
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger><SelectValue placeholder="Select Child's Class" /></SelectTrigger>
                        <SelectContent>
                          {studentClasses.filter(c => c !== "12+ (Passed)").map(cls => ( 
                            <SelectItem key={cls} value={cls}>{cls.startsWith("Nursery") || cls.startsWith("LKG") || cls.startsWith("UKG") || cls.startsWith("Other") ? cls : `Class ${cls}`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )} 
                  />
                </div>
                <div><Label htmlFor="childSchoolName"><BilingualText en="Child's School Name" hi="बच्चे के स्कूल का नाम" /></Label><Controller name="childSchoolName" control={control} render={({ field }) => <Input id="childSchoolName" {...field} value={field.value ?? ''} />} /></div>
              </>
            )}
            {currentRole === 'school' && (
              <>
                <div><Label htmlFor="schoolName"><BilingualText en="School Name" hi="स्कूल का नाम" />*</Label><Controller name="schoolName" control={control} render={({ field }) => <Input id="schoolName" {...field} value={field.value ?? ''} required />} />{errors.schoolName && <p className="text-xs text-destructive mt-1">{errors.schoolName.message}</p>}</div>
                <div><Label htmlFor="schoolAddress"><BilingualText en="School Address" hi="स्कूल का पता" /></Label><Controller name="schoolAddress" control={control} render={({ field }) => <Textarea id="schoolAddress" {...field} value={field.value ?? ''} />} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="schoolContact"><BilingualText en="School Contact Number" hi="स्कूल संपर्क नंबर" /></Label><Controller name="schoolContact" control={control} render={({ field }) => <Input id="schoolContact" {...field} value={field.value ?? ''} />} /></div>
                    <div><Label htmlFor="affiliationNumber"><BilingualText en="Affiliation Number" hi="संबद्धता संख्या" /></Label><Controller name="affiliationNumber" control={control} render={({ field }) => <Input id="affiliationNumber" {...field} value={field.value ?? ''} />} /></div>
                </div>
                <div><Label htmlFor="principalName"><BilingualText en="Principal's Name" hi="प्रधानाचार्य का नाम" /></Label><Controller name="principalName" control={control} render={({ field }) => <Input id="principalName" {...field} value={field.value ?? ''} />} /></div>
                
                <Card className="bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">OSO Account Contact Person</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} value={field.value ?? ''} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} value={field.value ?? ''} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPersonPhone"><BilingualText en="Contact Person Phone" hi="संपर्क व्यक्ति फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} value={field.value ?? ''} />} /></div>
                    <div>
                        <Label htmlFor="schoolDesignation" className="mt-4 block"><BilingualText en="Your Designation" hi="आपकी पदवी" />*</Label>
                        <Controller name="schoolDesignation" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value ?? ''} required><SelectTrigger><SelectValue placeholder="Select your designation" /></SelectTrigger><SelectContent>{schoolDesignations.map(desig => (<SelectItem key={desig} value={desig}>{desig}</SelectItem>))}</SelectContent></Select>)} />
                        {errors.schoolDesignation && <p className="text-xs text-destructive mt-1">{errors.schoolDesignation.message}</p>}
                    </div>
                </Card>
              </>
            )}
            {currentRole === 'vendor' && (
              <>
                <div><Label htmlFor="businessName"><BilingualText en="Business Name" hi="व्यवसाय का नाम" />*</Label><Controller name="businessName" control={control} render={({ field }) => <Input id="businessName" {...field} value={field.value ?? ''} required />} /></div>
                <div><Label htmlFor="vendorCategory"><BilingualText en="Vendor Category" hi="विक्रेता श्रेणी" /></Label><Controller name="vendorCategory" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value ?? ''}><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{vendorCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select>)} /></div>
                <div><Label htmlFor="gstin"><BilingualText en="GSTIN (Optional)" hi="जीएसटीआईएन (वैकल्पिक)" /></Label><Controller name="gstin" control={control} render={({ field }) => <Input id="gstin" {...field} value={field.value ?? ''} />} /></div>
                <div><Label htmlFor="businessAddress"><BilingualText en="Business Address" hi="व्यावसायिक पता" /></Label><Controller name="businessAddress" control={control} render={({ field }) => <Textarea id="businessAddress" {...field} value={field.value ?? ''} />} /></div>
                <Card className="bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">Contact Person (for OSO)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} value={field.value ?? ''} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} value={field.value ?? ''} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPhone"><BilingualText en="Contact Phone" hi="संपर्क फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} value={field.value ?? ''} />} /></div>
                </Card>
              </>
            )}
             {(currentRole === 'creator' || currentRole === 'teacher') && (
              <>
                <div><Label htmlFor="creatorName"><BilingualText en="Public Display Name" hi="सार्वजनिक प्रदर्शन नाम" />*</Label><Controller name="creatorName" control={control} render={({ field }) => <Input id="creatorName" {...field} value={field.value ?? ''} placeholder="Your public creator/teacher name" required />} /></div>
                <div><Label htmlFor="expertise"><BilingualText en={currentRole === 'teacher' ? "Teaching Subjects (comma-separated)" : "Areas of Expertise (comma-separated)"} hi={currentRole === 'teacher' ? "शिक्षण विषय (अल्पविराम से अलग)" : "विशेषज्ञता के क्षेत्र (अल्पविराम से अलग)"} />*</Label><Controller name="expertise" control={control} render={({ field }) => <Input id="expertise" {...field} value={field.value ?? ''} placeholder={currentRole === 'teacher' ? "e.g., Physics, JEE Maths" : "e.g., Science Projects, AI"} required />} /></div>
                <div><Label htmlFor="bio"><BilingualText en="Bio / About Me (max 300 chars)" hi="बायो / मेरे बारे में (अधिकतम 300 अक्षर)" /></Label><Controller name="bio" control={control} render={({ field }) => <Textarea id="bio" {...field} value={field.value ?? ''} placeholder="Tell students/users about your experience and style." className="min-h-[100px]" maxLength={300} />} />{errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>}</div>
                
                {currentRole === 'teacher' && (
                    <>
                    <div>
                        <Label htmlFor="examTarget" className="flex items-center gap-1.5"><Target className="h-4 w-4"/> <BilingualText en="Primary Exam Focus" hi="प्राथमिक परीक्षा लक्ष्य" /></Label>
                        <Controller 
                            name="examTarget" 
                            control={control} 
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                    <SelectTrigger id="examTarget">
                                        <SelectValue placeholder={<BilingualText en="Select Primary Exam Focus" hi="प्राथमिक परीक्षा लक्ष्य चुनें" />} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[250px]">
                                        {competitiveExamsIndia.map(exam => (
                                            <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} 
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Controller name="availability_for_doubts" control={control} render={({ field }) => (
                            <Switch id="availability_for_doubts" checked={field.value} onCheckedChange={field.onChange} />
                        )} />
                        <Label htmlFor="availability_for_doubts"><BilingualText en="Available for Doubt Solving?" hi="शंका समाधान के लिए उपलब्ध हैं?" /></Label>
                    </div>
                    </>
                )}
                
                <div><Label htmlFor="portfolioUrl"><BilingualText en="YouTube/Portfolio URL (Optional)" hi="यूट्यूब/पोर्टफोलियो यूआरएल (वैकल्पिक)" /></Label><Controller name="portfolioUrl" control={control} render={({ field }) => <Input id="portfolioUrl" type="url" {...field} value={field.value ?? ''} placeholder="https://youtube.com/yourchannel" />} />{errors.portfolioUrl && <p className="text-xs text-destructive mt-1">{errors.portfolioUrl.message}</p>}</div>
                
                <Card className="bg-muted/50 p-4">
                     <p className="text-sm font-medium mb-2">Contact Details (Private, for OSO)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="contactPersonName"><BilingualText en="Contact Person Full Name" hi="संपर्क व्यक्ति का पूरा नाम" /></Label><Controller name="contactPersonName" control={control} render={({ field }) => <Input id="contactPersonName" {...field} value={field.value ?? ''} />} /></div>
                      <div><Label htmlFor="contactPersonEmail"><BilingualText en="Contact Person Email" hi="संपर्क व्यक्ति ईमेल" /></Label><Controller name="contactPersonEmail" control={control} render={({ field }) => <Input id="contactPersonEmail" type="email" {...field} value={field.value ?? ''} />} /></div>
                    </div>
                    <div className="mt-4"><Label htmlFor="contactPersonPhone"><BilingualText en="Contact Phone" hi="संपर्क फ़ोन" /></Label><Controller name="contactPersonPhone" control={control} render={({ field }) => <Input id="contactPersonPhone" {...field} value={field.value ?? ''} />} /></div>
                </Card>
              </>
            )}

            {(currentRole === 'student' || currentRole === 'parent') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="city"><BilingualText en="City" hi="शहर" /></Label><Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} value={field.value ?? ''} />} /></div>
                    <div><Label htmlFor="state"><BilingualText en="State" hi="राज्य" /></Label><Controller name="state" control={control} render={({ field }) => <Input id="state" {...field} value={field.value ?? ''} />} /></div>
                </div>
            )}
             <div><Label htmlFor="country"><BilingualText en="Country" hi="देश" /></Label><Controller name="country" control={control} render={({ field }) => <Input id="country" {...field} value={field.value ?? ''} />} /></div>

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
    

    