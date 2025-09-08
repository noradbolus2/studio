
// src/app/(app)/vendor-dashboard/queries/page.tsx
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Query {
  id: string;
  customerName: string;
  customerAvatar?: string; // Made optional
  dataAiHint?: string;
  queryText: string;
  date: string;
  status: "New" | "Replied" | "Resolved";
  productName?: string; 
}

// MOCK DATA REMOVED
const mockQueries: Query[] = [];

export default function VendorQueriesPage() {
  const router = useRouter();
  const [queries, setQueries] = useState(mockQueries);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          <BilingualText en="Customer Queries" hi="ग्राहक प्रश्न" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Manage Customer Interactions" hi="ग्राहक इंटरैक्शन प्रबंधित करें" /></CardTitle>
          <CardDescription><BilingualText en="Respond to inquiries and provide support." hi="पूछताछ का जवाब दें और सहायता प्रदान करें।" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {queries.length > 0 ? queries.map(query => (
            <Card key={query.id} className={`p-4 ${query.status === 'New' ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={query.customerAvatar || `https://placehold.co/40x40.png`} 
                    alt={query.customerName} 
                    data-ai-hint={query.dataAiHint || "user avatar"}
                  />
                  <AvatarFallback>{query.customerName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold">{query.customerName}</h4>
                    <Badge variant={query.status === 'New' ? 'default' : query.status === 'Replied' ? 'secondary' : 'outline'} className="text-xs">
                        {query.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{query.date}</p>
                  {query.productName && <p className="text-xs text-muted-foreground">Regarding: <span className="font-medium">{query.productName}</span></p>}
                  <p className="text-sm mt-1.5">{query.queryText}</p>
                </div>
              </div>
              {query.status === 'New' && (
                <div className="mt-3 space-y-2">
                  <Textarea placeholder_en="Type your reply..." placeholder_hi="अपना जवाब लिखें..." className="min-h-[60px] text-sm"/>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Reply className="mr-1.5 h-4 w-4"/> <BilingualText en="Send Reply" hi="जवाब भेजें"/>
                  </Button>
                </div>
              )}
            </Card>
          )) : (
            <p className="text-muted-foreground text-center py-6"><BilingualText en="No customer queries at the moment." hi="फिलहाल कोई ग्राहक प्रश्न नहीं है।" /></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
