
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
import { CalendarClock, BookOpen, Layers, Tag, Image as ImageIcon, Edit3, UploadCloud, Video, ArrowLeft } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const classLevels = ["Nursery", "LKG", "UKG", "Class 1-3", "Class 4-5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "JEE", "NEET", "CUET", "UPSC", "General"];
const subjects = ["Maths", "Physics", "Chemistry", "Biology", "Science", "English", "Hindi", "Social Studies", "History", "Geography", "Civics", "Economics", "Computer Science", "AI/ML", "Art & Craft", "General Knowledge", "Current Affairs", "Revision", "Doubt Solving", "Other"];

const scheduleClassSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subject: z.string().min(1, "Please select a subject"),
  classLevel: z.string().min(1, "Please select a class level"),
  dateTime: z.date({ required_error: "Date and time are required." }),
  tags: z.string().optional(), // Comma-separated
  description: z.string().min(10, "Description must be at least 10 characters").max(300, "Max 300 chars"),
  thumbnailName: z.string().optional(), // Store file name for now
});

type ScheduleClassFormData = z.infer<typeof scheduleClassSchema>;

export default function ScheduleClassPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ScheduleClassFormData>({
    resolver: zodResolver(scheduleClassSchema),
    defaultValues: {
      title: "",
      subject: "",
      classLevel: "",
      tags: "",
      description: "",
      thumbnailName: "",
    },
  });

  const onSubmit: SubmitHandler<ScheduleClassFormData> = async (data) => {
    setIsLoading(true);
    const fullData = {
      ...data,
      streamType: "in_app", // Default as per requirement
      thumbnailFile: thumbnailFileRef.current?.files?.[0] // For actual upload later
    };
    console.log("Class Data to Schedule (Simulated):", fullData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Class Scheduled (Simulated)",
      description: `"${data.title}" has been scheduled.`,
    });
    setIsLoading(false);
    router.push("/coaching-panel"); 
  };

  const handleThumbnailFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        setSelectedFileName(null);
        if(thumbnailFileRef.current) thumbnailFileRef.current.value = "";
        setValue("thumbnailName", "");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "File Too Large", description: "Image must be less than 2MB.", variant: "destructive" });
        setSelectedFileName(null);
        if(thumbnailFileRef.current) thumbnailFileRef.current.value = "";
        setValue("thumbnailName", "");
        return;
      }
      setSelectedFileName(file.name);
      setValue("thumbnailName", file.name); // Store name for validation
    } else {
      setSelectedFileName(null);
      setValue("thumbnailName", "");
    }
  };

  return (
    <div className="space-y-6">
       <header className="text-center relative">
        <Button variant="outline" size="icon" className="absolute left-0 top-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Video className="h-8 w-8" />
          <BilingualText en="Schedule New Live Class" hi="नई लाइव कक्षा शेड्यूल करें" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Fill in the details to create your live session." hi="अपना लाइव सत्र बनाने के लिए विवरण भरें।" />
        </p>
      </header>
      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-5">
            <div>
              <Label htmlFor="title"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Class Title" hi="कक्षा शीर्षक" />*</Label>
              <Controller name="title" control={control} render={({ field }) => <Input id="title" {...field} placeholder_en="e.g., Mastering Photosynthesis" placeholder_hi="उदा., प्रकाश संश्लेषण में महारत" />} />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject"><BookOpen className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Subject" hi="विषय" />*</Label>
                <Controller name="subject" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="subject"><SelectValue placeholder_en="Select Subject" placeholder_hi="विषय चुनें" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                )} />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="classLevel"><Layers className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Class Level" hi="कक्षा स्तर" />*</Label>
                <Controller name="classLevel" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="classLevel"><SelectValue placeholder_en="Select Class Level" placeholder_hi="कक्षा स्तर चुनें" /></SelectTrigger>
                      <SelectContent>
                        {classLevels.map(cl => <SelectItem key={cl} value={cl}>{cl}</SelectItem>)}
                      </SelectContent>
                    </Select>
                )} />
                {errors.classLevel && <p className="text-xs text-destructive mt-1">{errors.classLevel.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dateTime"><CalendarClock className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Date & Time" hi="दिनांक और समय" />*</Label>
                    <Controller
                        name="dateTime"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal h-10", !field.value && "text-muted-foreground")}
                                >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP HH:mm") : <span><BilingualText en="Pick date & time" hi="दिनांक और समय चुनें"/></span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                <div className="p-3 border-t border-border">
                                  <Label htmlFor="time" className="text-xs">Time (HH:MM)</Label>
                                  <Input type="time" id="time" className="mt-1 h-8" 
                                    defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                                    onChange={(e) => {
                                        const time = e.target.value;
                                        if (field.value && time) {
                                            const [hours, minutes] = time.split(':').map(Number);
                                            const newDate = new Date(field.value);
                                            newDate.setHours(hours);
                                            newDate.setMinutes(minutes);
                                            field.onChange(newDate);
                                        } else if (time) { 
                                            const today = new Date();
                                            const [hours, minutes] = time.split(':').map(Number);
                                            today.setHours(hours);
                                            today.setMinutes(minutes);
                                            field.onChange(today);
                                        }
                                    }}
                                  />
                                </div>
                            </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.dateTime && <p className="text-xs text-destructive mt-1">{errors.dateTime.message}</p>}
                </div>
                <div>
                    <Label htmlFor="tags"><Tag className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Tags (Optional)" hi="टैग (वैकल्पिक)" /></Label>
                    <Controller name="tags" control={control} render={({ field }) => <Input id="tags" {...field} placeholder_en="e.g., Revision, Doubts, Ch-5" placeholder_hi="उदा., रिवीजन, शंकाएँ, अध्याय-5" />} />
                </div>
            </div>
            
            <div>
              <Label htmlFor="description"><Edit3 className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Short Description" hi="संक्षिप्त विवरण" />*</Label>
              <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} placeholder_en="Briefly describe the class topic (max 300 chars)" placeholder_hi="कक्षा के विषय का संक्षिप्त विवरण दें (अधिकतम 300 अक्षर)" className="min-h-[80px]" />} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="thumbnail"><ImageIcon className="inline mr-1.5 h-4 w-4" /> <BilingualText en="Thumbnail Image" hi="थंबनेल छवि" /> (Max 2MB)</Label>
              <Input 
                id="thumbnail" 
                type="file" 
                accept="image/*" 
                ref={thumbnailFileRef}
                onChange={handleThumbnailFileChange}
                className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
               />
              {selectedFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFileName}</p>}
              {errors.thumbnailName && <p className="text-xs text-destructive mt-1">{errors.thumbnailName.message}</p>}
            </div>

          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <LoadingSpinner size={20} /> : <UploadCloud className="mr-2 h-5 w-5" />}
              <BilingualText en="Schedule Class" hi="कक्षा शेड्यूल करें" />
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
