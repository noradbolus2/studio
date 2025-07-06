
"use client";

import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BilingualText } from '@/components/shared/BilingualText';

const quotes = [
  // Study + Life Motivation
  { en: "Planning to pull an all-nighter? Hope you ordered pens from OSO!", hi: "रात भर पढ़ने का इरादा है? आशा है कि आपने OSO से पेन मंगवा लिए होंगे!", hng: "Raat bhar padhne ka irada hai? OSO se pen manga liya na?" },
  { en: "Need focus? Not the internet! Grab a notebook and highlighter from OSO!", hi: "फोकस चाहिए? इंटरनेट नहीं! OSO से एक नोटबुक और हाइलाइटर ले लो!", hng: "Focus chahiye? Internet nahi! Notebook aur highlighter la OSO se!" },
  { en: "Toppers make plans. Legends use OSO.", hi: "टॉपर्स योजना बनाते हैं। लेजेंड्स OSO का उपयोग करते हैं।", hng: "Toppers plan karte hain. Legends OSO chalate hain." },
  { en: "The syllabus is tough, but OSO's delivery system is tougher!", hi: "सिलेबस कठिन है, लेकिन OSO का डिलीवरी सिस्टम उससे भी कठिन है!", hng: "Syllabus tough hai, par OSO ka delivery system usse tez hai!" },
  { en: "You can't clear UPSC in a day, but you can get a compass delivered!", hi: "आप एक दिन में UPSC क्लियर नहीं कर सकते, लेकिन एक कंपास तो मंगवा ही सकते हैं!", hng: "Ek din me UPSC nahi, par compass toh aa sakta hai!" },
  // Zomato-style Funny
  { en: "Teacher said: 'Bring your notebook tomorrow.' OSO said: 'I'll deliver it today, boss!'", hi: "शिक्षक ने कहा: 'कल अपनी नोटबुक लाओ।' OSO ने कहा: 'मैं आज ही दे दूँगा, बॉस!'", hng: "Teacher ne kaha: 'Kal notebook lao.' OSO ne kaha: 'Aaj hi de dete hain boss!'" },
  { en: "Whatever stationery you're looking for, you'll find it on OSO!", hi: "जो भी स्टेशनरी आप ढूंढ रहे हैं, वह आपको OSO पर मिलेगी!", hng: "Jo stationary dhoondhta hai, woh OSO pe milta hai!" },
  { en: "Don't stress, brother... OSO is here, it will handle the syllabus!", hi: "टेंशन मत ले भाई... OSO है, सिलेबस संभाल लेगा!", hng: "Tension mat le bhai... OSO hai, syllabus sambhal lega!" },
  { en: "Bad mood? Out of pages? Order OSO and chill!", hi: "मूड खराब है? पेज खत्म हो गए? OSO से ऑर्डर करो और चिल करो!", hng: "Mood kharab? Page khatam? Order OSO and chill!" },
  { en: "Shop closed? Download the OSO App... the future is open!", hi: "दुकान बंद है? OSO ऐप डाउनलोड करो... भविष्य खुला है!", hng: "Dukaan band? OSO App download kar... future open hai!" },
  // Power Motivation
  { en: "Don't think, just start... OSO will get everything ready!", hi: "सोचो मत, शुरू करो... OSO सब कुछ तैयार कर देगा!", hng: "Soch mat, start kar... OSO sab ready kar dega!" },
  { en: "Every second is important — OSO works every second!", hi: "हर सेकंड महत्वपूर्ण है - OSO हर सेकंड काम करता है!", hng: "Har second important hai — OSO har second me kaam karta hai!" },
  { en: "Want to be great? First, get your pen, notes, and willpower ready!", hi: "महान बनना है? पहले, अपना पेन, नोट्स और इच्छाशक्ति तैयार रखो!", hng: "Bada banna hai? Pehle pen, notes aur willpower ready rakh!" },
  { en: "Invest a little in OSO for your future!", hi: "अपने भविष्य के लिए OSO में थोड़ा निवेश करें!", hng: "Apne future ke liye thoda OSO bhi invest kar!" },
  { en: "One click = One step towards success!", hi: "एक क्लिक = सफलता की ओर एक कदम!", hng: "Ek click = Ek kadam success ki taraf!" },
  // Savage Student Life
  { en: "Waiting 3 days? Bro, this is 2025, OSO arrives in 30 mins!", hi: "3 दिन का इंतज़ार? भाई, ये 2025 है, OSO 30 मिनट में आता है!", hng: "3 din ka wait? Bhai ye 2025 hai, OSO 30 min me aata hai!" },
  { en: "Used to run for coaching? Now, studies come home with OSO!", hi: "कोचिंग के लिए भागते थे? अब, OSO के साथ पढ़ाई घर पर आती है!", hng: "Coaching ke liye bhaagta tha? Ab OSO se padhai ghar pe aati hai!" },
  { en: "Want to study without stress? Install OSO, bro!", hi: "बिना तनाव के पढ़ना है? OSO इंस्टॉल कर भाई!", hng: "Bina stress ke padhna hai? OSO install kar bhai!" },
  { en: "OSO delivery person > that shopkeeper uncle who keeps everything out of stock!", hi: "OSO डिलीवरी वाला भैया > वो दुकान वाले अंकल जो हर चीज़ आउट ऑफ स्टॉक रखते हैं!", hng: "OSO wale bhaiya > woh dukaan waale uncle jo har cheez out of stock rakhte hain!" },
  { en: "Stop the humiliation of asking a classmate for a pen — get your own from OSO!", hi: "सहपाठी से पेन मांगने की बेइज्जती बंद करो - OSO से अपना खुद का लो!", hng: "Classmate se pen maangne ki beizzati band karo — OSO se khud lo!" },
];

export function DynamicQuoteCard({ lang }: { lang: 'en' | 'hi' | 'hng' }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsFading(false);
      }, 500); // Wait for fade out to complete
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  const currentQuote = quotes[currentQuoteIndex];

  return (
    <Card className="bg-amber-100/50 dark:bg-amber-900/20 border-amber-500/30">
      <CardContent className="p-3 flex items-center gap-3">
        <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0" />
        <p className={cn(
            "text-sm font-medium text-amber-800 dark:text-amber-200 transition-opacity duration-500",
            isFading ? 'opacity-0' : 'opacity-100'
          )}>
          <BilingualText en={currentQuote.en} hi={currentQuote.hi} hng={currentQuote.hng} lang={lang} />
        </p>
      </CardContent>
    </Card>
  );
}
