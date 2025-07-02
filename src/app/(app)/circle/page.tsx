
"use client";

import { PeerMatch } from "@/components/circle/PeerMatch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPinned, MessageSquareHeart, ArrowLeft, Users } from "lucide-react";
import { BilingualText } from "@/components/shared/BilingualText";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data for community support feed
const mockCommunityPosts = [
  { id: 1, title: "Can someone explain Newton's Third Law with a simple example?", author: "Riya S.", replies: 5 },
  { id: 2, title: "Best resources for JEE Advanced Chemistry?", author: "Amit P.", replies: 12 },
];


export default function CirclePage() {
    const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <header className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
                <BilingualText en="OSO Circle™" hi="OSO सर्कल™" />
            </h1>
            <p className="text-muted-foreground">
                <BilingualText en="Connect, collaborate, and grow with your peers." hi="अपने साथियों के साथ जुड़ें, सहयोग करें और आगे बढ़ें।" />
            </p>
          </div>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <PeerMatch />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MapPinned className="text-accent h-6 w-6" />
              <BilingualText en="Nearby Study Pods" hi="आस-पास के स्टडी पॉड्स" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Discover and join study groups in your locality." hi="अपने इलाके में अध्ययन समूहों को खोजें और उनमें शामिल हों।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center border border-dashed">
                <Image 
                  src="https://placehold.co/600x400.png" 
                  alt="Map Placeholder" 
                  width={600} 
                  height={400} 
                  data-ai-hint="map location"
                  className="opacity-60"
                />
            </div>
            <p className="text-sm text-muted-foreground">
              <BilingualText en="Find hyperlocal study pods to learn together. Feature coming soon!" hi="एक साथ सीखने के लिए हाइपरलोकल स्टडी पॉड खोजें। यह सुविधा जल्द ही आ रही है!" />
            </p>
          </CardContent>
           <CardFooter>
            <Button variant="secondary" className="w-full">
              <BilingualText en="Find Pods Near Me" hi="मेरे पास पॉड खोजें"/>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MessageSquareHeart className="text-primary h-6 w-6" />
              <BilingualText en="Community Support" hi="सामुदायिक सहायता" />
            </CardTitle>
            <CardDescription>
              <BilingualText en="Ask questions and share knowledge with the OSO community." hi="प्रश्न पूछें और OSO समुदाय के साथ ज्ञान साझा करें।" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            {mockCommunityPosts.map(post => (
              <div key={post.id} className="p-2 bg-muted/50 rounded-md text-sm">
                <p className="font-semibold truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground">by {post.author} • {post.replies} replies</p>
              </div>
            ))}
             <p className="text-sm text-center pt-2 text-muted-foreground">
              <BilingualText en="Full forum feature coming soon!" hi="पूर्ण फ़ोरम सुविधा जल्द ही आ रही है!" />
            </p>
          </CardContent>
          <CardFooter>
             <Button className="w-full">
              <BilingualText en="Join Discussion" hi="चर्चा में शामिल हों"/>
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
