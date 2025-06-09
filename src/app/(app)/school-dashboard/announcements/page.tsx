
// src/app/(app)/school-dashboard/announcements/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, PlusCircle, Edit2, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetAudience: "All" | "Students" | "Teachers" | "Parents" | `Class ${string}`;
}

const mockAnnouncements: Announcement[] = [
  { id: "AN001", title: "Annual Sports Day Rescheduled", content: "The Annual Sports Day has been rescheduled to next Friday due to weather conditions. New timings will be shared soon.", date: "2024-07-20", targetAudience: "All" },
  { id: "AN002", title: "PTM for Class 10", content: "Parent-Teacher Meeting for Class 10 will be held on Saturday, 27th July, from 9 AM to 12 PM.", date: "2024-07-18", targetAudience: "Class 10" },
  { id: "AN003", title: "Staff Meeting", content: "A mandatory staff meeting is scheduled for tomorrow at 3 PM in the auditorium.", date: "2024-07-15", targetAudience: "Teachers" },
];

export default function SchoolAnnouncementsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", targetAudience: "All" as Announcement['targetAudience'] });

  const handleCreateAnnouncement = () => {
    const newId = `AN${String(announcements.length + 1).padStart(3, '0')}`;
    setAnnouncements(prev => [{ ...newAnnouncement, id: newId, date: new Date().toISOString().split('T')[0] }, ...prev]);
    toast({ title: "Announcement Posted", description: `"${newAnnouncement.title}" has been posted.`});
    setIsCreateDialogOpen(false);
    setNewAnnouncement({ title: "", content: "", targetAudience: "All" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Bell className="h-7 w-7 text-primary" />
          <BilingualText en="Post Announcements" hi="घोषणाएँ पोस्ट करें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/school-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle><BilingualText en="School Communications" hi="स्कूल संचार" /></CardTitle>
                <CardDescription><BilingualText en="Create, schedule, and view school-wide announcements." hi="स्कूल-व्यापी घोषणाएँ बनाएँ, शेड्यूल करें और देखें।" /></CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <BilingualText en="New Announcement" hi="नई घोषणा" />
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length > 0 ? announcements.map(ann => (
            <Card key={ann.id} className="bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{ann.title}</CardTitle>
                    <Badge variant={ann.targetAudience === "All" ? "default" : "secondary"} className="text-xs">{ann.targetAudience}</Badge>
                </div>
                <CardDescription className="text-xs">Posted on: {new Date(ann.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm pb-3">
                <p className="line-clamp-2">{ann.content}</p>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end text-xs pt-2 border-t">
                 <Button variant="ghost" size="sm" className="h-7 px-2"><Eye className="mr-1 h-3 w-3"/> View</Button>
                 <Button variant="ghost" size="sm" className="h-7 px-2"><Edit2 className="mr-1 h-3 w-3"/> Edit</Button>
                 <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive"><Trash2 className="mr-1 h-3 w-3"/> Delete</Button>
              </CardFooter>
            </Card>
          )) : (
            <p className="text-muted-foreground text-center py-6"><BilingualText en="No announcements posted yet." hi="अभी तक कोई घोषणा पोस्ट नहीं की गई है।" /></p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle><BilingualText en="Create New Announcement" hi="नई घोषणा बनाएं" /></DialogTitle>
                <DialogDescription><BilingualText en="Compose and target your announcement." hi="अपनी घोषणा लिखें और लक्षित करें।" /></DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
                <div>
                    <Label htmlFor="annTitle"><BilingualText en="Title" hi="शीर्षक" /></Label>
                    <Input id="annTitle" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement(p => ({...p, title: e.target.value}))} />
                </div>
                <div>
                    <Label htmlFor="annContent"><BilingualText en="Content" hi="सामग्री" /></Label>
                    <Textarea id="annContent" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement(p => ({...p, content: e.target.value}))} className="min-h-[100px]" />
                </div>
                <div>
                    <Label htmlFor="annTarget"><BilingualText en="Target Audience" hi="लक्षित दर्शक" /></Label>
                    <Select value={newAnnouncement.targetAudience} onValueChange={(val) => setNewAnnouncement(p => ({...p, targetAudience: val as Announcement['targetAudience']}))}>
                        <SelectTrigger id="annTarget">
                            <SelectValue placeholder_en="Select Audience" placeholder_hi="दर्शक चुनें" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Students">Students</SelectItem>
                            <SelectItem value="Teachers">Teachers</SelectItem>
                            <SelectItem value="Parents">Parents</SelectItem>
                            {[...Array(12)].map((_, i) => <SelectItem key={`Class ${i+1}`} value={`Class ${i+1}`}>Class {i+1}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}><BilingualText en="Cancel" hi="रद्द करें" /></Button>
                <Button onClick={handleCreateAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.content}><BilingualText en="Post Announcement" hi="घोषणा पोस्ट करें" /></Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}

    