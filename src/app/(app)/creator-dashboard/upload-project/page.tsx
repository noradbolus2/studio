
// src/app/(app)/creator-dashboard/upload-project/page.tsx
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UploadCloud, PackagePlus, DollarSign, FileText, Image as ImageIcon, Video, Layers, CalendarClock, BookOpen, Edit3, Tag, ArrowLeft } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const uploadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  uploadType: z.enum(["Individual Chapter", "Full Subject"], { required_error: "Please select an upload type" }),
  targetClass: z.string().min(1, "Please select a target class"),
  subject: z.string().min(1, "Please select a subject"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  price: z.coerce.number({invalid_type_error: "Price must be a number"}).min(0, "Price must be 0 or a positive number"),
  liveClassDateTime: z.date().optional(),
  recordedVideoUrl: z.string().url("Please enter a valid URL for the video").optional().or(z.literal('')),
  notesFileName: z.string().optional(),
  assignmentFileName: z.string().optional(),
  thumbnailName: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 Science", "11 Commerce", "11 Arts", "12 Science", "12 Commerce", "12 Arts", "JEE", "NEET", "UPSC", "Other Competitive Exams"];
const subjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"];

export default function UploadContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);
  const [notesFileName, setNotesFileName] = useState<string | null>(null);
  const [assignmentFileName, setAssignmentFileName] = useState<string | null>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const notesFileRef = useRef<HTMLInputElement>(null);
  const assignmentFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      uploadType: undefined,
      targetClass: "",
      subject: "",
      description: "",
      price: undefined,
      liveClassDateTime: undefined,
      recordedVideoUrl: "",
      notesFileName: "",
      assignmentFileName: "",
      thumbnailName: "",
    },
  });

  const uploadType = watch("uploadType");

  const onSubmit: SubmitHandler<UploadFormData> = async (data) => {
    setIsLoading(true);
    console.log("Course/Chapter Data to Upload (Simulated):", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Content Uploaded (Simulated)",
      description: `"${data.title}" has been submitted for review.`,
    });
    setIsLoading(false);
    router.push("/creator-dashboard/my-projects"); 
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, fileType: 'thumbnail' | 'notes' | 'assignment') => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileType === 'thumbnail' && !file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file for the thumbnail.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "File must be less than 5MB.", variant: "destructive" });
        return;
      }
      
      switch(fileType) {
        case 'thumbnail':
          setThumbnailFileName(file.name);
          setValue("thumbnailName", file.name);
          break;
        case 'notes':
          setNotesFileName(file.name);
          setValue("notesFileName", file.name);
          break;
        case 'assignment':
          setAssignmentFileName(file.name);
          setValue("assignmentFileName", file.name);
          break;
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                  <PackagePlus className="h-7 w-7" />
                  <BilingualText en="Upload Chapter or Course" hi="अध्याय या कोर्स अपलोड करें" />
                </CardTitle>
                <CardDescription>
                  <BilingualText en="Fill in the details for your new teaching content." hi="अपनी नई शिक्षण सामग्री के लिए विवरण भरें।" />
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.back()} className="flex-shrink-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <BilingualText en="Back" hi="वापस"/>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="uploadType"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Upload Type" hi="अपलोड का प्रकार" />*</Label>
              <Controller
                name="uploadType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="uploadType"><SelectValue placeholder_en="Select Upload Type" placeholder_hi="अपलोड का प्रकार चुनें" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual Chapter">Individual Chapter</SelectItem>
                      <SelectItem value="Full Subject">Full Subject</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.uploadType && <p className="text-xs text-destructive mt-1">{errors.uploadType.message}</p>}
            </div>

            <div>
              <Label htmlFor="title"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Title" hi="शीर्षक" />*</Label>
              <Controller name="title" control={control} render={({ field }) => <Input id="title" {...field} placeholder_en="e.g., Modern Physics / Complete NEET Physics" placeholder_hi="उदा., आधुनिक भौतिकी / पूर्ण NEET भौतिकी" />} />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetClass"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Target Class/Exam" hi="लक्ष्य कक्षा/परीक्षा" />*</Label>
                <Controller
                  name="targetClass"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="targetClass"><SelectValue placeholder_en="Select Class/Exam" placeholder_hi="कक्षा/परीक्षा चुनें" /></SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.targetClass && <p className="text-xs text-destructive mt-1">{errors.targetClass.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Subject" hi="विषय" />*</Label>
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
              <Label htmlFor="price"><DollarSign className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Price (INR)" hi="मूल्य (INR)" />*</Label>
              <Controller name="price" control={control} render={({ field }) => <Input id="price" type="number" {...field} placeholder_en={uploadType === "Individual Chapter" ? "e.g., 49-99" : "e.g., 299-499"} placeholder_hi={uploadType === "Individual Chapter" ? "उदा., 49-99" : "उदा., 299-499"} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
              {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="description"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Description" hi="विवरण" />*</Label>
              <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} placeholder_en="Detailed description of the content, learning outcomes, etc." placeholder_hi="सामग्री का विस्तृत विवरण, सीखने के परिणाम, आदि।" className="min-h-[100px]" />} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <Card className="bg-muted/50 p-4 space-y-4">
                <CardTitle className="text-md font-semibold flex items-center gap-2">
                    <BilingualText en="Course Content" hi="पाठ्यक्रम सामग्री"/>
                </CardTitle>
                <div>
                  <Label htmlFor="liveClassDateTime"><CalendarClock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Schedule Live Class (Optional)" hi="लाइव क्लास शेड्यूल करें (वैकल्पिक)" /></Label>
                   <Controller
                        name="liveClassDateTime"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal h-10 bg-background", !field.value && "text-muted-foreground")}
                                >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP HH:mm") : <span><BilingualText en="Pick date & time" hi="दिनांक और समय चुनें"/></span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                <div className="p-3 border-t border-border">
                                  <Label htmlFor="time" className="text-xs">Time (HH:MM)</Label>
                                  <Input type="time" id="time" className="mt-1 h-8" defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                                    onChange={(e) => {
                                        const time = e.target.value;
                                        if (field.value && time) {
                                            const [hours, minutes] = time.split(':').map(Number);
                                            const newDate = new Date(field.value);
                                            newDate.setHours(hours); newDate.setMinutes(minutes);
                                            field.onChange(newDate);
                                        }
                                    }}
                                  />
                                </div>
                            </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>

                <div>
                  <Label htmlFor="recordedVideoUrl"><Video className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Upload Recorded Video URL (Optional)" hi="रिकॉर्ड किया गया वीडियो यूआरएल अपलोड करें (वैकल्पिक)" /></Label>
                  <Controller name="recordedVideoUrl" control={control} render={({ field }) => <Input id="recordedVideoUrl" {...field} placeholder_en="e.g., https://vimeo.com/your-video" placeholder_hi="उदा., https://vimeo.com/your-video" />} />
                  {errors.recordedVideoUrl && <p className="text-xs text-destructive mt-1">{errors.recordedVideoUrl.message}</p>}
                </div>
                
                 <div>
                    <Label htmlFor="notesFile"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Upload Notes (PDF)" hi="नोट्स अपलोड करें (पीडीएफ)" /></Label>
                    <Input id="notesFile" type="file" accept=".pdf" ref={notesFileRef} onChange={(e) => handleFileChange(e, 'notes')} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    {notesFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {notesFileName}</p>}
                </div>
                
                 <div>
                    <Label htmlFor="assignmentFile"><Tag className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Upload Assignment/MCQs (PDF)" hi="असाइनमेंट/एमसीक्यू अपलोड करें (पीडीएफ)" /></Label>
                    <Input id="assignmentFile" type="file" accept=".pdf" ref={assignmentFileRef} onChange={(e) => handleFileChange(e, 'assignment')} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    {assignmentFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {assignmentFileName}</p>}
                </div>
                
                 <div>
                    <Label htmlFor="thumbnail"><ImageIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Course Thumbnail" hi="कोर्स थंबनेल" /></Label>
                    <Input id="thumbnail" type="file" accept="image/*" ref={thumbnailFileRef} onChange={(e) => handleFileChange(e, 'thumbnail')} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    {thumbnailFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {thumbnailFileName}</p>}
                </div>
            </Card>


          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <UploadCloud className="mr-2 h-5 w-5" />}
              <BilingualText en="Upload Content" hi="सामग्री अपलोड करें" />
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
}
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
