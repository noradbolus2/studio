
"use client"; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Settings, LogOut, UserCircle2, Edit, Mail, Phone, School, CalendarDays, Users, TargetIcon, MapPin, Settings2, Bell, Link2, History, Receipt, Video, PackageSearch, IndianRupee, BarChart3, Trophy, LifeBuoy, ArrowRight, Info, ClipboardList, BookCheck } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import Link from "next/link";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast'; 
import { format } from "date-fns";
import type { ProfileFormData } from '../edit-profile/page'; // Import the type
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// UserProfile interface now mirrors ProfileFormData for easier mapping, with display-specific transformations done in JSX
interface UserProfileDisplay extends Omit<ProfileFormData, 'dateOfBirth'> {
  initials?: string;
  dateOfBirth?: string; // For display
  dataAiHint?: string; // Added for avatar hint
}


interface OrderHistoryItem {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  total: number;
  itemCount: number;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Success' | 'Failed' | 'Pending';
}

interface ClassHistoryItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score?: string; 
  avatarUrl?: string;
  dataAiHint?: string;
  category?: string; 
  isCurrentUser?: boolean;
}

const mockOrderHistory: OrderHistoryItem[] = [
  { id: "ORD12345", date: "2024-07-15", status: "Delivered", total: 245.00, itemCount: 3 },
  { id: "ORD67890", date: "2024-07-10", status: "Shipped", total: 75.00, itemCount: 1 },
  { id: "ORD24680", date: "2024-07-05", status: "Cancelled", total: 150.00, itemCount: 2 },
];

const mockPaymentHistory: PaymentHistoryItem[] = [
  { id: "PAY78901", date: "2024-07-15", amount: 245.00, method: "UPI", status: "Success" },
  { id: "PAY12345", date: "2024-07-10", amount: 75.00, method: "Credit Card", status: "Success" },
  { id: "PAY54321", date: "2024-07-02", amount: 99.00, method: "Netbanking", status: "Failed" },
];

const mockClassHistory: ClassHistoryItem[] = [
  { id: "CLS101", title: "Algebra Basics", subject: "Mathematics", date: "2024-07-12", time: "10:00 AM", duration: "1 hr" },
  { id: "CLS102", title: "Introduction to Physics", subject: "Physics", date: "2024-07-09", time: "02:00 PM", duration: "45 mins" },
];

const mockLeaderboards: Record<string, LeaderboardEntry[]> = {
  class: [
    { rank: 1, name: "Anika Singh", score: "98.5%", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student girl avatar", category: "Class 11 Science" },
    { rank: 2, name: "Rohan Desai", score: "97.8%", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student male avatar", category: "Class 11 Science" },
    { rank: 3, name: "Aisha Khan", score: "97.2%", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student girl avatar", category: "Class 11 Science" },
  ],
  board: [
    { rank: 1, name: "Vidya Iyer", score: "99.2% (CBSE)", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student girl avatar", category: "All India CBSE" },
    { rank: 2, name: "Arjun Mehta", score: "98.9% (ICSE)", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student boy avatar", category: "All India ICSE" },
    { rank: 3, name: "Suresh Patil", score: "98.5% (Maharashtra State)", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student male avatar", category: "State Topper" },
  ],
  exam: [
    { rank: 1, name: "Priya Sharma", score: "710/720", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student female avatar", category: "NEET UG - All India" },
    { rank: 2, name: "Rohan Mehra", score: "AIR 25", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student male avatar", category: "JEE Advanced" },
    { rank: 450, name: "Aarav Sharma (You)", score: "650/720", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student boy avatar", category: "NEET UG - All India", isCurrentUser: true },
  ],
  combined: [
    { rank: 1, name: "Aisha Khan", score: "9982", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student girl avatar", category: "School + Board + Exam" },
    { rank: 2, name: "Priya Sharma", score: "9950", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student female avatar", category: "School + Board + Exam" },
    { rank: 350, name: "Aarav Sharma (You)", score: "8500", avatarUrl: "https://placehold.co/40x40.png", dataAiHint: "student boy avatar", category: "School + Board + Exam", isCurrentUser: true },
  ],
};



export default function ProfilePage() {
  const [user, setUser] = useState<UserProfileDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 
  const { toast } = useToast(); 

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); 

      let profileToDisplay: UserProfileDisplay;
      let loggedInUserEmail: string | null = null;
      let loggedInUserFullName: string | null = null;


      if (typeof window !== "undefined") {
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            const loggedInUserDetails = JSON.parse(loggedInUserString);
            loggedInUserEmail = loggedInUserDetails.email;
            loggedInUserFullName = loggedInUserDetails.fullName; // Get full name
        }

        const storedProfileString = localStorage.getItem('userProfileData');
        if (storedProfileString) {
          try {
            const storedProfile = JSON.parse(storedProfileString) as ProfileFormData & { dateOfBirth?: string; dataAiHint?: string }; 
            
            // Ensure the loaded profile matches the logged-in user's email if available
            if (loggedInUserEmail && storedProfile.email !== loggedInUserEmail) {
                 console.warn("Profile data in localStorage does not match logged-in user. Clearing stale profile.");
                 localStorage.removeItem('userProfileData');
                 profileToDisplay = getMockUser(loggedInUserEmail, loggedInUserFullName); 
            } else {
                profileToDisplay = {
                ...storedProfile,
                initials: storedProfile.fullName ? storedProfile.fullName.substring(0, 2).toUpperCase() : "NA",
                dateOfBirth: storedProfile.dateOfBirth ? format(new Date(storedProfile.dateOfBirth), "dd MMM yyyy") : undefined,
                dataAiHint: storedProfile.dataAiHint || "student avatar",
                };
            }
          } catch (e) {
            console.error("Failed to parse profile from localStorage, using mock.", e);
            profileToDisplay = getMockUser(loggedInUserEmail, loggedInUserFullName); 
          }
        } else {
          // If no userProfileData, create one based on loggedInUser if it exists
          if (loggedInUserEmail && loggedInUserFullName) {
            profileToDisplay = getMockUser(loggedInUserEmail, loggedInUserFullName);
            localStorage.setItem('userProfileData', JSON.stringify({ // Store basic profile
                fullName: loggedInUserFullName,
                email: loggedInUserEmail,
                avatarUrl: "https://placehold.co/100x100.png", // Default avatar
                dataAiHint: "student avatar",
                country: "India"
            }));
          } else {
            profileToDisplay = getMockUser(null, null); // Fallback to generic mock
          }
        }
      } else {
        profileToDisplay = getMockUser(null, null); 
      }
      
      setUser(profileToDisplay);
      setLoading(false);
    };

    const getMockUser = (email?: string | null, fullName?: string | null): UserProfileDisplay => ({
      fullName: fullName || "Aarav Sharma",
      email: email || "aarav.sharma@example.com",
      avatarUrl: "https://placehold.co/100x100.png",
      dataAiHint: "student avatar",
      initials: (fullName || "Aarav Sharma").substring(0, 2).toUpperCase(),
      phoneNumber: "+91 98765 43210",
      schoolName: "Demo Public School",
      schoolId: "DPS123XYZ", 
      className: "11",
      board: "CBSE",
      stream: "Science",
      dateOfBirth: format(new Date(2006, 7, 15), "dd MMM yyyy"), 
      gender: "Male",
      examTarget: "JEE, NEET",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
    });

    fetchUserData();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('loggedInUser'); 
        localStorage.removeItem('userProfileData'); 
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login'); // Redirect to the new role selection page
  };

  const getOrderStatusBadge = (status: OrderHistoryItem['status']) => {
    switch(status) {
        case 'Delivered': return <Badge variant="default" className="bg-green-500 text-white">{status}</Badge>;
        case 'Shipped': return <Badge variant="secondary" className="bg-blue-500 text-white">{status}</Badge>;
        case 'Processing': return <Badge variant="outline" className="bg-yellow-500 text-white">{status}</Badge>;
        case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: PaymentHistoryItem['status']) => {
    switch(status) {
        case 'Success': return <Badge variant="default" className="bg-green-500 text-white">{status}</Badge>;
        case 'Failed': return <Badge variant="destructive">{status}</Badge>;
        case 'Pending': return <Badge variant="outline" className="bg-yellow-500 text-white">{status}</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

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
    { icon: School, labelEn: "School ID", labelHi: "स्कूल आईडी", value: user.schoolId, condition: !!user.schoolId },
    { icon: UserCircle2, labelEn: "Class", labelHi: "कक्षा", value: user.className ? (user.className.toLowerCase().includes("class") ? user.className : `Class ${user.className}` ): undefined },
    { icon: UserCircle2, labelEn: "Board", labelHi: "बोर्ड", value: user.board },
    { icon: UserCircle2, labelEn: "Stream", labelHi: "स्ट्रीम", value: user.stream, condition: (user.className?.toLowerCase().includes("11") || user.className?.toLowerCase().includes("12")) && !!user.stream },
    { icon: CalendarDays, labelEn: "D.O.B", labelHi: "जन्म तिथि", value: user.dateOfBirth },
    { icon: Users, labelEn: "Gender", labelHi: "लिंग", value: user.gender },
    { icon: TargetIcon, labelEn: "Exam Target", labelHi: "परीक्षा लक्ष्य", value: user.examTarget },
    { icon: MapPin, labelEn: "Location", labelHi: "स्थान", value: `${user.city ? user.city + ', ' : ''}${user.state ? user.state + ', ' : ''}${user.country || ''}`.replace(/,\s*$/, "") },
  ];


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 p-6 flex flex-col items-center text-center space-y-3">
            <Avatar className="h-24 w-24 border-4 border-primary shadow-md">
              <AvatarImage 
                src={user.avatarUrl || `https://placehold.co/100x100.png`} 
                alt={user.fullName || "User Avatar"} 
                data-ai-hint={user.dataAiHint || "student avatar"} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">{user.initials || user.fullName?.substring(0,2).toUpperCase() || "NA"}</AvatarFallback>
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
               if (item.condition === false) return null; 
               if (!item.value && item.condition !== true) return null; 
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
          <CardContent className="p-4">
            <Link href="/student-dashboard" passHref>
              <Button variant="secondary" className="w-full h-auto py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-6 w-6 text-primary"/>
                    <div className="text-left">
                      <p className="font-semibold text-md"><BilingualText en="Student Dashboard" hi="छात्र डैशबोर्ड" /></p>
                      <p className="text-xs text-muted-foreground"><BilingualText en="Your personal learning portfolio & tools." hi="आपका व्यक्तिगत शिक्षण पोर्टफोलियो और उपकरण।" /></p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary"/>
                </div>
              </Button>
            </Link>
          </CardContent>
      </Card>

       <Card>
          <CardContent className="p-4">
            <Link href="/learning-passport" passHref>
              <Button variant="secondary" className="w-full h-auto py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <BookCheck className="h-6 w-6 text-primary"/>
                    <div className="text-left">
                      <p className="font-semibold text-md"><BilingualText en="My OSO Passport" hi="मेरा OSO पासपोर्ट" /></p>
                      <p className="text-xs text-muted-foreground"><BilingualText en="View your academic & cognitive identity." hi="अपनी शैक्षणिक और संज्ञानात्मक पहचान देखें।" /></p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary"/>
                </div>
              </Button>
            </Link>
          </CardContent>
      </Card>


       <Card>
          <CardContent className="p-4">
            <Link href="/switch-school" passHref>
              <Button variant="secondary" className="w-full h-auto py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <School className="h-6 w-6 text-primary"/>
                    <div className="text-left">
                      <p className="font-semibold text-md"><BilingualText en="OSO Campus Switch™" hi="OSO कैंपस स्विच™" /></p>
                      <p className="text-xs text-muted-foreground"><BilingualText en="Digitally apply to a new School/College" hi="डिजिटल रूप से नए स्कूल/कॉलेज में आवेदन करें" /></p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary"/>
                </div>
              </Button>
            </Link>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="text-yellow-500 h-6 w-6" />
            <BilingualText en="All India Rank & Leaderboards" hi="अखिल भारतीय रैंक और लीडरबोर्ड" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Compare your performance with peers across India." hi="पूरे भारत में साथियों के साथ अपने प्रदर्शन की तुलना करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exam" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="class"><BilingualText en="Class" hi="कक्षा"/></TabsTrigger>
              <TabsTrigger value="board"><BilingualText en="Board" hi="बोर्ड"/></TabsTrigger>
              <TabsTrigger value="exam"><BilingualText en="Exam" hi="परीक्षा"/></TabsTrigger>
              <TabsTrigger value="combined"><BilingualText en="Combined" hi="संयुक्त"/></TabsTrigger>
            </TabsList>
            
            {(Object.keys(mockLeaderboards) as (keyof typeof mockLeaderboards)[]).map(key => (
              <TabsContent key={key} value={key} className="mt-4">
                <ul className="space-y-2">
                  {mockLeaderboards[key].map((student) => (
                    <li
                      key={student.rank}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md text-sm",
                        student.isCurrentUser ? "bg-accent/50 border border-accent" : "bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-8 text-center text-lg text-muted-foreground">{student.rank}.</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatarUrl || 'https://placehold.co/40x40.png'} alt={student.name} data-ai-hint={student.dataAiHint || 'student avatar'} />
                          <AvatarFallback>{student.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.category}</p>
                        </div>
                      </div>
                      <Badge variant={student.isCurrentUser ? "default" : "secondary"} className="font-bold text-xs sm:text-sm">
                        {student.score}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      

      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><PackageSearch className="text-primary h-6 w-6"/> <BilingualText en="Order History" hi="ऑर्डर इतिहास" /></CardTitle>
            <CardDescription><BilingualText en="View your past orders and their status." hi="अपने पिछले ऑर्डर और उनकी स्थिति देखें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {mockOrderHistory.length > 0 ? mockOrderHistory.map(order => (
                <Card key={order.id} className="bg-muted/30 p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Order ID: {order.id}</p>
                            <p className="text-xs text-muted-foreground">Date: {order.date} | {order.itemCount} items | Total: INR {order.total.toFixed(2)}</p>
                        </div>
                        {getOrderStatusBadge(order.status)}
                    </div>
                    <Button asChild variant="link" size="sm" className="p-0 h-auto mt-1.5 text-primary">
                        <Link href={`/track-order/${order.id}`}>
                            <BilingualText en="Track Your Order" hi="अपना ऑर्डर ट्रैक करें"/>
                        </Link>
                    </Button>
                </Card>
            )) : (
                <p className="text-muted-foreground text-sm"><BilingualText en="No orders found." hi="कोई ऑर्डर नहीं मिला।" /></p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Receipt className="text-green-500 h-6 w-6"/> <BilingualText en="Payment History" hi="भुगतान इतिहास" /></CardTitle>
            <CardDescription><BilingualText en="Review your past transactions." hi="अपने पिछले लेनदेन की समीक्षा करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {mockPaymentHistory.length > 0 ? mockPaymentHistory.map(payment => (
                <Card key={payment.id} className="bg-muted/30 p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Transaction ID: {payment.id}</p>
                            <p className="text-xs text-muted-foreground">Date: {payment.date} | Method: {payment.method} | Amount: INR {payment.amount.toFixed(2)}</p>
                        </div>
                        {getPaymentStatusBadge(payment.status)}
                    </div>
                </Card>
            )) : (
                <p className="text-muted-foreground text-sm"><BilingualText en="No payment history found." hi="कोई भुगतान इतिहास नहीं मिला।" /></p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Video className="text-accent h-6 w-6"/> <BilingualText en="Class History" hi="कक्षा इतिहास" /></CardTitle>
            <CardDescription><BilingualText en="Your attended live classes and sessions." hi="आपकी उपस्थित लाइव कक्षाएं और सत्र।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {mockClassHistory.length > 0 ? mockClassHistory.map(cls => (
                 <Card key={cls.id} className="bg-muted/30 p-3">
                    <p className="text-sm font-semibold text-foreground">{cls.title} <span className="text-xs text-muted-foreground">({cls.subject})</span></p>
                    <p className="text-xs text-muted-foreground">Date: {cls.date} | Time: {cls.time} | Duration: {cls.duration}</p>
                </Card>
            )) : (
                <p className="text-muted-foreground text-sm"><BilingualText en="No class history found." hi="कोई कक्षा इतिहास नहीं मिला।" /></p>
            )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Award className="text-accent h-6 w-6"/> <BilingualText en="My Achievements" hi="मेरी उपलब्धियां" /></CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm"><BilingualText en="Your badges and certificates will appear here." hi="आपके बैज और प्रमाण पत्र यहां दिखाई देंगे।" /></p>
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
             <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/about">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <BilingualText en="About OSO" hi="OSO के बारे में" />
                </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/help">
                    <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                    <BilingualText en="Help & Support" hi="सहायता और समर्थन" />
                </Link>
            </Button>
        </CardContent>
      </Card>
      
      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-5 w-5" />
        <BilingualText en="Logout" hi="लॉग आउट" />
      </Button>
    </div>
  );
}
