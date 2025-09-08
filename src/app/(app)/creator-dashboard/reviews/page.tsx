
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, ThumbsUp, FileText, Video, TestTube2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface Review {
  id: string;
  studentName: string;
  avatarUrl?: string;
  dataAiHint?: string;
  rating: number;
  comment: string;
  category: 'Lecture' | 'Notes' | 'Quiz' | 'Test Series';
  contentTitle: string;
  date: string;
}

const mockReviews: Review[] = [];


export default function ReviewsPage() {
  const router = useRouter();
  const [reviews] = useState<Review[]>(mockReviews);


  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
          <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                  <AvatarImage src={review.avatarUrl} alt={review.studentName} data-ai-hint={review.dataAiHint}/>
                  <AvatarFallback>{review.studentName.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{review.studentName}</p>
                      <p className="text-xs text-muted-foreground">on "{review.contentTitle}"</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {Array(review.rating).fill(0).map((_,i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400"/>)}
                        {Array(5-review.rating).fill(0).map((_,i) => <Star key={i} size={14} className="text-muted-foreground/30"/>)}
                    </div>
                  </div>
                  <p className="text-sm italic mt-2 p-2 bg-background rounded-md border">"{review.comment}"</p>
              </div>
          </div>
      </CardContent>
    </Card>
  );
  
  const renderReviews = (category: Review['category'] | 'all') => {
      const filtered = category === 'all' ? reviews : reviews.filter(r => r.category === category);
      if (filtered.length === 0) {
          return (
              <div className="text-center py-10 text-muted-foreground">
                  <p>No reviews in this category yet.</p>
              </div>
          );
      }
      return (
          <div className="space-y-3">
              {filtered.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
      );
  };

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
                <p className="text-2xl font-bold">4.8 ⭐</p>
                <p className="text-xs text-muted-foreground">Overall Rating</p>
            </div>
             <div>
                <p className="text-2xl font-bold">Lectures</p>
                <p className="text-xs text-muted-foreground">Top Category</p>
            </div>
            <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-muted-foreground">Positive Feedback</p>
            </div>
            <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-xs text-muted-foreground">Reviews this month</p>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Lecture"><Video className="mr-2 h-4 w-4"/> Lectures</TabsTrigger>
            <TabsTrigger value="Notes"><FileText className="mr-2 h-4 w-4"/> Notes</TabsTrigger>
            <TabsTrigger value="Quiz"><TestTube2 className="mr-2 h-4 w-4"/> Quizzes</TabsTrigger>
            <TabsTrigger value="Test Series"><Target className="mr-2 h-4 w-4"/> Test Series</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
            {renderReviews('all')}
        </TabsContent>
        <TabsContent value="Lecture" className="mt-4">
            {renderReviews('Lecture')}
        </TabsContent>
        <TabsContent value="Notes" className="mt-4">
            {renderReviews('Notes')}
        </TabsContent>
        <TabsContent value="Quiz" className="mt-4">
            {renderReviews('Quiz')}
        </TabsContent>
        <TabsContent value="Test Series" className="mt-4">
            {renderReviews('Test Series')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
