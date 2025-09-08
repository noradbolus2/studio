
"use client";

import { useState } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, FileCog, ThumbsUp, ThumbsDown, User, Layers, Tag, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ModerationItem {
  id: string;
  type: 'Course' | 'Project' | 'Comment';
  title: string;
  author: string;
  submittedDate: string;
  contentSnippet: string;
}

const mockModerationQueue: ModerationItem[] = [];


export default function ContentModerationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [queue, setQueue] = useState<ModerationItem[]>(mockModerationQueue);

  const handleDecision = (itemId: string, decision: "Approved" | "Rejected") => {
    const item = queue.find(i => i.id === itemId);
    if (!item) return;

    setQueue(prev => prev.filter(i => i.id !== itemId));
    toast({
      title: `Content ${decision}`,
      description: `"${item.title}" by ${item.author} has been ${decision.toLowerCase()}.`,
      variant: decision === 'Rejected' ? 'destructive' : 'default'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileCog className="h-7 w-7 text-primary" />
          <BilingualText en="Content Moderation" hi="सामग्री मॉडरेशन" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Review Queue" hi="समीक्षा कतार" /></CardTitle>
          <CardDescription><BilingualText en="Review and manage user-generated content, courses, and projects." hi="उपयोगकर्ता-जनित सामग्री, पाठ्यक्रम और परियोजनाओं की समीक्षा और प्रबंधन करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {queue.length > 0 ? queue.map(item => (
                <Card key={item.id} className="bg-muted/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                           <CardTitle className="text-md">{item.title}</CardTitle>
                           <Badge variant="secondary">{item.type}</Badge>
                        </div>
                        <CardDescription className="text-xs">By: {item.author} | Submitted: {item.submittedDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <p className="text-sm italic">"{item.contentSnippet}"</p>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end border-t pt-3">
                        <Button variant="destructive" size="sm" onClick={() => handleDecision(item.id, 'Rejected')}>
                            <ThumbsDown className="mr-1.5 h-4 w-4"/> Reject
                        </Button>
                        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleDecision(item.id, 'Approved')}>
                           <ThumbsUp className="mr-1.5 h-4 w-4"/> Approve
                        </Button>
                    </CardFooter>
                </Card>
            )) : (
                <div className="text-center py-10">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-muted-foreground"><BilingualText en="The moderation queue is empty. Well done!" hi="मॉडरेशन कतार खाली है। बहुत बढ़िया!"/></p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
