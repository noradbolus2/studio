
// src/app/(app)/student-dashboard/page.tsx
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { School, BookOpen, MessageSquare, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <School className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-headline text-primary">
          <BilingualText en="Student Dashboard" hi="छात्र डैशबोर्ड" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Welcome, Student! Access your learning tools here." hi="आपका स्वागत है, छात्र! अपने शिक्षण उपकरण यहाँ एक्सेस करें।" />
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpen className="text-accent h-6 w-6" />
              <BilingualText en="Latest Books" hi="नवीनतम पुस्तकें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Explore new arrivals and recommended reads." hi="नए आगमन और अनुशंसित पुस्तकें देखें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for book carousels or featured books]" hi="[पुस्तक हिंडोला या विशेष रुप से प्रदर्शित पुस्तकों के लिए प्लेसहोल्डर]" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/class-6-12-books">
                <BilingualText en="Browse Books" hi="पुस्तकें ब्राउज़ करें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MessageSquare className="text-primary h-6 w-6" />
              <BilingualText en="Ask Guruji" hi="गुरुजी से पूछें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Get your doubts cleared by our AI assistant." hi="हमारे एआई सहायक से अपनी शंकाओं का समाधान पाएं।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for quick access to AI Guruji chat]" hi="[एआई गुरुजी चैट तक त्वरित पहुंच के लिए प्लेसहोल्डर]" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/ai-guruji">
                <BilingualText en="Chat with Guruji" hi="गुरुजी से चैट करें" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ShoppingCart className="text-green-500 h-6 w-6" />
              <BilingualText en="Order Now" hi="अभी आर्डर करें" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Get stationery and supplies delivered quickly." hi="स्टेशनरी और आपूर्ति शीघ्रता से प्राप्त करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-sm">
                <BilingualText en="[Placeholder for quick order links or featured items]" hi="[त्वरित ऑर्डर लिंक या विशेष रुप से प्रदर्शित वस्तुओं के लिए प्लेसहोल्डर]" />
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/delivery">
                <BilingualText en="Go to Delivery" hi="डिलीवरी पर जाएं" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
