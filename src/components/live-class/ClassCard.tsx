
"use client";

import React from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react'; 
import { RadioTower, Timer, PlaySquare, BookOpen, FlaskConical, Sigma, Languages, Code2, Users, ExternalLink, Palette, TrendingUp, UserCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/shared/BilingualText';
import { cn } from '@/lib/utils';
import { BrainCircuit } from '@/components/shared/LoadingSpinner';


export interface LiveClass {
  id: string;
  titleEn: string;
  titleHi: string;
  subjectEn: string;
  subjectHi: string;
  subjectIcon?: LucideIcon;
  creatorNameEn: string;
  creatorNameHi: string;
  creatorAvatarUrl?: string;
  dataAiHintAvatar?: string;
  thumbnailUrl: string;
  dataAiHintThumbnail: string;
  status: 'live' | 'upcoming' | 'recorded';
  dateTime?: string; 
  countdown?: string; 
  duration?: string; 
  viewers?: number; 
  classLevel?: string; 
  tags?: string[];
  descriptionEn?: string;
  descriptionHi?: string;
  lang?: 'en' | 'hi';
}

interface ClassCardProps {
  classInfo: LiveClass;
  lang?: 'en' | 'hi';
  className?: string;
}

const SubjectIconMap: Record<string, LucideIcon> = {
  default: BookOpen,
  maths: Sigma,
  physics: FlaskConical,
  chemistry: FlaskConical,
  biology: Palette, 
  science: FlaskConical,
  english: Languages,
  hindi: Languages,
  "social studies": BookOpen,
  history: BookOpen,
  geography: BookOpen,
  "computer science": Code2,
  ai: BrainCircuit,
  coding: Code2,
  art: Palette,
  revision: TrendingUp,
  "doubt class": UserCircle, 
};


export function ClassCard({ classInfo, lang = 'en', className }: ClassCardProps) {
  const SubjectSpecificIcon = SubjectIconMap[classInfo.subjectEn.toLowerCase()] || SubjectIconMap.default;

  let statusBadge;
  switch (classInfo.status) {
    case 'live':
      statusBadge = (
        <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1 animate-pulse bg-red-500 text-white border-red-600">
          <RadioTower size={12} />
          <BilingualText en="LIVE" hi="लाइव" lang={lang} />
          {classInfo.viewers && <span className="text-xs">({classInfo.viewers})</span>}
        </Badge>
      );
      break;
    case 'upcoming':
      statusBadge = (
        <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-400 text-yellow-900 border-yellow-500">
          <Timer size={12} />
          <BilingualText en={classInfo.countdown || "Soon"} hi={classInfo.countdown || "जल्द"} lang={lang} />
        </Badge>
      );
      break;
    case 'recorded':
      statusBadge = (
        <Badge variant="outline" className="absolute top-2 right-2 flex items-center gap-1 bg-gray-500 text-white border-gray-600">
          <PlaySquare size={12} />
          <BilingualText en="Recorded" hi="रिकॉर्डेड" lang={lang} />
        </Badge>
      );
      break;
    default:
      statusBadge = null;
  }

  return (
    <Card className={cn("overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 rounded-lg w-full flex flex-col bg-card border border-border", className)}>
      <CardHeader className="p-0 relative">
        <Link href={`/live-class/${classInfo.id}`} className="block aspect-video relative">
          <Image
            src={classInfo.thumbnailUrl || 'https://placehold.co/300x168.png'}
            alt={lang === 'en' ? classInfo.titleEn : classInfo.titleHi}
            layout="fill"
            objectFit="cover"
            data-ai-hint={classInfo.dataAiHintThumbnail || 'class thumbnail'}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {statusBadge}
        </Link>
      </CardHeader>
      <CardContent className="p-3 flex-grow space-y-1.5">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={classInfo.creatorAvatarUrl || 'https://placehold.co/40x40.png'} 
              alt={lang === 'en' ? classInfo.creatorNameEn : classInfo.creatorNameHi} 
              data-ai-hint={classInfo.dataAiHintAvatar || 'teacher avatar'} 
            />
            <AvatarFallback>{(lang === 'en' ? classInfo.creatorNameEn : classInfo.creatorNameHi).substring(0,1)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            <BilingualText en={classInfo.creatorNameEn} hi={classInfo.creatorNameHi} lang={lang} />
          </span>
        </div>
        <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
          <Link href={`/live-class/${classInfo.id}`} className="line-clamp-2">
            <BilingualText en={classInfo.titleEn} hi={classInfo.titleHi} lang={lang} />
          </Link>
        </h3>
        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
          <SubjectSpecificIcon size={14} className="text-primary" />
          <span><BilingualText en={classInfo.subjectEn} hi={classInfo.subjectHi} lang={lang} /></span>
          {classInfo.classLevel && (
            <>
              <span>•</span>
              <span><BilingualText en={classInfo.classLevel} hi={classInfo.classLevel} lang={lang}/></span>
            </>
          )}
        </div>
        {classInfo.descriptionEn && classInfo.descriptionHi && (
            <p className="text-xs text-muted-foreground line-clamp-2">
                <BilingualText en={classInfo.descriptionEn} hi={classInfo.descriptionHi} lang={lang} />
            </p>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-border/50">
        <Link href={`/live-class/${classInfo.id}`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary">
                <BilingualText en="View Class" hi="कक्षा देखें" lang={lang} /> <ExternalLink size={14} className="ml-1.5" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
