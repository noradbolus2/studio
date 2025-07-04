
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BilingualText } from "@/components/shared/BilingualText";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  PlusCircle, ArrowLeft, Edit3, BookOpen, Layers, IndianRupeeIcon, Clock, Languages, ImageIcon,
  FileText, Video, CalendarClock, Link as LinkIcon, MessageCircle, GripVertical, Pencil, Trash2, BookCopy, TestTube2, Save,
  Settings, Users, Lock, Download, Award, Wand2, RefreshCw
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { type GenerateThumbnailInput } from '@/ai/flows/generate-thumbnail-flow';
import { generateAiThumbnail } from '@/ai/flows/generate-thumbnail-flow';


const courseSchema = z.object({
  course_title_en: z.string().min(5, "Title must be at least 5 characters"),
  subject: z.string().min(1, "Please select a subject"),
  class_level: z.string().min(1, "Please select a class/exam level"),
  description_en: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  price_inr: z.coerce.number({invalid_type_error: "Price must be a number"}).min(0, "Price must be 0 or a positive number").optional(),
  language_of_instruction: z.enum(["English", "Hindi", "Hinglish"], { required_error: "Please select a language" }),
  thumbnail_image_url: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  status: z.enum(["Draft", "Published", "Pending Approval"]),
  physical_notes_enabled: z.boolean().optional().default(false),
  physical_notes_price: z.coerce.number().optional(),
  physical_notes_pdf_name: z.string().optional(),
  courseValidity: z.enum(["Lifetime", "Days", "Batch Only"], { required_error: "Please select course validity" }).default("Lifetime"),
  validityDays: z.coerce.number().positive("Must be a positive number").optional(),
  studentLimit: z.enum(["Unlimited", "Limited", "Invite Only"], { required_error: "Please select student limit" }).default("Unlimited"),
  limitCount: z.coerce.number().positive("Must be a positive number").optional(),
  downloadsDisabled: z.boolean().optional().default(false),
  videoLockEnabled: z.boolean().optional().default(false),
  certificateEnabled: z.boolean().optional().default(false),
}).refine(data => {
    // If physical notes are enabled, a price greater than 0 must be provided.
    if (data.physical_notes_enabled && (!data.physical_notes_price || data.physical_notes_price <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A price greater than 0 is required for printed notes.",
    path: ["physical_notes_price"],
}).refine(data => {
    if (data.courseValidity === 'Days' && (!data.validityDays || data.validityDays <= 0)) {
        return false;
    }
    return true;
}, {
    message: "Number of days is required for 'Days' validity.",
    path: ["validityDays"],
}).refine(data => {
    if (data.studentLimit === 'Limited' && (!data.limitCount || data.limitCount <= 0)) {
        return false;
    }
    return true;
}, {
    message: "Student count is required for 'Limited' student limit.",
    path: ["limitCount"],
});

type CourseFormData = z.infer<typeof courseSchema>;

const subjects = ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Entrepreneurship", "Other"];
const classLevels = ["Nursery", "LKG", "UKG", "Class 1-3", "Class 4-5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "JEE", "NEET", "CUET", "UPSC", "General"];

// Mock lesson data for the UI
const mockLessons = [
    { id: 'l1', type: 'Video', title: 'Video: Introduction to Atomic Models', icon: Video, iconColor: "text-red-500" },
    { id: 'l2', type: 'Notes', title: 'PDF: Dalton\'s Atomic Theory', icon: FileText, iconColor: "text-blue-500" },
    { id: 'l3', type: 'Quiz', title: 'Quiz: Subatomic Particles', icon: TestTube2, iconColor: "text-green-500" },
];

export default function CreateCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const [printedNotesFileName, setPrintedNotesFileName] = useState<string | null>(null);
  const printedNotesFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: "Draft",
      physical_notes_enabled: false,
      courseValidity: "Lifetime",
      studentLimit: "Unlimited",
      downloadsDisabled: false,
      videoLockEnabled: false,
      certificateEnabled: false,
    },
  });

  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [thumbnailMood, setThumbnailMood] = useState<string>("Energetic");
  const [teacherPhoto, setTeacherPhoto] = useState<File | null>(null);
  const [teacherPhotoPreview, setTeacherPhotoPreview] = useState<string | null>(null);
  const teacherPhotoRef = useRef<HTMLInputElement>(null);

  const courseTitle = watch('course_title_en');
  const courseSubject = watch('subject');

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
      setValue("thumbnail_image_url", file.name);
    }
  };

  const handlePrintedNotesFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({ title: "Invalid File Type", description: "Please select a PDF file.", variant: "destructive" });
        return;
      }
      if (file.size > 25 * 1024 * 1024) { // 25MB limit for PDF
        toast({ title: "File Too Large", description: "PDF must be less than 25MB.", variant: "destructive" });
        return;
      }
      setPrintedNotesFileName(file.name);
      setValue("physical_notes_pdf_name", file.name);
    }
  };

  const handleLessonAction = (action: string, lessonTitle: string) => {
    toast({
        title: "Action (Simulated)",
        description: `${action} action clicked for "${lessonTitle}". This feature is in development.`
    });
  }
  
  const handleTeacherPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "File Too Large", description: "Image must be less than 2MB.", variant: "destructive" });
        return;
      }
      setTeacherPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeacherPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!courseTitle || !courseSubject) {
        toast({ title: "Missing Info", description: "Please enter a Course Title and Subject first.", variant: "destructive" });
        return;
    }
    setIsGeneratingThumbnail(true);
    setGeneratedThumbnail(null);
    try {
        const input: GenerateThumbnailInput = {
            videoTitle: courseTitle,
            subject: courseSubject,
            mood: thumbnailMood as any,
            teacherImageUri: teacherPhotoPreview || undefined,
        };

        const result = await generateAiThumbnail(input);
        setGeneratedThumbnail(result.imageDataUri);
        toast({ title: "Thumbnail Generated!", description: "Check out the AI-created thumbnail below."});

    } catch (err: any) {
        toast({ title: "Generation Failed", description: err.message || "Could not generate thumbnail.", variant: "destructive" });
    } finally {
        setIsGeneratingThumbnail(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                  <PlusCircle className="h-7 w-7" />
                  <BilingualText en="Create New Course" hi="नया कोर्स बनाएं" />
                </CardTitle>
                <CardDescription>
                  <BilingualText en="Build your course chapter by chapter with videos, notes, and quizzes." hi="वीडियो, नोट्स और क्विज़ के साथ अध्याय दर अध्याय अपना पाठ्यक्रम बनाएं।" />
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <BilingualText en="Back" hi="वापस"/>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3"><BilingualText en="Course Information" hi="कोर्स की जानकारी"/></CardTitle>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="course_title_en"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Course Title" hi="कोर्स शीर्षक" />*</Label>
                        <Controller name="course_title_en" control={control} render={({ field }) => <Input {...field} placeholder_en="e.g., Mastering Modern Physics" />} />
                        {errors.course_title_en && <p className="text-xs text-destructive mt-1">{errors.course_title_en.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="description_en"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Description" hi="विवरण" />*</Label>
                        <Controller name="description_en" control={control} render={({ field }) => <Textarea {...field} placeholder_en="Describe the course, what students will learn, etc." className="min-h-[80px]" />} />
                        {errors.description_en && <p className="text-xs text-destructive mt-1">{errors.description_en.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="subject"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Subject" hi="विषय" />*</Label>
                            <Controller name="subject" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                            )} />
                            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="class_level"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Class/Exam" hi="कक्षा/परीक्षा" />*</Label>
                            <Controller name="class_level" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger><SelectContent>{classLevels.map(cl => <SelectItem key={cl} value={cl}>{cl}</SelectItem>)}</SelectContent></Select>
                            )} />
                            {errors.class_level && <p className="text-xs text-destructive mt-1">{errors.class_level.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="language_of_instruction"><Languages className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Language" hi="भाषा" />*</Label>
                            <Controller name="language_of_instruction" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger><SelectContent><SelectItem value="English">English</SelectItem><SelectItem value="Hindi">Hindi</SelectItem><SelectItem value="Hinglish">Hinglish</SelectItem></SelectContent></Select>
                            )} />
                            {errors.language_of_instruction && <p className="text-xs text-destructive mt-1">{errors.language_of_instruction.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                         <div>
                            <Label htmlFor="price_inr"><IndianRupeeIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Price (INR)" hi="मूल्य (INR)" /></Label>
                            <Controller name="price_inr" control={control} render={({ field }) => <Input {...field} type="number" placeholder="e.g., 499 (0 for free)" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />} />
                            {errors.price_inr && <p className="text-xs text-destructive mt-1">{errors.price_inr.message}</p>}
                        </div>
                        <div>
                           <Label htmlFor="start_date"><CalendarClock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Start Date" hi="प्रारंभ दिनांक" /></Label>
                            <Controller name="start_date" control={control} render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarClock className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />
                        </div>
                         <div>
                           <Label htmlFor="end_date"><CalendarClock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="End Date" hi="अंतिम दिनांक" /></Label>
                           <Controller name="end_date" control={control} render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarClock className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3"><BilingualText en="Syllabus Builder" hi="पाठ्यक्रम निर्माता"/></CardTitle>
                 <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold text-md">Chapter 1: Atomic Structure</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-background rounded-md border space-y-3">
                            <ul className="space-y-2">
                                {mockLessons.map(lesson => (
                                     <li key={lesson.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <lesson.icon className={cn("h-5 w-5", lesson.iconColor)} />
                                            <span className="text-sm font-medium">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleLessonAction('Edit', lesson.title)}><Pencil className="h-4 w-4 text-muted-foreground"/></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleLessonAction('Delete', lesson.title)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2 pt-2 border-t">
                                <Button variant="outline" size="sm" onClick={() => toast({title: "Adding Video (Simulated)"})}><Video className="mr-2 h-4 w-4"/> Add Video</Button>
                                <Button variant="outline" size="sm" onClick={() => toast({title: "Adding Notes (Simulated)"})}><FileText className="mr-2 h-4 w-4"/> Add Notes/PDF</Button>
                                <Button variant="outline" size="sm" onClick={() => toast({title: "Adding Quiz (Simulated)"})}><TestTube2 className="mr-2 h-4 w-4"/> Add Quiz</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button variant="secondary" className="w-full mt-4" onClick={() => toast({title: "Adding Chapter (Simulated)"})}>
                    <PlusCircle className="mr-2 h-4 w-4"/> <BilingualText en="Add Chapter" hi="अध्याय जोड़ें"/>
                </Button>
            </Card>

             <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary"/>
                  <BilingualText en="AI Thumbnail Generator™" hi="AI थंबनेल जेनरेटर™"/>
                </CardTitle>
                 <CardDescription className="text-xs mb-3">
                    Generate an energetic, eye-catching thumbnail for your course with one click.
                </CardDescription>
                <div className="space-y-4">
                  <div>
                    <Label>Mood / Style*</Label>
                    <Select value={thumbnailMood} onValueChange={setThumbnailMood}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Energetic">Energetic</SelectItem>
                        <SelectItem value="Motivational">Motivational</SelectItem>
                        <SelectItem value="Calm">Calm</SelectItem>
                        <SelectItem value="Exam Mode">Exam Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div>
                    <Label htmlFor="teacher-photo" className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4"/> Add Your Face (Optional)
                    </Label>
                    <Input id="teacher-photo" type="file" accept="image/*" ref={teacherPhotoRef} onChange={handleTeacherPhotoChange} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                     {teacherPhotoPreview && <Image src={teacherPhotoPreview} alt="Teacher preview" width={60} height={60} className="mt-2 rounded-md border p-1"/>}
                  </div>
                   <Button type="button" onClick={handleGenerateThumbnail} disabled={!courseTitle || !courseSubject || isGeneratingThumbnail} className="w-full">
                    {isGeneratingThumbnail ? <LoadingSpinner/> : <Wand2 className="mr-2 h-4 w-4"/>}
                    Generate Now
                  </Button>
                </div>
                 {generatedThumbnail && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-center">Generated Thumbnail:</h4>
                    <Image src={generatedThumbnail} alt="AI Generated Thumbnail" width={1280} height={720} className="rounded-lg border-2 border-primary shadow-lg"/>
                    <div className="flex gap-2">
                       <Button type="button" variant="outline" size="sm" className="w-full"><Download className="mr-2 h-4 w-4"/> Download</Button>
                       <Button type="button" variant="ghost" size="sm" className="w-full" onClick={handleGenerateThumbnail}><RefreshCw className="mr-2 h-4 w-4"/> Generate Again</Button>
                    </div>
                  </div>
                )}
            </Card>

            <Card className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookCopy className="h-5 w-5"/>
                    <BilingualText en="Optional: Offer Printed Notes" hi="वैकल्पिक: मुद्रित नोट्स ऑफ़र करें"/>
                </CardTitle>
                <CardDescription className="text-xs mb-3">
                    Let students order a spiral-bound copy of your notes. Fulfilled by OSO vendors.
                </CardDescription>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-2 bg-background rounded-md border">
                        <Controller name="physical_notes_enabled" control={control} render={({ field }) => (
                            <Switch id="physical_notes_enabled" checked={field.value} onCheckedChange={field.onChange} />
                        )} />
                        <Label htmlFor="physical_notes_enabled" className="text-sm font-medium cursor-pointer">
                            <BilingualText en="Enable Printed Notes for this course" hi="इस कोर्स के लिए मुद्रित नोट्स सक्षम करें"/>
                        </Label>
                    </div>
                    
                    {watch("physical_notes_enabled") && (
                        <div className="space-y-4 pl-4 pt-4 border-l-2 border-primary ml-2">
                            <div>
                                <Label htmlFor="physical_notes_price"><IndianRupeeIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Price for Printed Notes (INR)" hi="मुद्रित नोट्स के लिए मूल्य (INR)" />*</Label>
                                <Controller name="physical_notes_price" control={control} render={({ field }) => (
                                    <Input {...field} type="number" placeholder="e.g., 199" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                                )} />
                                 {errors.physical_notes_price && <p className="text-xs text-destructive mt-1">{errors.physical_notes_price.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="printed_notes_pdf"><FileText className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Upload Final PDF for Printing" hi="मुद्रण के लिए अंतिम पीडीएफ अपलोड करें" /></Label>
                                 <Input id="printed_notes_pdf" type="file" accept=".pdf" ref={printedNotesFileRef} onChange={handlePrintedNotesFileChange} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                 {printedNotesFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {printedNotesFileName}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="bg-muted/30 p-4">
              <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5"/>
                  <BilingualText en="Settings & License Control" hi="सेटिंग्स और लाइसेंस नियंत्रण"/>
              </CardTitle>
              <div className="space-y-4">
                  {/* Course Validity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div>
                          <Label htmlFor="courseValidity" className="flex items-center gap-1.5 mb-1"><Clock className="h-4 w-4"/>Course Validity*</Label>
                          <Controller
                              name="courseValidity"
                              control={control}
                              render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger><SelectValue/></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Lifetime">Lifetime</SelectItem>
                                          <SelectItem value="Days">Limited Days</SelectItem>
                                          <SelectItem value="Batch Only">Batch Only</SelectItem>
                                      </SelectContent>
                                  </Select>
                              )}
                          />
                          {errors.courseValidity && <p className="text-xs text-destructive mt-1">{errors.courseValidity.message}</p>}
                      </div>
                      {watch("courseValidity") === "Days" && (
                          <div>
                              <Label htmlFor="validityDays">Number of Days*</Label>
                              <Controller
                                  name="validityDays"
                                  control={control}
                                  render={({ field }) => <Input {...field} type="number" placeholder="e.g., 180" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />}
                              />
                              {errors.validityDays && <p className="text-xs text-destructive mt-1">{errors.validityDays.message}</p>}
                          </div>
                      )}
                  </div>

                  {/* Student Limit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div>
                          <Label htmlFor="studentLimit" className="flex items-center gap-1.5 mb-1"><Users className="h-4 w-4"/>Student Limit*</Label>
                          <Controller
                              name="studentLimit"
                              control={control}
                              render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger><SelectValue/></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Unlimited">Unlimited</SelectItem>
                                          <SelectItem value="Limited">Limited Number</SelectItem>
                                          <SelectItem value="Invite Only">Invite Only</SelectItem>
                                      </SelectContent>
                                  </Select>
                              )}
                          />
                          {errors.studentLimit && <p className="text-xs text-destructive mt-1">{errors.studentLimit.message}</p>}
                      </div>
                      {watch("studentLimit") === "Limited" && (
                          <div>
                              <Label htmlFor="limitCount">Max Students*</Label>
                              <Controller
                                  name="limitCount"
                                  control={control}
                                  render={({ field }) => <Input {...field} type="number" placeholder="e.g., 100" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />}
                              />
                              {errors.limitCount && <p className="text-xs text-destructive mt-1">{errors.limitCount.message}</p>}
                          </div>
                      )}
                  </div>

                  {/* Switches */}
                  <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                          <Controller name="downloadsDisabled" control={control} render={({ field }) => <Switch id="downloadsDisabled" checked={field.value} onCheckedChange={field.onChange} />} />
                          <Label htmlFor="downloadsDisabled" className="flex items-center gap-1.5"><Download className="h-4 w-4"/> Disable PDF/Video Downloads</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Controller name="videoLockEnabled" control={control} render={({ field }) => <Switch id="videoLockEnabled" checked={field.value} onCheckedChange={field.onChange} />} />
                          <Label htmlFor="videoLockEnabled" className="flex items-center gap-1.5"><Lock className="h-4 w-4"/> Enable Video Lock (Sequential Viewing)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Controller name="certificateEnabled" control={control} render={({ field }) => <Switch id="certificateEnabled" checked={field.value} onCheckedChange={field.onChange} />} />
                          <Label htmlFor="certificateEnabled" className="flex items-center gap-1.5"><Award className="h-4 w-4"/> Auto-Generate Certificate on Completion</Label>
                      </div>
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
              {isSubmitting ? <LoadingSpinner size={20} /> : <Save className="mr-2 h-5 w-5" />}
              <BilingualText en="Save Course" hi="कोर्स सहेजें" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
