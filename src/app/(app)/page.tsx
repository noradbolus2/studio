
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react'; // Added useEffect and useCallback
import {
  Languages,
  RefreshCw, // Icon for new quote button
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { MotivationalQuoteCard } from '@/components/shared/MotivationalQuoteCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const gridItems = [
  { id: 'stationery', href: '/services/stationery', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'stationery items', labelEn: 'Stationery', labelHi: 'स्टेशनरी' },
  { id: 'projects', href: '/services/projects', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'school project', labelEn: 'Projects', labelHi: 'परियोजनाएं' },
  { id: 'assignments', href: '/services/assignments', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'homework assignment', labelEn: 'Assignments', labelHi: 'असाइनमेंट' },
  { id: 'uniforms', href: '/services/uniforms', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'school uniform', labelEn: 'Uniforms', labelHi: 'वर्दी' },
  { id: 'elibrary', href: '/services/elibrary', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'digital library', labelEn: 'e-Library', labelHi: 'ई-लाइब्रेरी' },
  { id: 'studysnacks', href: '/services/studysnacks', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'healthy snacks', labelEn: 'Study Snacks', labelHi: 'स्टडी स्नैक्स' },
  { id: 'lastminutekits', href: '/services/lastminutekits', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'exam kit', labelEn: 'Last Minute Kits', labelHi: 'अंतिम मिनट किट' },
  { id: 'testseries', href: '/services/testseries', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'mock test', labelEn: 'Test Series', labelHi: 'टेस्ट सीरीज़' },
  { id: 'parentmode', href: '/services/parentmode', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'parental app', labelEn: 'Parent Mode', labelHi: 'पेरेंट मोड' },
  { id: 'dailygurugyaan', href: '/services/dailygurugyaan', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'daily wisdom', labelEn: 'Daily Guru Gyaan', labelHi: 'दैनिक गुरु ज्ञान' },
  { id: 'guruji', href: '/services/guruji', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'ai tutor', labelEn: 'Guru Ji', labelHi: 'गुरु जी' },
  { id: 'liveclasses', href: '/services/liveclasses', imageUrl: 'https://placehold.co/60x60.png', dataAiHint: 'online class', labelEn: 'Live Classes', labelHi: 'लाइव कक्षाएं' },
];

const sampleQuotes = [
  { en: "The best way to predict the future is to create it.", authorEn: "Peter Drucker", hi: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।", authorHi: "पीटर ड्रकर" },
  { en: "Your limitation—it's only your imagination.", authorEn: "Anonymous", hi: "आपकी सीमा-यह सिर्फ आपकी कल्पना है।", authorHi: "गुमनाम" },
  { en: "Push yourself, because no one else is going to do it for you.", authorEn: "Anonymous", hi: "खुद को धकेलो, क्योंकि कोई और तुम्हारे लिए यह नहीं करेगा।", authorHi: "गुमनाम" },
  { en: "Great things never come from comfort zones.", authorEn: "Anonymous", hi: "महान चीजें कभी भी आराम क्षेत्र से नहीं आती हैं।", authorHi: "गुमनाम" },
  { en: "Dream it. Wish it. Do it.", authorEn: "Anonymous", hi: "सपना देखो। इच्छा करो। कर डालो।", authorHi: "गुमनाम" },
  { en: "Success doesn’t just find you. You have to go out and get it.", authorEn: "Anonymous", hi: "सफलता तुम्हें ढूंढती नहीं है। तुम्हें बाहर जाकर उसे पाना होगा।", authorHi: "गुमनाम" },
  { en: "The harder you work for something, the greater you’ll feel when you achieve it.", authorEn: "Anonymous", hi: "आप किसी चीज़ के लिए जितनी मेहनत करते हैं, उसे हासिल करने पर उतना ही अच्छा महसूस करेंगे।", authorHi: "गुमनाम" },
  { en: "Don't stop when you're tired. Stop when you're done.", authorEn: "Anonymous", hi: "थकने पर मत रुको। जब काम पूरा हो जाए तब रुको।", authorHi: "गुमनाम" },
  { en: "Wake up with determination. Go to bed with satisfaction.", authorEn: "Anonymous", hi: "दृढ़ संकल्प के साथ जागो। संतुष्टि के साथ सो जाओ।", authorHi: "गुमनाम" },
  { en: "Do something today that your future self will thank you for.", authorEn: "Sean Patrick Flanery", hi: "आज कुछ ऐसा करो जिसके लिए तुम्हारा भविष्य का तुम धन्यवाद करोगे।", authorHi: "शॉन पैट्रिक फ्लैनरी" },
];


export default function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [currentQuote, setCurrentQuote] = useState(sampleQuotes[0]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const selectRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    setCurrentQuote(sampleQuotes[randomIndex]);
  }, []); // Empty dependency array as sampleQuotes is constant

  useEffect(() => {
    selectRandomQuote(); // Select an initial quote on mount
  }, [selectRandomQuote]);

  return (
    <div className="space-y-4 pb-8 relative">
      {/* Header: OSO logo & Subheading: “One Student, One App” */}
      <header className="flex items-center justify-between py-3 px-1 mb-3">
        <div className="flex items-center space-x-2">
          <Image
            src="https://placehold.co/40x40.png"
            alt="OSO App Logo"
            width={36}
            height={36}
            className="rounded-md"
            data-ai-hint="app logo"
          />
          <div>
            <h1 className="text-xl font-bold font-headline text-primary">OSO App</h1>
            <p className="text-xs text-muted-foreground">
              <BilingualText lang={currentLanguage} en="One Student, One App" hi="एक छात्र, एक ऐप" />
            </p>
          </div>
        </div>
        {/* Language Toggle Button */}
        <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-primary">
          <Languages className="h-5 w-5" />
          <span className="sr-only"><BilingualText lang={currentLanguage} en="Toggle Language" hi="भाषा बदलें"/></span>
        </Button>
      </header>

      {/* Special Section: Daily Quote / Brain Tip (Horizontal Scroll) */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold font-headline">
            <BilingualText lang={currentLanguage} en="Daily Spark" hi="दैनिक चिंगारी" />
          </h2>
          <Button variant="outline" size="sm" onClick={selectRandomQuote} className="px-2 py-1 h-auto">
            <RefreshCw size={14} className="mr-1.5" />
            <BilingualText lang={currentLanguage} en="New Quote" hi="नया विचार" />
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap pb-2.5">
          <div className="flex space-x-4">
            <MotivationalQuoteCard 
              quoteText={currentLanguage === 'en' ? currentQuote.en : currentQuote.hi}
              quoteAuthor={currentLanguage === 'en' ? currentQuote.authorEn : currentQuote.authorHi}
              lang={currentLanguage}
            />
            {/* Add more cards here for horizontal scroll if needed */}
            {/* Example: <Card className="min-w-[280px]"><CardContent className="p-4">Another tip...</CardContent></Card> */}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>


      {/* 3x4 Grid of colorful rounded icons */}
      <section className="px-1">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {gridItems.map((item) => (
            <Link href={item.href} key={item.id} passHref>
              <Card className="aspect-square flex flex-col items-center justify-center p-2.5 text-center hover:shadow-lg transition-shadow cursor-pointer bg-accent/10 hover:bg-accent/20 active:bg-accent/30 rounded-xl shadow-sm">
                <div className="relative h-7 w-7 sm:h-8 sm:w-8 mb-1.5">
                  <Image
                    src={item.imageUrl}
                    alt={currentLanguage === 'en' ? item.labelEn : item.labelHi}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-sm"
                    data-ai-hint={item.dataAiHint}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-foreground leading-tight block h-7 overflow-hidden">
                   <BilingualText lang={currentLanguage} en={item.labelEn} hi={item.labelHi} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom banner: “Infinite Learning” (purple with white text) */}
      <footer className="mt-6 px-1">
        <div className="bg-purple-600 text-white text-center py-3 rounded-lg shadow-md">
          <span className="font-semibold text-sm tracking-wide">
            <BilingualText lang={currentLanguage} en="Infinite Learning" hi="अनंत शिक्षा" separator=" ✨ " />
          </span>
        </div>
      </footer>
    </div>
  );
}

