"use client";

import { PeerMatch } from "@/components/circle/PeerMatch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinned, MessageSquareHeart, ArrowLeft } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CirclePage() {
    const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
              <BilingualText en="OSO Circle™" hi="OSO सर्कल™" />
          </h1>
          <p className="text-muted-foreground">
              <BilingualText en="Connect, collaborate, and grow with your peers." hi="अपने साथियों के साथ जुड़ें, सहयोग करें और आगे बढ़ें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <PeerMatch />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <MapPinned className="text-accent h-6 w-6" />
            <BilingualText en="Nearby Study Pods" hi="आस-पास के स्टडी पॉड्स" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Discover and join study groups in your locality." hi="अपने इलाके में अध्ययन समूहों को खोजें और उनमें शामिल हों।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText en="Feature coming soon! Find hyperlocal study pods to learn together." hi="यह सुविधा जल्द ही आ रही है! एक साथ सीखने के लिए हाइपरलोकल स्टडी पॉड खोजें।" />
          </p>
          {/* Placeholder for study pods list or map */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <MessageSquareHeart className="text-primary h-6 w-6" />
            <BilingualText en="Community Support" hi="सामुदायिक सहायता" />
          </CardTitle>
          <CardDescription>
            <BilingualText en="Ask questions, share knowledge, and get help from the OSO community." hi="प्रश्न पूछें, ज्ञान साझा करें और OSO समुदाय से सहायता प्राप्त करें।" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <BilingualText en="Join forums and discussion groups. Coming soon!" hi="फ़ोरम और चर्चा समूहों में शामिल हों। जल्द आ रहा है!" />
          </p>
          {/* Placeholder for community forum links or feed */}
        </CardContent>
      </Card>
    </div>
  );
}
