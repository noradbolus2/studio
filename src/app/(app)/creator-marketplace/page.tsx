
// src/app/(app)/creator-marketplace/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, ShoppingCart, Sparkles, Award, Palette, Code2, FlaskConical, Edit3, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CreatorProject {
  id: string;
  titleEn: string;
  titleHi: string;
  creatorNameEn: string;
  creatorNameHi: string;
  creatorAvatarUrl?: string; // Optional
  dataAiHintAvatar?: string;
  categoryEn: string;
  categoryHi: string;
  classLevel?: string; 
  subjectEn?: string;
  subjectHi?: string;
  descriptionEn: string;
  descriptionHi: string;
  imageUrl?: string; // Optional
  dataAiHintImage: string;
  priceDigital?: number;
  pricePhysicalKit?: number;
  rating?: number; 
  reviewCount?: number;
}

const mockCreatorProjects: CreatorProject[] = [
  {
    id: 'cp1',
    titleEn: 'AI-Powered Story Generator',
    titleHi: 'एआई-संचालित कहानी जनरेटर',
    creatorNameEn: 'Tech Savvy Creations',
    creatorNameHi: 'टेक सैवी क्रिएशन्स',
    creatorAvatarUrl: 'https://placehold.co/40x40.png',
    dataAiHintAvatar: 'creator avatar tech',
    categoryEn: 'Coding & AI',
    categoryHi: 'कोडिंग और एआई',
    classLevel: '9-12',
    subjectEn: 'Computer Science, AI',
    subjectHi: 'कंप्यूटर विज्ञान, एआई',
    descriptionEn: 'A Python-based project that uses AI to generate short stories based on user prompts. Includes code and guide.',
    descriptionHi: 'एक पायथन-आधारित प्रोजेक्ट जो उपयोगकर्ता संकेतों के आधार पर लघु कथाएँ उत्पन्न करने के लिए एआई का उपयोग करता है। इसमें कोड और गाइड शामिल हैं।',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHintImage: 'ai code project',
    priceDigital: 499,
    pricePhysicalKit: 799, 
    rating: 4.5,
    reviewCount: 15,
  },
  {
    id: 'cp2',
    titleEn: 'Working Volcano Model Kit',
    titleHi: 'वर्किंग ज्वालामुखी मॉडल किट',
    creatorNameEn: 'Science Wonders',
    creatorNameHi: 'साइंस वंडर्स',
    dataAiHintAvatar: 'creator avatar science', // creatorAvatarUrl removed to test fallback
    categoryEn: 'Science Model',
    categoryHi: 'विज्ञान मॉडल',
    classLevel: '6-8',
    subjectEn: 'Science, Geography',
    subjectHi: 'विज्ञान, भूगोल',
    descriptionEn: 'Complete kit with all materials and instructions to build an impressive erupting volcano model. Safe and educational.',
    descriptionHi: 'एक प्रभावशाली विस्फोट करने वाला ज्वालामुखी मॉडल बनाने के लिए सभी सामग्रियों और निर्देशों के साथ पूर्ण किट। सुरक्षित और शैक्षिक।',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHintImage: 'volcano model kit',
    pricePhysicalKit: 349,
    rating: 4.8,
    reviewCount: 28,
  },
  {
    id: 'cp3',
    titleEn: 'Historical Diorama: Indus Valley',
    titleHi: 'ऐतिहासिक डायोरमा: सिंधु घाटी',
    creatorNameEn: 'History Buffs Co.',
    creatorNameHi: 'हिस्ट्री बफ्स कंपनी',
    categoryEn: 'Art & Craft',
    categoryHi: 'कला और शिल्प',
    classLevel: '7-9',
    subjectEn: 'History, Art',
    subjectHi: 'इतिहास, कला',
    descriptionEn: 'Create a detailed diorama of an Indus Valley Civilization settlement. Includes guide and material suggestions.',
    descriptionHi: 'सिंधु घाटी सभ्यता की बस्ती का विस्तृत डायोरमा बनाएं। इसमें गाइड और सामग्री सुझाव शामिल हैं।',
    dataAiHintImage: 'history diorama indus', // imageUrl removed
    priceDigital: 199, 
    rating: 4.2,
    reviewCount: 9,
  },
];

const projectCategories = [
    { id: 'all', nameEn: 'All Projects', nameHi: 'सभी प्रोजेक्ट', icon: Sparkles },
    { id: 'science_model', nameEn: 'Science Models', nameHi: 'विज्ञान मॉडल', icon: FlaskConical },
    { id: 'coding_ai', nameEn: 'Coding & AI', nameHi: 'कोडिंग और एआई', icon: Code2 },
    { id: 'art_craft', nameEn: 'Art & Craft', nameHi: 'कला और शिल्प', icon: Palette },
    { id: 'research_essay', nameEn: 'Research/Essay', nameHi: 'शोध/निबंध', icon: Edit3 },
];

export default function CreatorMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const router = useRouter();

  const handleGetMade = (project: CreatorProject) => {
    toast({
      title: `Order Request for "${project.titleEn}" (Simulated)`,
      description: "You would typically choose digital/physical and proceed to payment here.",
    });
  };

  const filteredProjects = mockCreatorProjects.filter(project =>
    (project.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || project.titleHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'all' || project.categoryEn.toLowerCase().replace(' & ', '_').replace(' ', '_') === selectedCategory)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <BilingualText en="Creator Project Marketplace" hi="क्रिएटर प्रोजेक्ट मार्केटप्लेस" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Discover unique projects made by talented OSO Creators." hi="प्रतिभाशाली OSO क्रिएटर्स द्वारा बनाए गए अद्वितीय प्रोजेक्ट खोजें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder_en="Search projects by title, subject..."
            placeholder_hi="शीर्षक, विषय के अनुसार प्रोजेक्ट खोजें..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Category" hi="श्रेणी चुनें" />} />
            </SelectTrigger>
            <SelectContent>
              {projectCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                    <cat.icon className="inline h-4 w-4 mr-2 opacity-70" />
                    <BilingualText en={cat.nameEn} hi={cat.nameHi} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <BilingualText en="More Filters" hi="अधिक फ़िल्टर" />
          </Button>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full bg-muted/30">
                  <Image 
                    src={project.imageUrl || `https://placehold.co/300x200.png`} 
                    alt={project.titleEn} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={project.dataAiHintImage || 'project image'} 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2 flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <Image 
                      src={project.creatorAvatarUrl || `https://placehold.co/40x40.png`} 
                      alt={project.creatorNameEn} 
                      width={24} 
                      height={24} 
                      className="rounded-full" 
                      data-ai-hint={project.dataAiHintAvatar || 'creator avatar'} 
                    />
                    <span className="text-xs font-medium text-primary"><BilingualText en={project.creatorNameEn} hi={project.creatorNameHi} /></span>
                </div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  <BilingualText en={project.titleEn} hi={project.titleHi} />
                </CardTitle>
                <div className="text-xs text-muted-foreground space-x-2">
                    <span><BilingualText en={project.categoryEn} hi={project.categoryHi}/></span>
                    {project.classLevel && <span>| Class: {project.classLevel}</span>}
                    {project.subjectEn && <span>| <BilingualText en={project.subjectEn} hi={project.subjectHi || project.subjectEn}/></span>}
                </div>
                <CardDescription className="text-sm h-12 overflow-hidden line-clamp-2">
                  <BilingualText en={project.descriptionEn} hi={project.descriptionHi} />
                </CardDescription>
                
                <div className="flex items-center gap-1 pt-1">
                  {project.rating && Array(5).fill(0).map((_, i) => (
                    <Sparkles key={i} size={14} className={i < Math.floor(project.rating!) ? "text-accent fill-accent" : "text-muted-foreground/50"} />
                  ))}
                  {project.reviewCount && <span className="text-xs text-muted-foreground">({project.reviewCount} reviews)</span>}
                </div>

                <div className="pt-1">
                    {project.priceDigital && <p className="text-sm font-semibold"><BilingualText en="Digital Guide: " hi="डिजिटल गाइड: "/> INR {project.priceDigital}</p>}
                    {project.pricePhysicalKit && <p className="text-sm font-semibold"><BilingualText en="Physical Kit: " hi="फिजिकल किट: "/> INR {project.pricePhysicalKit}</p>}
                    {!project.priceDigital && !project.pricePhysicalKit && <p className="text-sm font-semibold"><BilingualText en="Custom Pricing" hi="कस्टम मूल्य निर्धारण"/></p>}
                </div>
              </CardContent>
              <CardFooter className="p-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleGetMade(project)}>
                  <ShoppingCart size={16} className="mr-2" />
                  <BilingualText en="Get This Made" hi="यह बनवाएं" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            <BilingualText en="No creator projects found matching your criteria." hi="आपके मानदंडों से मेल खाने वाले कोई क्रिएटर प्रोजेक्ट नहीं मिले।" />
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <BilingualText en="Try adjusting your filters or check back soon!" hi="अपने फ़िल्टर समायोजित करने का प्रयास करें या जल्द ही वापस देखें!" />
          </p>
        </div>
      )}
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
