import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ListChecks, BookCopy, Users } from "lucide-react";
import { MotivationalQuoteCard } from "@/components/shared/MotivationalQuoteCard";
import { BilingualText } from "@/components/shared/BilingualText";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
            <BilingualText en="Welcome to OSO!" hi="OSO में आपका स्वागत है!" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en="Your daily learning and delivery hub." hi="आपका दैनिक अध्ययन और डिलीवरी केंद्र।" />
        </p>
      </header>

      <MotivationalQuoteCard />

      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">
            <BilingualText en="Quick Actions" hi="त्वरित कार्रवाई" />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <BilingualText en="Start Studying" hi="पढ़ाई शुरू करें" />
              </CardTitle>
              <BookCopy className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <BilingualText en="Go to Study" hi="अध्ययन पर जाएं" />
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <BilingualText en="Order Supplies" hi="सामान ऑर्डर करें" />
              </CardTitle>
              <Zap className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
               <Button variant="outline" size="sm" className="w-full">
                <BilingualText en="Shop Now" hi="अभी खरीदें" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">
            <BilingualText en="Pending Tasks" hi="लंबित कार्य" />
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <ListChecks className="h-6 w-6" />
              <p><BilingualText en="No pending tasks for today. Great job!" hi="आज के लिए कोई लंबित कार्य नहीं। बहुत बढ़िया!" /></p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">
            <BilingualText en="Daily Updates" hi="दैनिक अपडेट" />
        </h2>
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            <p><BilingualText en="New chapter on 'AI Basics' added to your Coding course." hi="आपके कोडिंग कोर्स में 'एआई बेसिक्स' पर नया अध्याय जोड़ा गया।" /></p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
