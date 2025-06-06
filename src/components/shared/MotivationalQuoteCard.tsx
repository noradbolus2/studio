
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { BilingualText } from "./BilingualText";

interface MotivationalQuoteCardProps {
  quoteText: string;
  quoteAuthor: string;
  lang?: 'en' | 'hi'; // To control title language if HomePage manages it
}

export function MotivationalQuoteCard({ quoteText, quoteAuthor, lang = 'en' }: MotivationalQuoteCardProps) {
  return (
    <Card className="shadow-lg_override bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 min-w-[280px] max-w-md">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Lightbulb className="h-6 w-6 text-accent" />
        <CardTitle className="font-headline text-lg">
          <BilingualText lang={lang} en="Quote of the Day" hi="आज का विचार" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-base italic text-foreground">
          <span className="block mb-2">{`"${quoteText}"`}</span>
        </blockquote>
        <p className="text-right text-sm text-muted-foreground mt-2">
          - {quoteAuthor}
        </p>
      </CardContent>
    </Card>
  );
}
