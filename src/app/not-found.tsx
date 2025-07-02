"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { FileQuestion, Home } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="items-center pb-4">
            <FileQuestion className="w-24 h-24 text-primary mb-4" strokeWidth={1} />
            <h1 className="text-5xl font-bold text-primary font-headline">
                <BilingualText en="404" hi="४०४" />
            </h1>
        </CardHeader>
        <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
                <BilingualText en="Oops! Page Not Found" hi="ओह! पृष्ठ नहीं मिला" />
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
                <BilingualText 
                en="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." 
                hi="आप जिस पृष्ठ को खोज रहे हैं वह हटाया जा सकता है, उसका नाम बदला जा सकता है, या अस्थायी रूप से अनुपलब्ध हो सकता है।" 
                />
            </p>
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
