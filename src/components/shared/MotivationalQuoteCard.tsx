import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { BilingualText } from "./BilingualText";

export function MotivationalQuoteCard() {
  // In a real app, this would come from a service or state
  const quote = {
    en: "The best way to predict the future is to create it.",
    hi: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।",
    authorEn: "Peter Drucker",
    authorHi: "पीटर ड्रकर"
  };

  return (
    <Card className="shadow-lg_override bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Lightbulb className="h-6 w-6 text-accent" />
        <CardTitle className="font-headline text-lg">
          <BilingualText en="Quote of the Day" hi="आज का विचार" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-base italic text-foreground">
          <BilingualText en={`"${quote.en}"`} hi={`"${quote.hi}"`} className="block mb-2"/>
        </blockquote>
        <p className="text-right text-sm text-muted-foreground mt-2">
          - <BilingualText en={quote.authorEn} hi={quote.authorHi} separator=" " />
        </p>
      </CardContent>
    </Card>
  );
}
