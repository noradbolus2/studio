// src/app/(app)/coaching-panel/earnings/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, IndianRupee, BookOpen, Percent, Trophy, Upload, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const earningsData = {
    earningsThisMonth: 41320,
    activePaidCourses: 3,
    activeFreeCourses: 1,
    osoCommission: 10,
    bonusAlert: {
        amount: 500,
        reason: "High-Rated Course of June"
    }
};

export default function EarningsPayoutPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleRequestPayout = () => {
        toast({
            title: "Payout Requested",
            description: `A payout request for INR ${earningsData.earningsThisMonth.toLocaleString()} has been submitted.`
        });
    };

    const handleViewLedger = () => {
        toast({
            title: "Feature Coming Soon",
            description: "The full ledger view is under development."
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                    <IndianRupee className="h-7 w-7 text-primary" />
                    <BilingualText en="Earnings & Payouts" hi="कमाई और भुगतान" />
                </h1>
                <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle><BilingualText en="Monthly Summary" hi="मासिक सारांश" /></CardTitle>
                    <CardDescription><BilingualText en="Your earnings and course stats for this month." hi="इस महीने के लिए आपकी कमाई और कोर्स के आँकड़े।" /></CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <IndianRupee className="h-6 w-6 mx-auto text-green-500 mb-2"/>
                        <p className="text-2xl font-bold">INR {earningsData.earningsThisMonth.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground"><BilingualText en="This Month" hi="इस महीने"/></p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <BookOpen className="h-6 w-6 mx-auto text-blue-500 mb-2"/>
                        <p className="text-2xl font-bold">{earningsData.activePaidCourses} Paid / {earningsData.activeFreeCourses} Free</p>
                        <p className="text-sm text-muted-foreground"><BilingualText en="Active Courses" hi="सक्रिय कोर्स"/></p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <Percent className="h-6 w-6 mx-auto text-red-500 mb-2"/>
                        <p className="text-2xl font-bold">{earningsData.osoCommission}%</p>
                        <p className="text-sm text-muted-foreground"><BilingualText en="OSO Commission" hi="OSO कमीशन"/></p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-yellow-400/20 border-yellow-500/30">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500"/>
                    <div>
                        <CardTitle className="text-yellow-600 font-headline"><BilingualText en="Bonus Alert!" hi="बोनस अलर्ट!"/></CardTitle>
                        <CardDescription className="text-yellow-700/80">
                           <BilingualText en={`Congratulations! You've earned a bonus of INR ${earningsData.bonusAlert.amount} for: ${earningsData.bonusAlert.reason}.`} hi={`बधाई हो! आपने INR ${earningsData.bonusAlert.amount} का बोनस अर्जित किया है: ${earningsData.bonusAlert.reason}।`}/>
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle><BilingualText en="Actions" hi="कार्रवाइयां"/></CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleRequestPayout}>
                        <Upload className="mr-2"/>
                        <BilingualText en="Request Payout to UPI" hi="UPI में भुगतान का अनुरोध करें"/>
                    </Button>
                    <Button size="lg" variant="secondary" onClick={handleViewLedger}>
                        <FileText className="mr-2"/>
                        <BilingualText en="View Full Ledger" hi="पूरी लेजर देखें"/>
                    </Button>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full"><BilingualText en="Payouts are processed every Monday & Thursday." hi="भुगतान हर सोमवार और गुरुवार को संसाधित किए जाते हैं।"/></p>
                </CardFooter>
            </Card>
        </div>
    );
}
