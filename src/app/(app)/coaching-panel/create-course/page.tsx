
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
import { Switch } from "@/components/ui/switch";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  PlusCircle, ArrowLeft, Edit3, BookOpen, Layers, IndianRupeeIcon, Clock, Languages, Image as ImageIcon,
  FileText, Video, CalendarClock, Link as LinkIcon, MessageCircle
} from "lucide-react";

const courseSchema = z.object({
  course_title_en: z.string().min(5, "Title must be at least 5 characters"),
  course_title_hi: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  class_level: z.string().min(1, "Please select a class/exam level"),
  course_type: z.enum(["Live Interactive", "Recorded Lectures", "Notes Only", "Live + Recorded + Notes", "Full Course", "Crash Course"], { required_error: "Please select a course type" }),
  description_en: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  description_hi: z.string().optional(),
  price_inr: z.coerce.number({invalid_type_error: "Price must be a number"}).min(0, "Price must be 0 or a positive number").optional(),
  duration_descriptive: z.string().optional(),
  language_of_instruction: z.enum(["English", "Hindi", "Hinglish"], { required_error: "Please select a language" }),
  thumbnail_image_url: z.string().optional(),
  
  // Live Class Details
  live_class_platform: z.string().optional(),
  live_class_join_link: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  live_class_start_datetime: z.date().optional(),

  // Notes Details
  notes_uploaded: z.boolean().default(false),
  notes_link: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),

  is_doubt_forum_enabled: z.boolean().default(false),
  status: z.enum(["Draft", "Published", "Pending Approval"]),
});

type CourseFormData = z.infer<typeof courseSchema>;

const subjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"];
const classLevels = ["Nursery", "LKG", "UKG", "Class 1-3", "Class 4-5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "JEE", "NEET", "CUET", "UPSC", "General"];

export default function CreateCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: "Draft",
      notes_uploaded: false,
      is_doubt_forum_enabled: false,
    },
  });

  const courseType = watch("course_type");
  const notesUploaded = watch("notes_uploaded");

  const onSubmit: SubmitHandler<CourseFormData> = async (data) => {
    console.log("Course Data Submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Course Saved!",
      description: `"${data.course_title_en}" has been saved as a ${data.status.toLowerCase()}.`,
    });
    router.push("/coaching-panel");
  };
  
  const handleThumbnailFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file for the thumbnail.", variant: "destructive" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "File Too Large", description: "Image must be less than 2MB.", variant: "destructive" });
        return;
      }
      setThumbnailFileName(file.name);
      // In a real app, you would upload this file and set the URL. For now, we store the name.
      setValue("thumbnail_image_url", file.name);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                  <PlusCircle className="h-7 w-7" />
                  <BilingualText en="Create New Course" hi="नया कोर्स बनाएं" />
                </CardTitle>
                <CardDescription>
                  <BilingualText en="Fill in the details for your new course, lecture series, or notes." hi="अपने नए पाठ्यक्रम, व्याख्यान श्रृंखला या नोट्स के लिए विवरण भरें।" />
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <BilingualText en="Back" hi="वापस"/>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Basic Info */}
            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3"><BilingualText en="Basic Information" hi="मूल जानकारी"/></CardTitle>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="course_title_en"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Course Title (English)" hi="कोर्स शीर्षक (अंग्रेजी)" />*</Label>
                        <Controller name="course_title_en" control={control} render={({ field }) => <Input {...field} placeholder_en="e.g., Mastering Modern Physics" />} />
                        {errors.course_title_en && <p className="text-xs text-destructive mt-1">{errors.course_title_en.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description_en"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Description (English)" hi="विवरण (अंग्रेजी)" />*</Label>
                        <Controller name="description_en" control={control} render={({ field }) => <Textarea {...field} placeholder_en="Describe the course, what students will learn, etc." className="min-h-[80px]" />} />
                        {errors.description_en && <p className="text-xs text-destructive mt-1">{errors.description_en.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="subject"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Subject" hi="विषय" />*</Label>
                            <Controller name="subject" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                            )} />
                            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="class_level"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Class/Exam Level" hi="कक्षा/परीक्षा स्तर" />*</Label>
                            <Controller name="class_level" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger><SelectContent>{classLevels.map(cl => <SelectItem key={cl} value={cl}>{cl}</SelectItem>)}</SelectContent></Select>
                            )} />
                            {errors.class_level && <p className="text-xs text-destructive mt-1">{errors.class_level.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="language_of_instruction"><Languages className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Language" hi="भाषा" />*</Label>
                            <Controller name="language_of_instruction" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger><SelectContent><SelectItem value="English">English</SelectItem><SelectItem value="Hindi">Hindi</SelectItem><SelectItem value="Hinglish">Hinglish</SelectItem></SelectContent></Select>
                            )} />
                            {errors.language_of_instruction && <p className="text-xs text-destructive mt-1">{errors.language_of_instruction.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="thumbnail_image_url"><ImageIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Thumbnail" hi="थंबनेल" /></Label>
                            <Input id="thumbnail_image_url" type="file" accept="image/*" ref={thumbnailFileRef} onChange={handleThumbnailFileChange} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            {thumbnailFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {thumbnailFileName}</p>}
                        </div>
                    </div>
                </div>
            </Card>
            
            {/* Course Details */}
            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3"><BilingualText en="Course Details" hi="कोर्स विवरण"/></CardTitle>
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="course_type"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Course Type" hi="कोर्स का प्रकार" />*</Label>
                            <Controller name="course_type" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent>{["Live Interactive", "Recorded Lectures", "Notes Only", "Live + Recorded + Notes", "Full Course", "Crash Course"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                            )} />
                            {errors.course_type && <p className="text-xs text-destructive mt-1">{errors.course_type.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="price_inr"><IndianRupeeIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Price (INR)" hi="मूल्य (INR)" /></Label>
                            <Controller name="price_inr" control={control} render={({ field }) => <Input {...field} type="number" placeholder="e.g., 499 (0 for free)" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                            {errors.price_inr && <p className="text-xs text-destructive mt-1">{errors.price_inr.message}</p>}
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="duration_descriptive"><Clock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Course Duration" hi="कोर्स अवधि" /></Label>
                        <Controller name="duration_descriptive" control={control} render={({ field }) => <Input {...field} placeholder="e.g., 4 Weeks, 20 Hours" value={field.value ?? ''} />} />
                    </div>

                    {(courseType?.includes("Live") || courseType === "Full Course") && (
                        <Card className="p-3 bg-background">
                            <h4 className="text-md font-semibold mb-2 flex items-center gap-2"><Video className="text-primary"/>Live Class Details</h4>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="live_class_start_datetime"><CalendarClock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Start Date & Time" hi="प्रारंभ दिनांक और समय" /></Label>
                                    <Controller name="live_class_start_datetime" control={control} render={({ field }) => (
                                        <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarClock className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP HH:mm") : <span>Pick date & time</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /><div className="p-3 border-t"><Input type="time" defaultValue={field.value ? format(field.value, "HH:mm") : ""} onChange={(e) => { const time=e.target.value; if (field.value && time) { const [h, m]=time.split(':').map(Number); const newDate = new Date(field.value); newDate.setHours(h); newDate.setMinutes(m); field.onChange(newDate); }}}/></div></PopoverContent></Popover>
                                    )} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="live_class_platform">Platform</Label>
                                    <Controller name="live_class_platform" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Platform" /></SelectTrigger><SelectContent>{["OSO Platform", "Google Meet", "Zoom", "YouTube Live"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                                    )} />
                                  </div>
                                  <div>
                                    <Label htmlFor="live_class_join_link">Join Link</Label>
                                    <Controller name="live_class_join_link" control={control} render={({ field }) => <Input {...field} placeholder="https://meet.google.com/..." value={field.value ?? ''} />} />
                                    {errors.live_class_join_link && <p className="text-xs text-destructive mt-1">{errors.live_class_join_link.message}</p>}
                                  </div>
                                </div>
                            </div>
                        </Card>
                    )}
                    
                     <div className="flex items-center space-x-2 pt-2">
                        <Controller name="notes_uploaded" control={control} render={({ field }) => (<Switch id="notes_uploaded" checked={field.value} onCheckedChange={field.onChange} />)} />
                        <Label htmlFor="notes_uploaded"><BilingualText en="Include Notes/Study Material?" hi="नोट्स/अध्ययन सामग्री शामिल करें?" /></Label>
                     </div>
                     {notesUploaded && (
                        <div>
                            <Label htmlFor="notes_link"><LinkIcon className="inline mr-1.5 h-4 w-4" /> Notes Link (e.g., Google Drive)</Label>
                            <Controller name="notes_link" control={control} render={({ field }) => <Input {...field} placeholder="https://..." value={field.value ?? ''}/>} />
                            {errors.notes_link && <p className="text-xs text-destructive mt-1">{errors.notes_link.message}</p>}
                        </div>
                     )}

                     <div className="flex items-center space-x-2 pt-2">
                        <Controller name="is_doubt_forum_enabled" control={control} render={({ field }) => (<Switch id="is_doubt_forum_enabled" checked={field.value} onCheckedChange={field.onChange} />)} />
                        <Label htmlFor="is_doubt_forum_enabled"><BilingualText en="Enable Doubt Solving Forum for this course?" hi="इस कोर्स के लिए शंका समाधान फोरम सक्षम करें?" /></Label>
                     </div>
                </div>
            </Card>

            <div>
                <Label htmlFor="status"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Status" hi="स्थिति" />*</Label>
                <Controller name="status" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Set Status" /></SelectTrigger><SelectContent>{["Draft", "Published", "Pending Approval"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                )} />
                <p className="text-xs text-muted-foreground mt-1">Set to 'Draft' to save and publish later. 'Published' makes it visible to students.</p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size={20} /> : <PlusCircle className="mr-2 h-5 w-5" />}
              <BilingualText en="Save Course" hi="कोर्स सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
