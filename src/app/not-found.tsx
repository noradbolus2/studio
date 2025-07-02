"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { BrainCircuit, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="items-center pb-4">
            <BrainCircuit className="w-24 h-24 text-primary mb-4" strokeWidth={1} />
            <CardTitle className="text-5xl font-bold text-primary font-headline">
                <BilingualText en="404" hi="४०४" />
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
                <BilingualText en="Lost in the Digital Cosmos?" hi="डिजिटल ब्रह्मांड में खो गए?" />
            </h2>
            <CardDescription className="text-muted-foreground max-w-md mx-auto">
                <BilingualText 
                en="It seems this page doesn't exist. Let our AI guide you back to a known galaxy." 
                hi="ऐसा लगता है कि यह पृष्ठ मौजूद नहीं है। हमारे एआई को आपको एक ज्ञात आकाशगंगा में वापस मार्गदर्शन करने दें।" 
                />
            </CardDescription>
            <div className="pt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    <BilingualText en="Go to Homepage" hi="मुखपृष्ठ पर जाएं" />
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
