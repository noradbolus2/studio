
"use client";

import { useState, useEffect } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings, Palette, ToggleRight, Construction, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the structure for our settings
interface PlatformSettings {
  theme: {
    primary: { h: number; s: number; l: number };
    accent: { h: number; s: number; l: number };
    background: { h: number; s: number; l: number };
  };
  features: {
    creatorMarketplaceEnabled: boolean;
    aiBrainScanEnabled: boolean;
    deliveryServiceEnabled: boolean;
  };
  maintenanceMode: boolean;
}

// Default values from globals.css
const defaultSettings: PlatformSettings = {
  theme: {
    primary: { h: 262, s: 83, l: 58 },
    accent: { h: 38, s: 92, l: 50 },
    background: { h: 210, s: 20, l: 98 },
  },
  features: {
    creatorMarketplaceEnabled: true,
    aiBrainScanEnabled: true,
    deliveryServiceEnabled: true,
  },
  maintenanceMode: false,
};

const SETTINGS_KEY = "osoPlatformSettings";

export default function SystemSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        updateTheme(parsedSettings.theme);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setIsLoading(false);
  }, []);

  // Function to update CSS variables dynamically
  const updateTheme = (theme: PlatformSettings['theme']) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', `${theme.primary.h} ${theme.primary.s}% ${theme.primary.l}%`);
    root.style.setProperty('--accent', `${theme.accent.h} ${theme.accent.s}% ${theme.accent.l}%`);
    root.style.setProperty('--background', `${theme.background.h} ${theme.background.s}% ${theme.background.l}%`);
  };

  const handleThemeChange = (color: 'primary' | 'accent' | 'background', property: 'h' | 's' | 'l', value: number) => {
    const newSettings = {
        ...settings,
        theme: {
            ...settings.theme,
            [color]: {
                ...settings.theme[color],
                [property]: value
            }
        }
    };
    setSettings(newSettings);
    updateTheme(newSettings.theme);
  };
  
  const handleFeatureToggle = (feature: keyof PlatformSettings['features'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };
  
  const handleMaintenanceToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, maintenanceMode: value }));
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your platform settings have been updated.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Could not save settings.",
        variant: "destructive",
      });
    }
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    updateTheme(defaultSettings.theme);
    localStorage.removeItem(SETTINGS_KEY);
    toast({
        title: "Settings Reset",
        description: "Platform settings have been reset to their defaults.",
    });
  };

  if (isLoading) {
      return <div><BilingualText en="Loading settings..." hi="सेटिंग्स लोड हो रही हैं..."/></div>;
  }

  const ColorSlider = ({ color, nameEn, nameHi }: { color: 'primary' | 'accent' | 'background', nameEn: string, nameHi: string}) => (
    <div className="space-y-4 rounded-md border p-3">
        <h4 className="text-sm font-medium"><BilingualText en={nameEn} hi={nameHi}/></h4>
        <div>
            <Label>Hue ({settings.theme[color].h})</Label>
            <Slider value={[settings.theme[color].h]} onValueChange={(v) => handleThemeChange(color, 'h', v[0])} max={360} step={1} />
        </div>
        <div>
            <Label>Saturation ({settings.theme[color].s}%)</Label>
            <Slider value={[settings.theme[color].s]} onValueChange={(v) => handleThemeChange(color, 's', v[0])} max={100} step={1} />
        </div>
        <div>
            <Label>Lightness ({settings.theme[color].l}%)</Label>
            <Slider value={[settings.theme[color].l]} onValueChange={(v) => handleThemeChange(color, 'l', v[0])} max={100} step={1} />
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          <BilingualText en="System Settings" hi="सिस्टम सेटिंग्स" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="General Settings" hi="सामान्य सेटिंग्स" /></CardTitle>
          <CardDescription><BilingualText en="Configure global settings for the OSO application." hi="ओएसओ एप्लिकेशन के लिए वैश्विक सेटिंग्स कॉन्फ़िगर करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Card className="p-4">
                <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2"><Palette/> Branding & Theme</CardTitle>
                <CardDescription className="mb-4">Live-preview theme color changes. These are based on HSL color values.</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <ColorSlider color="primary" nameEn="Primary" nameHi="प्राथमिक"/>
                   <ColorSlider color="accent" nameEn="Accent" nameHi="उच्चारण"/>
                   <ColorSlider color="background" nameEn="Background" nameHi="पृष्ठभूमि"/>
                </div>
            </Card>

            <Card className="p-4">
                <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2"><ToggleRight/> Feature Flags</CardTitle>
                 <CardDescription className="mb-4">Enable or disable major features across the platform.</CardDescription>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <Label htmlFor="ff-creator" className="font-medium">Enable Creator Marketplace</Label>
                        <Switch id="ff-creator" checked={settings.features.creatorMarketplaceEnabled} onCheckedChange={(v) => handleFeatureToggle('creatorMarketplaceEnabled', v)} />
                    </div>
                     <div className="flex items-center justify-between rounded-md border p-3">
                        <Label htmlFor="ff-brainscan" className="font-medium">Enable AI Brain Scan / Aura Map</Label>
                        <Switch id="ff-brainscan" checked={settings.features.aiBrainScanEnabled} onCheckedChange={(v) => handleFeatureToggle('aiBrainScanEnabled', v)} />
                    </div>
                     <div className="flex items-center justify-between rounded-md border p-3">
                        <Label htmlFor="ff-delivery" className="font-medium">Enable Stationery Delivery Service</Label>
                        <Switch id="ff-delivery" checked={settings.features.deliveryServiceEnabled} onCheckedChange={(v) => handleFeatureToggle('deliveryServiceEnabled', v)} />
                    </div>
                </div>
            </Card>

            <Card className="p-4 border-destructive/50">
                <CardTitle className="text-lg font-semibold mb-3 flex items-center gap-2 text-destructive"><Construction/> Maintenance Mode</CardTitle>
                <CardDescription className="mb-4">Puts the entire application into maintenance mode for all non-admin users.</CardDescription>
                <div className="flex items-center justify-between rounded-md border p-3 bg-destructive/10">
                    <Label htmlFor="maintenance-mode" className="font-medium">Enable Maintenance Mode</Label>
                    <Switch id="maintenance-mode" checked={settings.maintenanceMode} onCheckedChange={handleMaintenanceToggle} />
                </div>
            </Card>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetToDefaults}>
                <RotateCcw className="mr-2 h-4 w-4"/> Reset to Defaults
            </Button>
            <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4"/> Save Settings
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

