
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { Home, SearchX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-border/50">
            <CardHeader className="items-center pb-4">
                <SearchX className="w-20 h-20 text-primary opacity-50 mb-4" strokeWidth={1} />
                <CardTitle className="text-4xl font-headline font-bold text-primary">
                    404
                </CardTitle>
            </CardHeader>
            <CardContent>
                <h2 className="text-xl font-semibold text-foreground">
                    <BilingualText en="Page Not Found" hi="पेज नहीं मिला" />
                </h2>
                <CardDescription className="mt-2">
                    <BilingualText 
                    en="Oops! It seems the page you were looking for is on a study break. Let's head back home." 
                    hi="उफ़! लगता है आप जिस पेज को ढूंढ रहे थे, वह स्टडी ब्रेक पर है। चलो घर वापस चलते हैं।" 
                    />
                </CardDescription>
            </CardContent>
            <CardFooter>
                 <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    <BilingualText en="Go to Homepage" hi="मुखपृष्ठ पर जाएं" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
