// src/app/(app)/platform-admin/pr-brand/page.tsx
"use client";

import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Newspaper, Star, MessageSquare, Video, User, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getPrBrandReputationData, type PrBrandReputationOutput } from "@/ai/flows/pr-brand-reputation-flow";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function PrBrandPage() {
  const router = useRouter();
  const [data, setData] = useState<PrBrandReputationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await getPrBrandReputationData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch PR data:", error);
      toast({
        title: "Error",
        description: "Could not fetch PR & Brand data from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Newspaper className="h-7 w-7 text-primary" />
          <BilingualText en="PR & Brand Reputation" hi="पीआर और ब्रांड प्रतिष्ठा" />
        </h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchData} disabled={isLoading} className="h-8 w-8">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={() => router.push('/platform-admin')} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
            </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
            <LoadingSpinner size={48}/>
            <p className="ml-3 text-muted-foreground">Fetching latest brand data...</p>
        </div>
      ) : !data ? (
         <Card className="text-center py-10">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-semibold">Failed to load data.</p>
              <p className="text-sm text-muted-foreground mt-1">Please try refreshing the data.</p>
            </CardContent>
          </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare/> Social Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-green-500">{data.socialSentiment.score}</p>
                    <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                    <div className="text-xs mt-2">
                        <p>Positive mentions: {data.socialSentiment.positiveMentions}</p>
                        <p>Negative mentions: {data.socialSentiment.negativeMentions}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star/> Flagged App Reviews</CardTitle>
                    <CardDescription>Negative reviews that need attention.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.flaggedReviews.map(review => (
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
                     {data.newsMentions.map(mention => (
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
                    <CardContent className="space-y-2">
                        {data.founderQuotes.map(item => (
                            <blockquote key={item.id} className="text-sm border-l-2 pl-3 italic">
                                "{item.quote}"
                                <footer className="text-xs not-italic text-muted-foreground mt-1">- via {item.source}</footer>
                            </blockquote>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Video/> Viral Video Watch</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data.viralVideos.map(item => (
                             <div key={item.id} className="p-2 border rounded-md">
                                <p className="font-semibold text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.platform} - {item.views} views</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
      )}
    </div>
  );
}
