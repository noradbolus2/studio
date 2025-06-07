
"use client"; // For useRouter and mock data state

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Settings, LogOut, UserCircle2, Edit, Mail, Phone, School, CalendarDays, Users, TargetIcon, MapPin, Settings2, Bell, Link2 } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import Link from "next/link";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Mock user data structure
interface UserProfile {
  fullName: string;
  email: string;
  avatarUrl?: string;
  initials?: string;
  phoneNumber?: string;
  schoolName?: string;
  schoolId?: string;
  className?: string;
  board?: string;
  stream?: string;
  dateOfBirth?: string; // Store as string for display
  gender?: string;
  examTarget?: string;
  city?: string;
  state?: string;
  country?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      // In a real app, fetch from Firestore or your backend
      const mockUser: UserProfile = {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        avatarUrl: "https://placehold.co/100x100.png",
        initials: "AS",
        phoneNumber: "+91 98765 43210",
        schoolName: "Demo Public School",
        schoolId: "DPS123XYZ", // Example if school login
        className: "11",
        board: "CBSE",
        stream: "Science",
        dateOfBirth: "15 Aug 2006",
        gender: "Male",
        examTarget: "JEE, NEET",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
      };
      setUser(mockUser);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }
  
  const profileItems = [
    { icon: Mail, labelEn: "Email", labelHi: "ईमेल", value: user.email },
    { icon: Phone, labelEn: "Phone", labelHi: "फ़ोन", value: user.phoneNumber },
    { icon: School, labelEn: "School", labelHi: "स्कूल", value: user.schoolName },
    { icon: School, labelEn: "School ID", labelHi: "स्कूल आईडी", value: user.schoolId, condition: !!user.schoolId }, // Conditional
    { icon: UserCircle2, labelEn: "Class", labelHi: "कक्षा", value: user.className ? `Class ${user.className}` : undefined },
    { icon: UserCircle2, labelEn: "Board", labelHi: "बोर्ड", value: user.board },
    { icon: UserCircle2, labelEn: "Stream", labelHi: "स्ट्रीम", value: user.stream, condition: (user.className === "11" || user.className === "12") && !!user.stream },
    { icon: CalendarDays, labelEn: "D.O.B", labelHi: "जन्म तिथि", value: user.dateOfBirth },
    { icon: Users, labelEn: "Gender", labelHi: "लिंग", value: user.gender },
    { icon: TargetIcon, labelEn: "Exam Target", labelHi: "परीक्षा लक्ष्य", value: user.examTarget },
    { icon: MapPin, labelEn: "Location", labelHi: "स्थान", value: `${user.city ? user.city + ', ' : ''}${user.state ? user.state + ', ' : ''}${user.country}` },
  ];


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 p-6 flex flex-col items-center text-center space-y-3">
            <Avatar className="h-24 w-24 border-4 border-primary shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} data-ai-hint="student avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">{user.initials || user.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-2xl font-headline text-primary">{user.fullName}</CardTitle>
                <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/edit-profile">
                    <Edit className="mr-2 h-4 w-4"/>
                    <BilingualText en="Edit Profile" hi="प्रोफ़ाइल संपादित करें" />
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            {profileItems.map((item, index) => {
               if (item.condition === false) return null; // Skip if condition is explicitly false
               if (!item.value && item.condition !== true) return null; // Skip if no value and condition not explicitly true
               return (
                  <div key={index} className="flex items-start text-sm">
                    <item.icon className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 shrink-0" />
                    <div className="flex-grow">
                      <span className="font-medium"><BilingualText en={item.labelEn} hi={item.labelHi} />:</span>
                      <span className="ml-1 text-foreground">{item.value}</span>
                    </div>
                  </div>
               );
            })}
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Award className="text-accent h-6 w-6"/> <BilingualText en="My Achievements" hi="मेरी उपलब्धियां" /></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm"><BilingualText en="Your badges and certificates will appear here." hi="आपके बैज और प्रमाण पत्र यहां दिखाई देंगे।" /></p>
            {/* Placeholder for achievements list */}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Settings className="text-primary h-6 w-6"/> <BilingualText en="Settings & Preferences" hi="सेटिंग्स और प्राथमिकताएं" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/settings/app">
                    <Settings2 className="h-5 w-5 text-muted-foreground" />
                    <BilingualText en="App Settings" hi="ऐप सेटिंग्स" />
                </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/settings/notifications">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <BilingualText en="Notification Preferences" hi="अधिसूचना प्राथमिकताएं" />
                </Link>
            </Button>
             <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/settings/accounts">
                    <Link2 className="h-5 w-5 text-muted-foreground" />
                    <BilingualText en="Manage Linked Accounts" hi="जुड़े हुए खाते प्रबंधित करें" />
                </Link>
            </Button>
        </CardContent>
      </Card>
      
      <Button variant="destructive" className="w-full">
        <LogOut className="mr-2 h-5 w-5" />
        <BilingualText en="Logout" hi="लॉग आउट" />
      </Button>
    </div>
  );
}

    