
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { generateAiThumbnail, type GenerateThumbnailInput } from "@/ai/flows/generate-thumbnail-flow";
import { Wand2, Download, RefreshCw, ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GeneratePosterDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function GeneratePosterDialog({ isOpen, onOpenChange }: GeneratePosterDialogProps) {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        mood: "Energetic",
    });
    const [teacherPhotoPreview, setTeacherPhotoPreview] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleMoodChange = (value: string) => {
        setFormData(prev => ({ ...prev, mood: value }));
    };

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeacherPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerate = async () => {
        if (!formData.title || !formData.subject) {
            toast({ title: "Missing Info", description: "Please enter a Course Title and Subject.", variant: "destructive" });
            return;
        }
        setIsGenerating(true);
        setGeneratedImage(null);
        try {
            const input: GenerateThumbnailInput = {
                videoTitle: formData.title,
                subject: formData.subject,
                mood: formData.mood as any,
                teacherImageUri: teacherPhotoPreview || undefined,
            };
            const result = await generateAiThumbnail(input);
            setGeneratedImage(result.imageDataUri);
            toast({ title: "Poster Generated!", description: "Check out your AI-created poster below." });
        } catch (err: any) {
            toast({ title: "Generation Failed", description: err.message || "Could not generate poster.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
      if (!generatedImage) return;
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "oso-poster.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Wand2 /> AI Poster Generator</DialogTitle>
                    <DialogDescription>
                        Create an eye-catching promotional poster for your course.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                      <div className="space-y-4 py-2">
                          <div>
                              <Label htmlFor="title">Course Title*</Label>
                              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Mastering Modern Physics" />
                          </div>
                          <div>
                              <Label htmlFor="subject">Subject / Exam*</Label>
                              <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., NEET 2025 / Class 12" />
                          </div>
                          <div>
                              <Label>Mood / Style*</Label>
                              <Select value={formData.mood} onValueChange={handleMoodChange}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                                  <ImageIcon className="h-4 w-4" /> Add Your Face (Optional)
                              </Label>
                              <Input id="teacher-photo" type="file" accept="image/*" onChange={handleTeacherPhotoChange} className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                              {teacherPhotoPreview && <Image src={teacherPhotoPreview} alt="Teacher preview" width={60} height={60} className="mt-2 rounded-md border p-1" />}
                          </div>
                          {isGenerating && (
                              <div className="flex justify-center py-6">
                                  <LoadingSpinner />
                              </div>
                          )}
                          {generatedImage && (
                              <div className="mt-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-center">Generated Poster:</h4>
                                  <Image src={generatedImage} alt="AI Generated Poster" width={1280} height={720} className="rounded-lg border-2 border-primary shadow-lg" />
                                  <div className="flex gap-2">
                                      <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                                      <Button type="button" variant="ghost" size="sm" className="w-full" onClick={handleGenerate}><RefreshCw className="mr-2 h-4 w-4" /> Generate Again</Button>
                                  </div>
                              </div>
                          )}
                      </div>
                  </ScrollArea>
                </div>
                <DialogFooter className="pt-4 border-t flex-shrink-0">
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <LoadingSpinner /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
