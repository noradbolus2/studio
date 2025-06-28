
// src/app/(app)/creator-dashboard/my-projects/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Edit3, PlusCircle, Search, Trash2, Eye, PackageSearch, BarChart3, Video, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface CreatorContent {
  id: string;
  title: string;
  category: "Coding & AI" | "Science Model" | "Art & Craft" | "Research/Essay" | "Video Course" | "PDF Guide" | "Live Workshop";
  imageUrl?: string; // Made optional
  dataAiHint: string;
  status: "Approved" | "Pending Review" | "Needs Revision" | "Draft";
  priceDigital?: number;
  pricePhysicalKit?: number;
  priceCourse?: number;
  orders: number;
  views: number;
}

const mockCreatorContent: CreatorContent[] = [
  { id: "cp1", title: "AI Story Generator Template", category: "Coding & AI", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "ai code project", status: "Approved", priceDigital: 499, orders: 25, views: 250 },
  { id: "cp2", title: "Volcano Model Kit Guide", category: "Science Model", dataAiHint: "volcano model kit", status: "Approved", pricePhysicalKit: 349, orders: 15, views: 180 }, // imageUrl removed
  { id: "cp3", title: "Indus Valley Diorama Plan", category: "Art & Craft", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "history diorama", status: "Pending Review", priceDigital: 199, orders: 0, views: 30 },
  { id: "cp4", title: "Essay Writing Framework", category: "Research/Essay", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "essay writing", status: "Draft", priceDigital: 99, orders: 0, views: 5 },
  { id: "course1", title: "Beginner Python Video Course", category: "Video Course", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "python course thumbnail", status: "Approved", priceCourse: 1299, orders: 50, views: 500 },
  { id: "guide1", title: "JEE Physics Quick Notes PDF", category: "PDF Guide", dataAiHint: "physics notes pdf", status: "Approved", priceDigital: 249, orders: 100, views: 800 }, // imageUrl removed
  { id: "workshop1", title: "Live Creative Writing Workshop", category: "Live Workshop", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "writing workshop live", status: "Draft", priceCourse: 799, orders: 0, views: 10 },
];

export default function MyContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<CreatorContent[]>(mockCreatorContent);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContent = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteContent = (contentId: string, contentTitle: string) => {
    setContentItems(prev => prev.filter(p => p.id !== contentId));
    toast({
      title: "Content Deleted",
      description: `"${contentTitle}" has been removed.`,
      variant: "destructive"
    });
  };
  
  const getStatusBadgeVariant = (status: CreatorContent['status']) => {
    switch(status) {
        case "Approved": return "bg-green-500/20 text-green-700 border-green-400";
        case "Pending Review": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
        case "Needs Revision": return "bg-orange-500/20 text-orange-700 border-orange-400";
        case "Draft": return "bg-gray-500/20 text-gray-700 border-gray-400";
        default: return "outline";
    }
  }

  const getCategoryIcon = (category: CreatorContent['category']) => {
    switch(category) {
        case "Coding & AI": return <Edit3 className="h-3 w-3"/>; 
        case "Science Model": return <Edit3 className="h-3 w-3"/>;
        case "Art & Craft": return <Edit3 className="h-3 w-3"/>;
        case "Research/Essay": return <Edit3 className="h-3 w-3"/>;
        case "Video Course": return <Video className="h-3 w-3"/>;
        case "PDF Guide": return <FileText className="h-3 w-3"/>;
        case "Live Workshop": return <Video className="h-3 w-3"/>; 
        default: return <Edit3 className="h-3 w-3"/>;
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <PackageSearch className="h-7 w-7 text-primary" />
          <BilingualText en="My Uploaded Content" hi="मेरी अपलोड की गई सामग्री" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle><BilingualText en="Your Creative Portfolio" hi="आपका रचनात्मक पोर्टफोलियो" /></CardTitle>
            <CardDescription><BilingualText en="Manage and track your content templates, courses, and guides." hi="अपनी सामग्री टेम्पलेट्स, पाठ्यक्रम और गाइड को प्रबंधित और ट्रैक करें।" /></CardDescription>
          </div>
          <Button asChild>
            <Link href="/creator-dashboard/upload-project">
              <PlusCircle className="mr-2 h-4 w-4" />
              <BilingualText en="Upload New Content" hi="नई सामग्री अपलोड करें" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Input
            placeholder_en="Search your content..."
            placeholder_hi="अपनी सामग्री खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="p-0 relative">
                     <div className="aspect-video relative bg-muted">
                        <Image 
                          src={item.imageUrl || `https://placehold.co/300x200.png`} 
                          alt={item.title} 
                          layout="fill" 
                          objectFit="cover" 
                          data-ai-hint={item.dataAiHint || 'content image'}
                        />
                     </div>
                     <Badge variant="outline" className={`absolute top-2 right-2 text-xs ${getStatusBadgeVariant(item.status)}`}>{item.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-3 space-y-1">
                    <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        {item.category}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span><BilingualText en="Orders" hi="ऑर्डर"/>: {item.orders}</span>
                        <span><BilingualText en="Views" hi="विचार"/>: {item.views}</span>
                    </div>
                    {item.priceDigital !== undefined && <p className="text-xs font-medium text-primary"><BilingualText en="Digital Template" hi="डिजिटल टेम्पलेट"/>: INR {item.priceDigital}</p>}
                    {item.pricePhysicalKit !== undefined && <p className="text-xs font-medium text-primary"><BilingualText en="Physical Kit" hi="भौतिक किट"/>: INR {item.pricePhysicalKit}</p>}
                    {item.priceCourse !== undefined && <p className="text-xs font-medium text-primary"><BilingualText en="Course/Guide" hi="कोर्स/गाइड"/>: INR {item.priceCourse}</p>}
                  </CardContent>
                  <CardFooter className="p-2 flex gap-1.5 justify-end bg-muted/30 border-t">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="View Stats (Coming Soon)">
                        <BarChart3 className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit Content">
                        <Edit3 className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete Content" onClick={() => handleDeleteContent(item.id, item.title)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              <BilingualText en="You haven't uploaded any content yet." hi="आपने अभी तक कोई सामग्री अपलोड नहीं की है।" />
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
