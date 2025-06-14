
// Placeholder for Study Dashboard with Pocket School + Voice Notes
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PocketSchoolLoadingAnimation } from "@/components/shared/LoadingSpinner"; // Assuming this exists
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, DownloadCloud, Headphones, Mic, PlayCircle, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Added useToast

// Mock data
const pocketSchoolContent = [
  { id: 'ps1', titleEn: "Chapter 5: Light - Reflection and Refraction", titleHi: "अध्याय 5: प्रकाश - परावर्तन और अपवर्तन", subjectEn: "Physics", subjectHi: "भौतिक विज्ञान", size: "25 MB", downloaded: true },
  { id: 'ps2', titleEn: "Video: Chemical Reactions", titleHi: "वीडियो: रासायनिक अभिक्रियाएँ", subjectEn: "Chemistry", subjectHi: "रसायन विज्ञान", size: "40 MB", downloaded: true },
  { id: 'ps3', titleEn: "Quiz: Cell Biology", titleHi: "क्विज़: कोशिका जीव विज्ञान", subjectEn: "Biology", subjectHi: "जीव विज्ञान", size: "5 MB", downloaded: false },
];

const voiceNotes = [
  { id: 'vn1', titleEn: "Maths Formulas Lecture", titleHi: "गणित सूत्र व्याख्यान", date: "2024-06-10", duration: "15:32" },
  { id: 'vn2', titleEn: "History Quick Revision", titleHi: "इतिहास त्वरित पुनरीक्षण", date: "2024-06-08", duration: "08:45" },
];

export default function StudyDashboardPage() {
  const { toast } = useToast(); // Initialize toast

  const handleGenericAction = (actionName: string) => {
    toast({
      title: "Action Simulated",
      description: `${actionName} feature is coming soon or this action has been simulated.`,
    });
  };

  const handleDownloadItem = (itemName: string) => {
    toast({
      title: "Download Started (Simulated)",
      description: `Downloading "${itemName}"...`,
    });
  };

  const handlePlayItem = (itemName: string) => {
    toast({
      title: "Playback Started (Simulated)",
      description: `Playing "${itemName}"... Actual playback requires player integration.`,
    });
  };
  
  const handleDeleteVoiceNote = (noteTitle: string) => {
    toast({
      title: "Voice Note Deleted (Simulated)",
      description: `"${noteTitle}" has been removed.`,
      variant: "destructive"
    });
    // In a real app, you'd update state here
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          <BilingualText en="Study Dashboard" hi="अध्ययन डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Your offline content and voice notes, all in one place." hi="आपकी ऑफ़लाइन सामग्री और वॉयस नोट्स, सब एक ही स्थान पर।" />
        </p>
      </header>

      {/* OSO Pocket School Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <DownloadCloud className="h-7 w-7 text-primary" />
            <BilingualText en="OSO Pocket School™" hi="OSO पॉकेट स्कूल™" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Access downloaded lessons, videos, and quizzes offline." hi="डाउनलोड किए गए पाठ, वीडियो और क्विज़ ऑफ़लाइन एक्सेस करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pocketSchoolContent.length > 0 ? (
            <ul className="space-y-3">
              {pocketSchoolContent.map(item => (
                <li key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-sm"><BilingualText en={item.titleEn} hi={item.titleHi} /></h4>
                    <p className="text-xs text-muted-foreground">
                      <BilingualText en={item.subjectEn} hi={item.subjectHi} /> - {item.size}
                    </p>
                  </div>
                  {item.downloaded ? (
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => handlePlayItem(item.titleEn)}>
                      <PlayCircle className="mr-1.5 h-4 w-4" /> <BilingualText en="Play" hi="चलाएं"/>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadItem(item.titleEn)}>
                      <DownloadCloud className="mr-1.5 h-4 w-4" /> <BilingualText en="Download" hi="डाउनलोड करें"/>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
             <PocketSchoolLoadingAnimation /> // Or a "No content downloaded" message
          )}
          <Button className="w-full mt-4" variant="outline" onClick={() => handleGenericAction("Manage Offline Content")}>
            <BilingualText en="Manage Offline Content" hi="ऑफ़लाइन सामग्री प्रबंधित करें" />
          </Button>
        </CardContent>
      </Card>

      {/* Voice-to-Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Mic className="h-7 w-7 text-accent" />
            <BilingualText en="Voice Notes" hi="वॉयस नोट्स" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Record and listen to your study notes in Hindi & Hinglish." hi="हिंदी और हिंग्लिश में अपने अध्ययन नोट्स रिकॉर्ड करें और सुनें।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full mb-4 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleGenericAction("Record New Voice Note")}>
            <UploadCloud className="mr-2 h-5 w-5" />
            <BilingualText en="Record New Voice Note" hi="नया वॉयस नोट रिकॉर्ड करें" />
          </Button>
          {voiceNotes.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {voiceNotes.map(note => (
                <AccordionItem value={note.id} key={note.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex-grow text-left">
                        <p className="font-medium text-sm"><BilingualText en={note.titleEn} hi={note.titleHi} /></p>
                        <p className="text-xs text-muted-foreground">{note.date} - {note.duration}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-x-2 p-2 bg-muted/30 rounded-md">
                    <Button variant="outline" size="sm" onClick={() => handlePlayItem(note.titleEn)}><Headphones className="mr-1.5 h-4 w-4"/> <BilingualText en="Play" hi="चलाएं"/></Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteVoiceNote(note.titleEn)}><Trash2 className="mr-1.5 h-4 w-4"/> <BilingualText en="Delete" hi="मिटाएं"/></Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              <BilingualText en="No voice notes recorded yet." hi="अभी तक कोई वॉयस नोट रिकॉर्ड नहीं किया गया है।" />
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

