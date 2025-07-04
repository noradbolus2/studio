
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, ClipboardList, Zap, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

const recentReviews = [
    { id: 1, text: "Best test set ever!", rating: 5, category: "MCQ Creation" },
    { id: 2, text: "Voiceover quality top-notch.", rating: 4, category: "Voiceover" },
    { id: 3, text: "Loved the diagrams in your notes!", rating: 5, category: "Flashcards" },
];

export default function ReviewsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Star className="h-7 w-7 text-primary" />
          <BilingualText en="Ratings & Reviews" hi="रेटिंग और समीक्षाएं" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold">4.9 ⭐</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
            </div>
             <div>
                <p className="text-2xl font-bold">Flashcards</p>
                <p className="text-xs text-muted-foreground">Top Category</p>
            </div>
            <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground">On-time Submission</p>
            </div>
            <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Reviews this month</p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReviews.map(review => (
             <div key={review.id} className="p-3 border rounded-md bg-muted/50">
                <div className="flex items-center justify-between">
                    <p className="italic">"{review.text}"</p>
                    <div className="flex items-center gap-1">
                        {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
                        {Array(5-review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-muted-foreground/30"/>)}
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Category: {review.category}</p>
             </div>
          ))}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Want more work?</CardTitle>
          <CardDescription>Explore opportunities to take on new tasks.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" className="w-full justify-start gap-2"><ClipboardList className="h-4 w-4"/> Explore Open Tasks</Button>
            <Button variant="secondary" className="w-full justify-start gap-2"><Zap className="h-4 w-4"/> Try AI Task Ideas</Button>
            <Button variant="secondary" className="w-full justify-start gap-2"><Rocket className="h-4 w-4"/> Add New Skill Role</Button>
        </CardContent>
      </Card>
    </div>
  );
}
