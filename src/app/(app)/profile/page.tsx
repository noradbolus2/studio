import { BrainScan } from "@/components/profile/BrainScan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Settings, LogOut, UserCircle2 } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";

export default function ProfilePage() {
  // Placeholder user data
  const user = {
    name: "Aarav Sharma",
    initials: "AS",
    email: "aarav.sharma@example.com",
    avatarUrl: "https://placehold.co/100x100.png"
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10 p-6 flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="student avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-2xl font-headline text-primary">{user.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-4">
            <Button variant="outline" className="w-full justify-start gap-2">
                <UserCircle2 className="h-5 w-5 text-muted-foreground"/>
                <BilingualText en="Edit Profile" hi="प्रोफ़ाइल संपादित करें" />
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="h-5 w-5 text-muted-foreground"/>
                <BilingualText en="App Settings" hi="ऐप सेटिंग्स" />
            </Button>
             <Button variant="outline" className="w-full justify-start gap-2">
                <Award className="h-5 w-5 text-muted-foreground"/>
                <BilingualText en="My Achievements" hi="मेरी उपलब्धियां" />
            </Button>
        </CardContent>
      </Card>

      <BrainScan />
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline"><BilingualText en="Achievements" hi="उपलब्धियां" /></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground"><BilingualText en="Your badges and certificates will appear here." hi="आपके बैज और प्रमाण पत्र यहां दिखाई देंगे।" /></p>
            {/* Placeholder for achievements list */}
        </CardContent>
      </Card>
      
      <Button variant="destructive" className="w-full">
        <LogOut className="mr-2 h-5 w-5" />
        <BilingualText en="Logout" hi="लॉग आउट" />
      </Button>
    </div>
  );
}
