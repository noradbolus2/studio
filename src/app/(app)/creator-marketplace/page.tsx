// src/app/(app)/creator-marketplace/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, Sparkles, Award, Palette, Code2, FlaskConical, Edit3, ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Creator {
  id: string;
  nameEn: string;
  nameHi: string;
  expertise: string[];
  avatarUrl: string; 
  dataAiHint: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
}

const mockCreators: Creator[] = [
  { id: 'creator1', nameEn: 'Priya\'s Projects', nameHi: 'प्रिया के प्रोजेक्ट्स', expertise: ['Science Models', 'Dioramas'], avatarUrl: 'https://images.unsplash.com/photo-1616740795230-f63547d8f10c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmZW1hbGUlMjBzdXBwb3J0fGVufDB8fHx8MTc1MTg3ODU0OHww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'female creator', rating: 4.9, reviewCount: 42, completedProjects: 55 },
  { id: 'creator2', nameEn: 'Coding Concepts by Rohan', nameHi: 'रोहन द्वारा कोडिंग कॉन्सेप्ट्स', expertise: ['Coding', 'AI', 'Robotics'], avatarUrl: 'https://images.unsplash.com/photo-1683498073270-888cec8e7abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYWxlJTIwc3VwcG9ydHxlbnwwfHx8fDE3NTE4Nzg1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'male creator tech', rating: 4.8, reviewCount: 31, completedProjects: 40 },
  { id: 'creator3', nameEn: 'Anika\'s Art & Essays', nameHi: 'अनिका की कला और निबंध', expertise: ['Art & Craft', 'Essay Writing'], avatarUrl: 'https://images.unsplash.com/photo-1740252117027-4275d3f84385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjcmVhdG9yJTIwYXZhdGFyJTIwdGVjaHxlbnwwfHx8fDE3NTE5MDQ0Mjh8MA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'female creator art', rating: 5.0, reviewCount: 55, completedProjects: 70 },
  { id: 'creator4', nameEn: 'History Buffs Co.', nameHi: 'हिस्ट्री बफ्स कंपनी', expertise: ['History Projects', 'Research'], avatarUrl: 'https://images.unsplash.com/photo-1740252117027-4275d3f84385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjcmVhdG9yJTIwYXZhdGFyfGVufDB8fHx8MTc1MTkwNDQyOXww&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: 'creator avatar', rating: 4.7, reviewCount: 25, completedProjects: 30 },
];

const expertiseCategories = [
  { id: 'all', nameEn: 'All Experts', nameHi: 'सभी विशेषज्ञ', icon: Sparkles },
  { id: 'Science Models', nameEn: 'Science Models', nameHi: 'विज्ञान मॉडल', icon: FlaskConical },
  { id: 'Coding & AI', nameEn: 'Coding & AI', nameHi: 'कोडिंग और एआई', icon: Code2 },
  { id: 'Art & Craft', nameEn: 'Art & Craft', nameHi: 'कला और शिल्प', icon: Palette },
  { id: 'Essay Writing', nameEn: 'Essay/Research', nameHi: 'निबंध/शोध', icon: Edit3 },
];

export default function CreatorMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const router = useRouter();

  const filteredCreators = useMemo(() => mockCreators.filter(creator =>
    (creator.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || creator.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedExpertise === 'all' || creator.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase().split(' ')[0])))
  ), [searchTerm, selectedExpertise]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <BilingualText en="Hire a Creator" hi="एक निर्माता को काम पर रखें" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Find talented experts to build your school projects." hi="अपने स्कूल प्रोजेक्ट बनाने के लिए प्रतिभाशाली विशेषज्ञों को ढूंढें।" />
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
            placeholder_en="Search creators by name or expertise..."
            placeholder_hi="नाम या विशेषज्ञता के अनुसार निर्माता खोजें..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Filter by Expertise" hi="विशेषज्ञता के अनुसार फ़िल्टर करें" />} />
            </SelectTrigger>
            <SelectContent>
              {expertiseCategories.map(cat => (
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

      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCreators.map(creator => (
            <Card key={creator.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-4 flex items-start space-x-4">
                 <Image 
                    src={creator.avatarUrl || `https://placehold.co/80x80.png`} 
                    alt={creator.nameEn} 
                    width={80} 
                    height={80} 
                    className="rounded-full border-2 border-primary object-cover" 
                    data-ai-hint={creator.dataAiHint || 'creator avatar'} 
                  />
                <div className="flex-grow">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    <BilingualText en={creator.nameEn} hi={creator.nameHi} />
                  </CardTitle>
                   <div className="text-xs text-muted-foreground space-x-1 my-1">
                    {creator.expertise.map(exp => <Badge key={exp} variant="secondary">{exp}</Badge>)}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{creator.rating}</span>
                    <span className="text-muted-foreground text-xs">({creator.reviewCount} reviews)</span>
                  </div>
                   <p className="text-xs text-muted-foreground mt-1">{creator.completedProjects}+ projects completed</p>
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t bg-muted/30">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/creator-marketplace/${creator.id}`}>
                    <BilingualText en="View Profile & Hire" hi="प्रोफ़ाइल देखें और किराए पर लें" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            <BilingualText en="No creators found matching your criteria." hi="आपके मानदंडों से मेल खाने वाले कोई निर्माता नहीं मिले।" />
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
