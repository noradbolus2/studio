
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Music2, PlayCircle, Waves, Leaf, Brain } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface FocusTrack {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: React.ElementType;
  imageUrl: string;
  dataAiHint: string;
  duration?: string; // e.g., "25 min", "1 hour loop"
}

const focusTracks: FocusTrack[] = [
  {
    id: "track1",
    titleEn: "Ambient Study Beats",
    titleHi: "एम्बिएंट स्टडी बीट्स",
    descriptionEn: "Calming electronic music to enhance concentration.",
    descriptionHi: "एकाग्रता बढ़ाने के लिए शांत इलेक्ट्रॉनिक संगीत।",
    icon: Headphones,
    imageUrl: "https://placehold.co/300x150.png",
    dataAiHint: "headphones abstract music",
    duration: "1 hour loop",
  },
  {
    id: "track2",
    titleEn: "Nature Sounds for Focus",
    titleHi: "फोकस के लिए प्रकृति की ध्वनियाँ",
    descriptionEn: "Gentle rain and forest sounds to block distractions.",
    descriptionHi: "ध्यान भंग को रोकने के लिए हल्की बारिश और जंगल की आवाज़ें।",
    icon: Leaf,
    imageUrl: "https://placehold.co/300x150.png",
    dataAiHint: "forest nature sounds",
    duration: "45 min",
  },
  {
    id: "track3",
    titleEn: "Lofi Chillhop Mix",
    titleHi: "लो-फाई चिलहॉप मिक्स",
    descriptionEn: "Relaxed instrumental hip hop for creative work.",
    descriptionHi: "रचनात्मक कार्य के लिए आरामदायक वाद्य हिप हॉप।",
    icon: Music2,
    imageUrl: "https://placehold.co/300x150.png",
    dataAiHint: "lofi anime study",
    duration: "Continuous Mix",
  },
  {
    id: "track4",
    titleEn: "Binaural Beats (Alpha Waves)",
    titleHi: "बाइनॉरल बीट्स (अल्फा तरंगें)",
    descriptionEn: "Designed to promote relaxation and focus.",
    descriptionHi: "विश्राम और फोकस को बढ़ावा देने के लिए डिज़ाइन किया गया।",
    icon: Waves,
    imageUrl: "https://placehold.co/300x150.png",
    dataAiHint: "brain waves audio",
    duration: "30 min session",
  },
];

export default function FocusMusicPage() {
  const { toast } = useToast();

  const handlePlayTrack = (trackTitleEn: string) => {
    toast({
      title: "Playing Track (Simulated)",
      description: `Starting "${trackTitleEn}". Actual audio playback needs to be implemented.`,
    });
    // In a real app, you would integrate an audio player here.
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center gap-2">
          <Brain className="h-8 w-8" />
          <BilingualText en="Focus Zone Music" hi="फोकस ज़ोन संगीत" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText 
            en="Enhance your concentration with curated soundscapes." 
            hi="क्यूरेटेड साउंडस्केप के साथ अपनी एकाग्रता बढ़ाएं।" 
          />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {focusTracks.map((track) => (
          <Card key={track.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-video relative w-full bg-muted/30">
                <Image 
                  src={track.imageUrl} 
                  alt={track.titleEn} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={track.dataAiHint} 
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-1">
              <CardTitle className="text-md font-semibold leading-tight flex items-center gap-2">
                <track.icon className="h-5 w-5 text-primary" />
                <BilingualText en={track.titleEn} hi={track.titleHi} />
              </CardTitle>
              <CardDescription className="text-xs h-8 overflow-hidden line-clamp-2">
                <BilingualText en={track.descriptionEn} hi={track.descriptionHi} />
              </CardDescription>
              {track.duration && <p className="text-xs text-muted-foreground">Duration: {track.duration}</p>}
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handlePlayTrack(track.titleEn)}
              >
                <PlayCircle size={18} className="mr-2" />
                <BilingualText en="Play Sound" hi="ध्वनि चलाएं" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card className="mt-8 bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="font-headline text-accent"><BilingualText en="How Music Helps Focus" hi="संगीत फोकस में कैसे मदद करता है"/></CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-accent-foreground/80 space-y-2">
            <p><BilingualText en="✓ Ambient sounds can mask distracting noises." hi="✓ परिवेशी ध्वनियाँ ध्यान भटकाने वाले शोर को छिपा सकती हैं।" /></p>
            <p><BilingualText en="✓ Certain types of music (like Lofi or classical) can improve mood and reduce stress." hi="✓ कुछ प्रकार का संगीत (जैसे लोफ़ी या शास्त्रीय) मूड में सुधार कर सकता है और तनाव कम कर सकता है।" /></p>
            <p><BilingualText en="✓ Binaural beats are claimed to influence brainwaves to promote specific mental states." hi="✓ बाइनॉरल बीट्स को विशिष्ट मानसिक अवस्थाओं को बढ़ावा देने के लिए मस्तिष्क तरंगों को प्रभावित करने का दावा किया जाता है।" /></p>
        </CardContent>
      </Card>

    </div>
  );
}
