
// src/app/(app)/creator-dashboard/upload-project/page.tsx
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UploadCloud, PackagePlus, BookOpen, Palette, Code2, FlaskConical, Edit3, DollarSign, FileText, Image as ImageIcon, Video } from "lucide-react";

const projectSchema = z.object({
  projectTitle: z.string().min(5, "Project title must be at least 5 characters"),
  targetClass: z.string().min(1, "Please select a target class"),
  subject: z.string().min(1, "Please select a subject"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  sampleImageUrl: z.string().optional(), // For now, just storing the name or a placeholder
  sampleVideoUrl: z.string().url("Please enter a valid URL for the video (e.g., YouTube, Vimeo)").optional().or(z.literal('')),
  priceDigital: z.coerce.number().min(0, "Price must be 0 or more").optional(),
  pricePhysicalKit: z.coerce.number().min(0, "Price must be 0 or more").optional(),
}).refine(data => data.priceDigital !== undefined || data.pricePhysicalKit !== undefined, {
  message: "At least one price (Digital or Physical Kit) must be provided.",
  path: ["priceDigital"], // Show error near the first price field
});

type ProjectFormData = z.infer<typeof projectSchema>;

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "Competitive Exams", "All Ages"];
const subjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"];
const projectCategories = [ // For potential future use, or to derive subjects
    { id: 'science_model', nameEn: 'Science Models', nameHi: 'विज्ञान मॉडल', icon: FlaskConical },
    { id: 'coding_ai', nameEn: 'Coding & AI', nameHi: 'कोडिंग और एआई', icon: Code2 },
    { id: 'art_craft', nameEn: 'Art & Craft', nameHi: 'कला और शिल्प', icon: Palette },
    { id: 'research_essay', nameEn: 'Research/Essay', nameHi: 'शोध/निबंध', icon: Edit3 },
];


export default function UploadProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: "",
      targetClass: "",
      subject: "",
      description: "",
      sampleImageUrl: "",
      sampleVideoUrl: "",
      priceDigital: undefined,
      pricePhysicalKit: undefined,
    },
  });

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setIsLoading(true);
    console.log("Project Data to Upload (Simulated):", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Project Uploaded (Simulated)",
      description: `"${data.projectTitle}" has been submitted for review.`,
    });
    setIsLoading(false);
    router.push("/creator-dashboard"); // Redirect back to dashboard after successful "upload"
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        setSelectedFileName(null);
        if(imageFileRef.current) imageFileRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File Too Large", description: "Image must be less than 5MB.", variant: "destructive" });
        setSelectedFileName(null);
        if(imageFileRef.current) imageFileRef.current.value = "";
        return;
      }
      setSelectedFileName(file.name);
      // In a real app, you'd handle the file upload to Firebase Storage here
      // and store the URL in form state (e.g., setValue('sampleImageUrl', uploadedUrl))
      // For now, we just show the name.
    } else {
        setSelectedFileName(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
              <PackagePlus className="h-7 w-7" />
              <BilingualText en="Upload New Project Template" hi="नया प्रोजेक्ट टेम्पलेट अपलोड करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Fill in the details for your new student project." hi="अपने नए छात्र प्रोजेक्ट के लिए विवरण भरें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="projectTitle"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Project Title" hi="प्रोजेक्ट शीर्षक" />*</Label>
              <Controller name="projectTitle" control={control} render={({ field }) => <Input id="projectTitle" {...field} placeholder_en="e.g., Working Volcano Model" placeholder_hi="उदा., वर्किंग ज्वालामुखी मॉडल" />} />
              {errors.projectTitle && <p className="text-xs text-destructive mt-1">{errors.projectTitle.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetClass"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Target Class" hi="लक्ष्य कक्षा" />*</Label>
                <Controller
                  name="targetClass"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="targetClass"><SelectValue placeholder_en="Select Class" placeholder_hi="कक्षा चुनें" /></SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.targetClass && <p className="text-xs text-destructive mt-1">{errors.targetClass.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject"><Palette className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Subject" hi="विषय" />*</Label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="subject"><SelectValue placeholder_en="Select Subject" placeholder_hi="विषय चुनें" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Project Description" hi="प्रोजेक्ट विवरण" />*</Label>
              <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} placeholder_en="Detailed description of the project, learning outcomes, etc. (max 500 chars)" placeholder_hi="प्रोजेक्ट का विस्तृत विवरण, सीखने के परिणाम, आदि। (अधिकतम 500 अक्षर)" className="min-h-[100px]" />} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="sampleImage"><ImageIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Sample Image" hi="नमूना छवि" /> (Max 5MB)</Label>
              <Input 
                id="sampleImage" 
                type="file" 
                accept="image/*" 
                ref={imageFileRef}
                onChange={handleImageFileChange} 
                className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
               />
              {selectedFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFileName}</p>}
              {errors.sampleImageUrl && <p className="text-xs text-destructive mt-1">{errors.sampleImageUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="sampleVideoUrl"><Video className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Sample Video URL (Optional)" hi="नमूना वीडियो यूआरएल (वैकल्पिक)" /></Label>
              <Controller name="sampleVideoUrl" control={control} render={({ field }) => <Input id="sampleVideoUrl" {...field} placeholder_en="e.g., https://www.youtube.com/watch?v=..." placeholder_hi="उदा., https://www.youtube.com/watch?v=..." />} />
              {errors.sampleVideoUrl && <p className="text-xs text-destructive mt-1">{errors.sampleVideoUrl.message}</p>}
            </div>

            <Card className="bg-muted/50 p-4">
                <CardTitle className="text-md font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18}/> <BilingualText en="Pricing (INR)" hi="मूल्य निर्धारण (INR)"/>
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="priceDigital"><BilingualText en="Digital Version Price" hi="डिजिटल संस्करण मूल्य" /></Label>
                        <Controller name="priceDigital" control={control} render={({ field }) => <Input id="priceDigital" type="number" {...field} placeholder="e.g., 199" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                        {errors.priceDigital && <p className="text-xs text-destructive mt-1">{errors.priceDigital.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pricePhysicalKit"><BilingualText en="Physical Kit Price (Optional)" hi="फिजिकल किट मूल्य (वैकल्पिक)" /></Label>
                        <Controller name="pricePhysicalKit" control={control} render={({ field }) => <Input id="pricePhysicalKit" type="number" {...field} placeholder="e.g., 499" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                         {errors.pricePhysicalKit && <p className="text-xs text-destructive mt-1">{errors.pricePhysicalKit.message}</p>}
                    </div>
                </div>
                 {errors.root && <p className="text-xs text-destructive mt-2">{errors.root.message}</p>}
            </Card>


          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <UploadCloud className="mr-2 h-5 w-5" />}
              <BilingualText en="Submit Project" hi="प्रोजेक्ट सबमिट करें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
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
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
