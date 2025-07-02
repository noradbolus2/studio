"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
        <SearchX className="w-24 h-24 text-primary opacity-30 mb-4" strokeWidth={1} />
        <h1 className="text-6xl font-bold text-primary font-headline">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
            <BilingualText en="Page Not Found" hi="पेज नहीं मिला" />
        </h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
            <BilingualText 
            en="Oops! Looks like the page you were looking for is on a study break. Let's head back home." 
            hi="उफ़! लगता है आप जिस पेज को ढूंढ रहे थे, वह स्टडी ब्रेक पर है। चलो घर वापस चलते हैं।" 
            />
        </p>
        <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            <BilingualText en="Go to Homepage" hi="मुखपृष्ठ पर जाएं" />
            </Link>
        </Button>
    </div>
  );
}
