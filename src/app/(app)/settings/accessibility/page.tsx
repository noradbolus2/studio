
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BilingualText } from "@/components/shared/BilingualText";
import { ArrowLeft, Accessibility, Contrast, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TtsSettings {
  rate: number;
  pitch: number;
  voiceURI: string | null;
}

export default function AccessibilitySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [ttsSettings, setTtsSettings] = useState<TtsSettings>({ rate: 1, pitch: 1, voiceURI: null });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load settings and voices on mount
  useEffect(() => {
    // Load high contrast setting
    const highContrastEnabled = localStorage.getItem('highContrastMode') === 'true';
    setIsHighContrast(highContrastEnabled);
    if (highContrastEnabled) {
      document.documentElement.classList.add('high-contrast');
    }

    // Load TTS settings
    const savedTtsSettings = localStorage.getItem('ttsSettings');
    if (savedTtsSettings) {
      setTtsSettings(JSON.parse(savedTtsSettings));
    }

    // Populate voices
    const populateVoiceList = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Set default voice if none is selected
        if (!savedTtsSettings && voices.length > 0) {
           const defaultVoice = voices.find(v => v.default) || voices[0];
           if (defaultVoice) {
               setTtsSettings(prev => ({...prev, voiceURI: defaultVoice.voiceURI}));
           }
        }
      }
    };
    
    populateVoiceList();
    if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, []);

  const handleHighContrastToggle = (checked: boolean) => {
    setIsHighContrast(checked);
    if (checked) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrastMode', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrastMode', 'false');
    }
    toast({ title: "Setting Updated", description: `High contrast mode has been ${checked ? 'enabled' : 'disabled'}.` });
  };

  const handleTtsSettingChange = (key: keyof TtsSettings, value: number | string | null) => {
    setTtsSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveTtsSettings = () => {
    localStorage.setItem('ttsSettings', JSON.stringify(ttsSettings));
    toast({ title: "Settings Saved", description: "Text-to-speech settings have been updated." });
  };
  
  const handleTestVoice = () => {
      const utterance = new SpeechSynthesisUtterance("This is a test of the selected voice and speed.");
      if (ttsSettings.voiceURI) {
          const selectedVoice = availableVoices.find(v => v.voiceURI === ttsSettings.voiceURI);
          if (selectedVoice) utterance.voice = selectedVoice;
      }
      utterance.rate = ttsSettings.rate;
      utterance.pitch = ttsSettings.pitch;
      window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Accessibility className="h-8 w-8 text-primary" />
          <BilingualText en="Accessibility" hi="अभिगम्यता" />
        </h1>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Contrast/> Visual Adjustments</CardTitle>
          <CardDescription>Improve readability and on-screen visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
            <Switch id="high-contrast" checked={isHighContrast} onCheckedChange={handleHighContrastToggle} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Volume2/> Text-to-Speech (TTS) Settings</CardTitle>
            <CardDescription>Customize the "Read Aloud" voice, speed, and pitch.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="voice-select">Voice</Label>
                <Select value={ttsSettings.voiceURI || ''} onValueChange={(value) => handleTtsSettingChange('voiceURI', value)}>
                    <SelectTrigger id="voice-select">
                        <SelectValue placeholder="Select a voice..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableVoices.map(voice => (
                            <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                                {voice.name} ({voice.lang})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <div className="flex justify-between">
                    <Label htmlFor="rate-slider">Speed</Label>
                    <span className="text-sm text-primary font-semibold">{ttsSettings.rate.toFixed(2)}x</span>
                </div>
                <Slider id="rate-slider" min={0.5} max={2} step={0.1} value={[ttsSettings.rate]} onValueChange={(val) => handleTtsSettingChange('rate', val[0])}/>
            </div>
             <div className="space-y-2">
                <div className="flex justify-between">
                    <Label htmlFor="pitch-slider">Pitch</Label>
                    <span className="text-sm text-primary font-semibold">{ttsSettings.pitch.toFixed(2)}</span>
                </div>
                <Slider id="pitch-slider" min={0} max={2} step={0.1} value={[ttsSettings.pitch]} onValueChange={(val) => handleTtsSettingChange('pitch', val[0])}/>
            </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleTestVoice}>Test Voice</Button>
            <Button className="w-full sm:w-auto" onClick={saveTtsSettings}>Save TTS Settings</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
