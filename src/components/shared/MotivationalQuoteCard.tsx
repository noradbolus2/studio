
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { BilingualText } from "./BilingualText"; // BilingualText is kept for the CardTitle

export function MotivationalQuoteCard() {
  // In a real app, this would come from a service or state
  const quote = {
    en: "The best way to predict the future is to create it.",
    hi: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।", // Hindi text remains in data for potential future use
    authorEn: "Peter Drucker",
    authorHi: "पीटर ड्रकर" // Hindi text remains in data for potential future use
  };

  return (
    <Card className="shadow-lg_override bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 min-w-[280px] max-w-md">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Lightbulb className="h-6 w-6 text-accent" />
        <CardTitle className="font-headline text-lg">
          {/* Card title can still be bilingual if desired, or also changed to English only */}
          <BilingualText en="Quote of the Day" hi="आज का विचार" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-base italic text-foreground">
          <span className="block mb-2">{`"${quote.en}"`}</span>
        </blockquote>
        <p className="text-right text-sm text-muted-foreground mt-2">
          - {quote.authorEn}
        </p>
      </CardContent>
    </Card>
  );
}
