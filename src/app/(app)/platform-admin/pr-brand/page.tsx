// src/app/(app)/platform-admin/pr-brand/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Newspaper, Star, MessageSquare, Video, User } from "lucide-react";
import { useRouter } from "next/navigation";

const socialSentimentData = {
  score: "8.7/10",
  positiveMentions: 1250,
  negativeMentions: 150,
};

const flaggedReviews = [
  { id: 1, source: "Play Store", rating: 1, comment: "App crashes on startup. Can't even log in." },
  { id: 2, source: "App Store", rating: 2, comment: "Delivery was late and items were missing." },
];

const newsMentions = [
    { id: 1, source: "TechCrunch", headline: "OSO App raises seed round to revolutionize student tech in India." },
    { id: 2, source: "The Economic Times", headline: "New ed-tech platform OSO integrates hyperlocal delivery for students." },
]

export default function PrBrandPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Newspaper className="h-7 w-7 text-primary" />
          <BilingualText en="PR & Brand Reputation" hi="पीआर और ब्रांड प्रतिष्ठा" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare/> Social Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-green-500">{socialSentimentData.score}</p>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                <div className="text-xs mt-2">
                    <p>Positive mentions: {socialSentimentData.positiveMentions}</p>
                    <p>Negative mentions: {socialSentimentData.negativeMentions}</p>
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star/> Flagged App Reviews</CardTitle>
                <CardDescription>Negative reviews that need attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {flaggedReviews.map(review => (
                    <div key={review.id} className="p-2 border rounded-md bg-muted/50">
                        <div className="flex items-center gap-1">
                            {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
                            {Array(5-review.rating).fill(0).map((_,i) => <Star key={i} size={12} className="text-muted-foreground/30"/>)}
                            <span className="text-xs ml-1 font-semibold">{review.source}</span>
                        </div>
                        <p className="text-xs italic mt-1">"{review.comment}"</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
      
       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Newspaper/> News & Media Mentions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                 {newsMentions.map(mention => (
                    <div key={mention.id} className="p-3 border rounded-md">
                        <p className="font-semibold text-sm">{mention.headline}</p>
                        <p className="text-xs text-muted-foreground">Source: {mention.source}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User/> Founder Quotes Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        This section would display mentions of the founder's name or key leadership from news articles and social media.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Video/> Viral Video Watch</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground text-sm">
                        This section would show the top 3 performing OSO-related videos or reels from platforms like Instagram, YouTube, etc.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
