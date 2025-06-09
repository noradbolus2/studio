
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
import { UploadCloud, PackagePlus, BookOpen, Palette, Code2, FlaskConical, Edit3, DollarSign, FileText, Image as ImageIcon, Video, Layers } from "lucide-react"; // Added Layers

const projectSchema = z.object({
  projectTitle: z.string().min(5, "Content title must be at least 5 characters"),
  contentType: z.string().min(1, "Please select a content type"), // New field
  targetClass: z.string().min(1, "Please select a target class"),
  subject: z.string().min(1, "Please select a subject"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  sampleImageUrl: z.string().optional(), 
  sampleVideoUrl: z.string().url("Please enter a valid URL for the video (e.g., YouTube, Vimeo)").optional().or(z.literal('')),
  priceDigital: z.coerce.number().min(0, "Price must be 0 or more").optional(),
  pricePhysicalKit: z.coerce.number().min(0, "Price must be 0 or more").optional(),
  priceCourse: z.coerce.number().min(0, "Price must be 0 or more").optional(), // For courses/guides
}).refine(data => data.priceDigital !== undefined || data.pricePhysicalKit !== undefined || data.priceCourse !== undefined, {
  message: "At least one price (Digital, Physical Kit, or Course) must be provided.",
  path: ["priceDigital"], 
});

type ProjectFormData = z.infer<typeof projectSchema>;

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "Competitive Exams", "All Ages"];
const subjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"];
const contentTypes = ["Project Template", "Video Course", "PDF Guide", "Live Workshop Plan", "Interactive Quiz Pack"];


export default function UploadContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: "",
      contentType: "",
      targetClass: "",
      subject: "",
      description: "",
      sampleImageUrl: "",
      sampleVideoUrl: "",
      priceDigital: undefined,
      pricePhysicalKit: undefined,
      priceCourse: undefined,
    },
  });

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setIsLoading(true);
    console.log("Content Data to Upload (Simulated):", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Content Uploaded (Simulated)",
      description: `"${data.projectTitle}" has been submitted for review.`,
    });
    setIsLoading(false);
    router.push("/creator-dashboard/my-projects"); 
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
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "Image must be less than 5MB.", variant: "destructive" });
        setSelectedFileName(null);
        if(imageFileRef.current) imageFileRef.current.value = "";
        return;
      }
      setSelectedFileName(file.name);
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
              <BilingualText en="Upload New Content" hi="नई सामग्री अपलोड करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Fill in the details for your new student content (project, course, guide)." hi="अपनी नई छात्र सामग्री (प्रोजेक्ट, कोर्स, गाइड) के लिए विवरण भरें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="projectTitle"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Content Title" hi="सामग्री शीर्षक" />*</Label>
              <Controller name="projectTitle" control={control} render={({ field }) => <Input id="projectTitle" {...field} placeholder_en="e.g., Working Volcano Model / Python Masterclass" placeholder_hi="उदा., वर्किंग ज्वालामुखी मॉडल / पायथन मास्टरक्लास" />} />
              {errors.projectTitle && <p className="text-xs text-destructive mt-1">{errors.projectTitle.message}</p>}
            </div>
            
            <div>
                <Label htmlFor="contentType"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Content Type" hi="सामग्री प्रकार" />*</Label>
                <Controller
                  name="contentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="contentType"><SelectValue placeholder_en="Select Content Type" placeholder_hi="सामग्री प्रकार चुनें" /></SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.contentType && <p className="text-xs text-destructive mt-1">{errors.contentType.message}</p>}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetClass"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Target Class/Audience" hi="लक्ष्य कक्षा/दर्शक" />*</Label>
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
              <Label htmlFor="description"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Content Description" hi="सामग्री विवरण" />*</Label>
              <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} placeholder_en="Detailed description of the content, learning outcomes, etc. (max 500 chars)" placeholder_hi="सामग्री का विस्तृत विवरण, सीखने के परिणाम, आदि। (अधिकतम 500 अक्षर)" className="min-h-[100px]" />} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="sampleImage"><ImageIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Thumbnail/Sample Image" hi="थंबनेल/नमूना छवि" /> (Max 5MB)</Label>
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
              <Label htmlFor="sampleVideoUrl"><Video className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Intro/Sample Video URL (Optional)" hi="परिचय/नमूना वीडियो यूआरएल (वैकल्पिक)" /></Label>
              <Controller name="sampleVideoUrl" control={control} render={({ field }) => <Input id="sampleVideoUrl" {...field} placeholder_en="e.g., https://www.youtube.com/watch?v=..." placeholder_hi="उदा., https://www.youtube.com/watch?v=..." />} />
              {errors.sampleVideoUrl && <p className="text-xs text-destructive mt-1">{errors.sampleVideoUrl.message}</p>}
            </div>

            <Card className="bg-muted/50 p-4">
                <CardTitle className="text-md font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18}/> <BilingualText en="Pricing (INR)" hi="मूल्य निर्धारण (INR)"/>*
                </CardTitle>
                <CardDescription className="text-xs mb-3"><BilingualText en="Set price for digital access, physical kits, or full course." hi="डिजिटल एक्सेस, भौतिक किट, या पूर्ण पाठ्यक्रम के लिए मूल्य निर्धारित करें।" /></CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <Label htmlFor="priceDigital"><BilingualText en="Digital Template/Guide" hi="डिजिटल टेम्पलेट/गाइड" /></Label>
                        <Controller name="priceDigital" control={control} render={({ field }) => <Input id="priceDigital" type="number" {...field} placeholder="e.g., 199" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                        {errors.priceDigital && <p className="text-xs text-destructive mt-1">{errors.priceDigital.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pricePhysicalKit"><BilingualText en="Physical Kit (Optional)" hi="भौतिक किट (वैकल्पिक)" /></Label>
                        <Controller name="pricePhysicalKit" control={control} render={({ field }) => <Input id="pricePhysicalKit" type="number" {...field} placeholder="e.g., 499" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                         {errors.pricePhysicalKit && <p className="text-xs text-destructive mt-1">{errors.pricePhysicalKit.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="priceCourse"><BilingualText en="Course/Workshop Access" hi="कोर्स/कार्यशाला प्रवेश" /></Label>
                        <Controller name="priceCourse" control={control} render={({ field }) => <Input id="priceCourse" type="number" {...field} placeholder="e.g., 999" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                         {errors.priceCourse && <p className="text-xs text-destructive mt-1">{errors.priceCourse.message}</p>}
                    </div>
                </div>
                 {errors.root && <p className="text-xs text-destructive mt-2">{errors.root.message}</p>}
            </Card>


          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <UploadCloud className="mr-2 h-5 w-5" />}
              <BilingualText en="Submit Content" hi="सामग्री सबमिट करें" />
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
