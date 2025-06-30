
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HSLColor = { h: number; s: number; l: number };

interface PlatformSettings {
  lightTheme: {
    primary: HSLColor;
    accent: HSLColor;
    background: HSLColor;
  };
  darkTheme: {
    primary: HSLColor;
    accent: HSLColor;
    background: HSLColor;
  };
  features: {
    creatorMarketplaceEnabled: boolean;
    aiBrainScanEnabled: boolean;
    deliveryServiceEnabled: boolean;
  };
  maintenanceMode: boolean;
}

const defaultSettings: PlatformSettings = {
  lightTheme: {
    primary: { h: 262, s: 83, l: 58 },
    accent: { h: 38, s: 92, l: 50 },
    background: { h: 210, s: 20, l: 98 },
  },
  darkTheme: {
    primary: { h: 262.1, s: 83.3, l: 67.8 },
    accent: { h: 45, s: 92, l: 55 },
    background: { h: 224, s: 71, l: 4 },
  },
  features: {
    creatorMarketplaceEnabled: true,
    aiBrainScanEnabled: true,
    deliveryServiceEnabled: true,
  },
  maintenanceMode: false,
};

const SETTINGS_KEY = "osoPlatformSettings";

function updateTheme(settings: PlatformSettings) {
  const root = document.documentElement;
  // Light Theme
  root.style.setProperty('--primary-hsl', `${settings.lightTheme.primary.h} ${settings.lightTheme.primary.s}% ${settings.lightTheme.primary.l}%`);
  root.style.setProperty('--accent-hsl', `${settings.lightTheme.accent.h} ${settings.lightTheme.accent.s}% ${settings.lightTheme.accent.l}%`);
  root.style.setProperty('--background-hsl', `${settings.lightTheme.background.h} ${settings.lightTheme.background.s}% ${settings.lightTheme.background.l}%`);
  // Dark Theme
  root.style.setProperty('--dark-primary-hsl', `${settings.darkTheme.primary.h} ${settings.darkTheme.primary.s}% ${settings.darkTheme.primary.l}%`);
  root.style.setProperty('--dark-accent-hsl', `${settings.darkTheme.accent.h} ${settings.darkTheme.accent.s}% ${settings.darkTheme.accent.l}%`);
  root.style.setProperty('--dark-background-hsl', `${settings.darkTheme.background.h} ${settings.darkTheme.background.s}% ${settings.darkTheme.background.l}%`);
}

export default function SystemSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        updateTheme(parsedSettings);
      } else {
        updateTheme(defaultSettings); // Apply default on first load
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setIsLoading(false);
  }, []);
  
  const handleThemeChange = (mode: 'lightTheme' | 'darkTheme', color: 'primary' | 'accent' | 'background', property: 'h' | 's' | 'l', value: number) => {
    const newSettings = {
        ...settings,
        [mode]: {
            ...settings[mode],
            [color]: {
                ...settings[mode][color],
                [property]: value
            }
        }
    };
    setSettings(newSettings);
    updateTheme(newSettings);
  };
  
  const handleFeatureToggle = (feature: keyof PlatformSettings['features'], value: boolean) => {
    setSettings(prev => ({ ...prev, features: { ...prev.features, [feature]: value } }));
  };
  
  const handleMaintenanceToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, maintenanceMode: value }));
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast({ title: "Settings Saved", description: "Your platform settings have been updated." });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({ title: "Error", description: "Could not save settings.", variant: "destructive" });
    }
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    updateTheme(defaultSettings);
    localStorage.removeItem(SETTINGS_KEY);
    toast({ title: "Settings Reset", description: "Platform settings have been reset to their defaults." });
  };

  if (isLoading) {
      return <div><BilingualText en="Loading settings..." hi="सेटिंग्स लोड हो रही हैं..."/></div>;
  }

  const ColorSliderGroup = ({ mode, nameEn, nameHi }: { mode: 'lightTheme' | 'darkTheme', nameEn: string, nameHi: string}) => {
    const theme = settings[mode];
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium text-center">{nameEn} / {nameHi}</h4>
             <ColorSlider color="primary" name="Primary" mode={mode} theme={theme} onChange={handleThemeChange}/>
             <ColorSlider color="accent" name="Accent" mode={mode} theme={theme} onChange={handleThemeChange}/>
             <ColorSlider color="background" name="Background" mode={mode} theme={theme} onChange={handleThemeChange}/>
        </div>
    );
  };
  
  const ColorSlider = ({ color, name, mode, theme, onChange }: {color: 'primary'|'accent'|'background', name: string, mode: 'lightTheme' | 'darkTheme', theme: PlatformSettings['lightTheme'] | PlatformSettings['darkTheme'], onChange: typeof handleThemeChange}) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{name}</Label>
      <div className="flex items-center gap-2 text-xs">H: <Slider value={[theme[color].h]} onValueChange={(v) => onChange(mode, color, 'h', v[0])} max={360} step={1} /> ({theme[color].h})</div>
      <div className="flex items-center gap-2 text-xs">S: <Slider value={[theme[color].s]} onValueChange={(v) => onChange(mode, color, 's', v[0])} max={100} step={1} /> ({theme[color].s}%)</div>
      <div className="flex items-center gap-2 text-xs">L: <Slider value={[theme[color].l]} onValueChange={(v) => onChange(mode, color, 'l', v[0])} max={100} step={1} /> ({theme[color].l}%)</div>
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
        <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme"><Palette className="mr-2 h-4 w-4"/> Theme</TabsTrigger>
                <TabsTrigger value="features"><ToggleRight className="mr-2 h-4 w-4"/> Features</TabsTrigger>
                <TabsTrigger value="maintenance"><Construction className="mr-2 h-4 w-4"/> Maintenance</TabsTrigger>
              </TabsList>
              <TabsContent value="theme" className="mt-6">
                <Card className="p-4">
                  <CardTitle className="text-lg font-semibold mb-3">Branding & Theme</CardTitle>
                  <CardDescription className="mb-4">Live-preview theme color changes for light and dark modes.</CardDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorSliderGroup mode="lightTheme" nameEn="Light Mode" nameHi="लाइट मोड"/>
                    <ColorSliderGroup mode="darkTheme" nameEn="Dark Mode" nameHi="डार्क मोड"/>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="features" className="mt-6">
                 <Card className="p-4">
                    <CardTitle className="text-lg font-semibold mb-3">Feature Flags</CardTitle>
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
              </TabsContent>
              <TabsContent value="maintenance" className="mt-6">
                  <Card className="p-4 border-destructive/50">
                    <CardTitle className="text-lg font-semibold mb-3 text-destructive">Maintenance Mode</CardTitle>
                    <CardDescription className="mb-4">Puts the entire application into maintenance mode for all non-admin users.</CardDescription>
                    <div className="flex items-center justify-between rounded-md border p-3 bg-destructive/10">
                        <Label htmlFor="maintenance-mode" className="font-medium">Enable Maintenance Mode</Label>
                        <Switch id="maintenance-mode" checked={settings.maintenanceMode} onCheckedChange={handleMaintenanceToggle} />
                    </div>
                </Card>
              </TabsContent>
            </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
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