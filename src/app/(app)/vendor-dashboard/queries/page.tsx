
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

interface Query {
  id: string;
  customerName: string;
  customerAvatar: string;
  dataAiHint?: string;
  queryText: string;
  date: string;
  status: "New" | "Replied" | "Resolved";
  productName?: string; // Optional product name related to query
}

const mockQueries: Query[] = [
  { id: "Q001", customerName: "Aarav Sharma", customerAvatar: "https://placehold.co/40x40.png?text=AS", dataAiHint:"student avatar", queryText: "Is the Classmate notebook available in unruled format?", date: "2024-07-22 02:15 PM", status: "New", productName: "Classmate Notebook" },
  { id: "Q002", customerName: "Priya Singh", customerAvatar: "https://placehold.co/40x40.png?text=PS", dataAiHint:"girl avatar", queryText: "When will the Fevicol MR 100g be back in stock?", date: "2024-07-21 09:00 AM", status: "Replied", productName: "Fevicol MR Squeeze Bottle (100g)" },
  { id: "Q003", customerName: "Rohan Verma", customerAvatar: "https://placehold.co/40x40.png?text=RV", dataAiHint:"boy avatar", queryText: "Can I get a bulk discount on Apsara pencils for my class?", date: "2024-07-20 03:30 PM", status: "Resolved" },
];

export default function VendorQueriesPage() {
  const router = useRouter();

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
          {mockQueries.length > 0 ? mockQueries.map(query => (
            <Card key={query.id} className={`p-4 ${query.status === 'New' ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={query.customerAvatar} alt={query.customerName} data-ai-hint={query.dataAiHint || "user avatar"}/>
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
