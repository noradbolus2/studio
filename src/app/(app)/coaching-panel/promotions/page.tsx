
// src/app/(app)/coaching-panel/promotions/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BadgePercent, PlusCircle, Edit, Trash2, Gift, Tag, Star, Share2, Timer, Image as ImageIcon, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { GeneratePosterDialog } from "@/components/coaching/GeneratePosterDialog";

interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  course: string;
}

const mockReviews: Review[] = [
  { id: "R1", studentName: "Anika S.", rating: 5, comment: "This course was amazing! Helped me clear all my concepts for NEET.", course: "NEET Chemistry 2025" },
  { id: "R2", studentName: "Rohan V.", rating: 4, comment: "Good content, but would love more practice problems.", course: "JEE Physics 2025" },
];

export default function PromotionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPosterDialogOpen, setIsPosterDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <BadgePercent className="h-7 w-7 text-primary" />
            <BilingualText en="Course Promotions" hi="कोर्स प्रचार" />
          </h1>
          <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Share2/> Share & Promote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsPosterDialogOpen(true)}>
                      <ImageIcon className="h-5 w-5"/> Generate Course Poster
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast({title: "Coming Soon!", description: "WhatsApp share link copied to clipboard."})}>
                      <MessageSquare className="h-5 w-5 text-green-500"/> Share on WhatsApp
                  </Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Tag/> Referral Program</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Your Referral Code:</p>
                  <p className="text-2xl font-bold font-mono p-2 bg-muted rounded-md tracking-widest">TEACH100</p>
                  <p className="text-xs text-muted-foreground mt-1">Share this code to give students ₹100 off.</p>
              </CardContent>
            </Card>
        </div>

         <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Timer/> Limited-Time Offers</CardTitle>
              <CardDescription>Create urgency by setting a discount timer on your courses.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-center text-muted-foreground">[Feature to create timed discounts will be here]</p>
          </CardContent>
          <CardFooter>
              <Button variant="secondary"><PlusCircle className="mr-2 h-4 w-4"/> Create New Offer</Button>
          </CardFooter>
        </Card>
        
         <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star/> Student Ratings & Reviews</CardTitle>
              <CardDescription>View feedback from your enrolled students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
              {mockReviews.map(review => (
                  <div key={review.id} className="p-3 border rounded-md bg-muted/50">
                      <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{review.studentName} on <span className="text-primary">{review.course}</span></span>
                          <div className="flex items-center gap-1">
                              {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
                              {Array(5-review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-muted-foreground/30"/>)}
                          </div>
                      </div>
                      <p className="text-xs italic mt-1">"{review.comment}"</p>
                  </div>
              ))}
          </CardContent>
        </Card>

      </div>
      <GeneratePosterDialog isOpen={isPosterDialogOpen} onOpenChange={setIsPosterDialogOpen} />
    </>
  );
}
