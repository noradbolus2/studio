
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookText, Search, Filter, BookOpenCheck, DownloadCloud, ShoppingCart, Info, ArrowLeft } from 'lucide-react';
import type { ProfileFormData } from '../edit-profile/page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NcertBook {
  id: string;
  titleEn: string;
  titleHi: string;
  class: number;
  subjectEn: string;
  subjectHi: string;
  board: 'NCERT' | 'State Board';
  medium: 'English' | 'Hindi' | 'English/Hindi';
  imageUrl?: string;
  dataAiHint: string;
  status: 'free' | 'buy';
  pdfUrl?: string; // New field for direct PDF link
}

const allNcertBooks: NcertBook[] = [
  // Class 6
  { id: 'c6_math_e', titleEn: 'Mathematics', titleHi: 'गणित', class: 6, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1636819483716-854492c76683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYXRocyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook", status: 'free' },
  { id: 'c6_science_e', titleEn: 'Science', titleHi: 'विज्ञान', class: 6, subjectEn: 'Science', subjectHi: 'विज्ञान', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzY2llbmNlJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkwNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "science textbook", status: 'free' },
  { id: 'c6_history_e', titleEn: 'Our Pasts - I', titleHi: 'हमारे अतीत - I', class: 6, subjectEn: 'Social Science', subjectHi: 'सामाजिक विज्ञान', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1581019055887-6c4b2ca9d222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxoaXN0b3J5JTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "history textbook", status: 'free' },
  { id: 'c6_math_h', titleEn: 'Mathematics (Hindi Med.)', titleHi: 'गणित', class: 6, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'Hindi', imageUrl: 'https://images.unsplash.com/photo-1721631224591-be20e4294df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYXRocyUyMHRleHRib29rJTIwaGluZGl8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook hindi", status: 'free' },
  
  // Class 7
  { id: 'c7_math_e', titleEn: 'Mathematics', titleHi: 'गणित', class: 7, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1647936019088-a07c6a9180b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtYXRocyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook", status: 'buy' },
  { id: 'c7_science_e', titleEn: 'Science', titleHi: 'विज्ञान', class: 7, subjectEn: 'Science', subjectHi: 'विज्ञान', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1725870416040-a61b308f5d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzY2llbmNlJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkwNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "science textbook", status: 'free' },

  // Class 8
  { id: 'c8_math_e', titleEn: 'Mathematics', titleHi: 'गणित', class: 8, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1651041599130-c5ba25aa2a0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtYXRocyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook", status: 'free' },
  { id: 'c8_science_h', titleEn: 'Science Ch1 (Hindi Med.)', titleHi: 'विज्ञान अध्याय1', class: 8, subjectEn: 'Science', subjectHi: 'विज्ञान', board: 'NCERT', medium: 'Hindi', imageUrl: 'https://images.unsplash.com/photo-1646495785840-7ff6be438d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxzY2llbmNlJTIwdGV4dGJvb2slMjBoaW5kaXxlbnwwfHx8fDE3NTE0OTE4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "science textbook hindi", status: 'free', pdfUrl: 'https://ncert.nic.in/textbook/pdf/hhvs101.pdf' },

  // Class 9
  { id: 'c9_math_e', titleEn: 'Mathematics', titleHi: 'गणित', class: 9, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1651041599130-c5ba25aa2a0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtYXRocyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook", status: 'free' },
  { id: 'c9_science_e', titleEn: 'Science Ch1: Matter in Our Surroundings', titleHi: 'विज्ञान अध्याय1: हमारे आस-पास के पदार्थ', class: 9, subjectEn: 'Science', subjectHi: 'विज्ञान', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1725870953863-4ad4db0acfc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzY2llbmNlJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkwNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "science textbook", status: 'free', pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc101.pdf' },
  { id: 'c9_sst_sb_e', titleEn: 'Social Studies', titleHi: 'सामाजिक अध्ययन', class: 9, subjectEn: 'Social Science', subjectHi: 'सामाजिक विज्ञान', board: 'State Board', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1668499192688-2a7514d67a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c29jaWFsJTIwc3R1ZGllcyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "social studies textbook", status: 'free' },

  // Class 10
  { id: 'c10_math_e', titleEn: 'Mathematics Ch1: Real Numbers', titleHi: 'गणित अध्याय1: वास्तविक संख्याएँ', class: 10, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1654255618503-f092518486c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtYXRocyUyMHRleHRib29rfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook", status: 'free', pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf' },
  { id: 'c10_science_h', titleEn: 'Science (Hindi Med.)', titleHi: 'विज्ञान', class: 10, subjectEn: 'Science', subjectHi: 'विज्ञान', board: 'NCERT', medium: 'Hindi', imageUrl: 'https://images.unsplash.com/photo-1726759795103-8d43bc210ff7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzY2llbmNlJTIwdGV4dGJvb2slMjBoaW5kaXxlbnwwfHx8fDE3NTE0OTE4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "science textbook hindi", status: 'free' },

  // Class 11
  { id: 'c11_physics1_e', titleEn: 'Physics Part-I Ch1: Units and Measurements', titleHi: 'भौतिकी भाग-I अध्याय1: मात्रक और मापन', class: 11, subjectEn: 'Physics', subjectHi: 'भौतिकी', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1671660469532-69e41ec0ef3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwaHlzaWNzJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "physics textbook", status: 'free', pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph101.pdf' },
  { id: 'c11_chemistry1_h', titleEn: 'Chemistry Part-I (Hindi Med.)', titleHi: 'रसायन विज्ञान भाग-I', class: 11, subjectEn: 'Chemistry', subjectHi: 'रसायन विज्ञान', board: 'NCERT', medium: 'Hindi', imageUrl: 'https://images.unsplash.com/photo-1636819483716-854492c76683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjaGVtaXN0cnklMjB0ZXh0Ym9vayUyMGhpbmRpfGVufDB8fHx8MTc1MTQ5MTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "chemistry textbook hindi", status: 'buy' },

  // Class 12
  { id: 'c12_physics1_e', titleEn: 'Physics Part-I', titleHi: 'भौतिकी भाग-I', class: 12, subjectEn: 'Physics', subjectHi: 'भौतिकी', board: 'NCERT', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1749661190411-7394e0fa37f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwaHlzaWNzJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "physics textbook", status: 'free' },
  { id: 'c12_maths1_h', titleEn: 'Mathematics Part-I (Hindi Med.)', titleHi: 'गणित भाग-I', class: 12, subjectEn: 'Mathematics', subjectHi: 'गणित', board: 'NCERT', medium: 'Hindi', imageUrl: 'https://images.unsplash.com/photo-1676747484510-755c231ae83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtYXRocyUyMHRleHRib29rJTIwaGluZGl8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "maths textbook hindi", status: 'buy' },
  { id: 'c12_biology_sb_e', titleEn: 'Biology', titleHi: 'जीवविज्ञान', class: 12, subjectEn: 'Biology', subjectHi: 'जीवविज्ञान', board: 'State Board', medium: 'English', imageUrl: 'https://images.unsplash.com/photo-1720421502211-eb2901acbf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YmlvbG9neSUyMHRleHRib29rJTIwc3RhdGV8ZW58MHx8fHwxNzUxNDkxODUzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "biology textbook state", status: 'free' },
];

const availableClasses = Array.from(new Set(allNcertBooks.map(book => book.class))).sort((a, b) => a - b);
const availableSubjectsEn = Array.from(new Set(allNcertBooks.map(book => book.subjectEn))).sort();
const availableBoards = Array.from(new Set(allNcertBooks.map(book => book.board))).sort();
const availableMediums = Array.from(new Set(allNcertBooks.map(book => book.medium))).sort();

function getNumericClassFromString(classNameString?: string): string | null {
  if (!classNameString) return null;
  const match = classNameString.match(/\d+/); 
  if (match) {
    return match[0];
  }
  return null;
}

export default function NcertBooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['all']);
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const storedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          if (storedProfile.className) {
            const numericClass = getNumericClassFromString(storedProfile.className);
            if (numericClass && availableClasses.map(String).includes(numericClass)) {
              setSelectedClass(numericClass);
            }
          }
        } catch (e) {
          console.error("Failed to parse profile for NCERT books page:", e);
        }
      }
    }
  }, []);

  const handleSubjectSelectionChange = (subject: string) => {
    setSelectedSubjects(currentSelection => {
      if (subject === 'all') {
        return ['all'];
      }
      const selectionWithoutAll = currentSelection.filter(id => id !== 'all');
      const isCurrentlySelected = selectionWithoutAll.includes(subject);

      if (isCurrentlySelected) {
        const newSelection = selectionWithoutAll.filter(id => id !== subject);
        return newSelection.length === 0 ? ['all'] : newSelection;
      } else {
        return [...selectionWithoutAll, subject];
      }
    });
  };

  const filteredBooks = useMemo(() => {
    return allNcertBooks.filter(book =>
      (book.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || book.titleHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedClass === 'all' || book.class === parseInt(selectedClass)) &&
      (selectedSubjects.includes('all') || selectedSubjects.includes(book.subjectEn)) &&
      (selectedBoard === 'all' || book.board === selectedBoard) &&
      (selectedMedium === 'all' || book.medium === selectedMedium)
    );
  }, [searchTerm, selectedClass, selectedSubjects, selectedBoard, selectedMedium]);
  
  const getSubjectDropdownTriggerText = () => {
    if (selectedSubjects.includes('all') || selectedSubjects.length === 0) {
      return <BilingualText en="Select Subject(s)" hi="विषय चुनें" />;
    }
    if (selectedSubjects.length === 1) {
      return selectedSubjects[0];
    }
    return <BilingualText en={`${selectedSubjects.length} subjects selected`} hi={`${selectedSubjects.length} विषय चुने गए`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <BookText className="h-8 w-8 text-primary" />
            <BilingualText en="NCERT & State Board Books (6-12)" hi="एनसीईआरटी और राज्य बोर्ड पुस्तकें (6-12)" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Find textbooks for Class 6 to 12." hi="कक्षा 6 से 12 के लिए पाठ्यपुस्तकें खोजें।" />
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
            placeholder_en="Search by book title..."
            placeholder_hi="पुस्तक शीर्षक से खोजें..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Class" hi="कक्षा चुनें" />} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><BilingualText en="All Classes" hi="सभी कक्षाएं" /></SelectItem>
              {availableClasses.map(cls => (
                <SelectItem key={cls} value={String(cls)}><BilingualText en={`Class ${cls}`} hi={`कक्षा ${cls}`} /></SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-full justify-start text-left">
                    <span className="truncate flex-grow">{getSubjectDropdownTriggerText()}</span>
                     <Filter className="h-4 w-4 shrink-0 opacity-50 ml-2"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px]">
                <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={selectedSubjects.includes('all')}
                    onCheckedChange={() => handleSubjectSelectionChange('all')}
                >
                    All Subjects
                </DropdownMenuCheckboxItem>
                {availableSubjectsEn.map(sub => (
                    <DropdownMenuCheckboxItem
                        key={sub}
                        checked={selectedSubjects.includes(sub)}
                        onCheckedChange={() => handleSubjectSelectionChange(sub)}
                    >
                        {sub}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Board" hi="बोर्ड चुनें" />} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><BilingualText en="All Boards" hi="सभी बोर्ड" /></SelectItem>
              {availableBoards.map(board => (
                <SelectItem key={board} value={board}>{board}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMedium} onValueChange={setSelectedMedium}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Medium" hi="माध्यम चुनें" />} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><BilingualText en="All Mediums" hi="सभी माध्यम" /></SelectItem>
              {availableMediums.map(med => (
                <SelectItem key={med} value={med}>{med}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-[3/4] relative w-full bg-muted/30">
                  <Image 
                    src={book.imageUrl || `https://placehold.co/300x400.png`} 
                    alt={book.titleEn} 
                    layout="fill" 
                    objectFit="cover" 
                    className="p-2" 
                    data-ai-hint={book.dataAiHint || 'book cover'} 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-1 flex-grow">
                <CardTitle className="text-sm font-semibold leading-tight h-10 overflow-hidden">
                  <BilingualText en={book.titleEn} hi={book.titleHi} />
                </CardTitle>
                <CardDescription className="text-xs">
                  <BilingualText en={`Class ${book.class}`} hi={`कक्षा ${book.class}`} /> | <BilingualText en={book.subjectEn} hi={book.subjectHi}/>
                </CardDescription>
                 <CardDescription className="text-xs">
                  <BilingualText en={book.board} hi={book.board === "NCERT" ? "एनसीईआरटी" : "राज्य बोर्ड"} /> | <BilingualText en={book.medium} hi={book.medium === "English" ? "अंग्रेजी" : book.medium === "Hindi" ? "हिंदी" : "अंग्रेजी/हिंदी"} />
                </CardDescription>
              </CardContent>
              <CardFooter className="p-2 pt-0 flex flex-col space-y-1.5">
                {book.pdfUrl ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
                      <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <BookOpenCheck size={14} className="mr-1.5" />
                        <BilingualText en="Read Online" hi="ऑनलाइन पढ़ें" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
                      <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                        <DownloadCloud size={14} className="mr-1.5" />
                        <BilingualText en="Download PDF" hi="पीडीएफ डाउनलोड करें" />
                      </a>
                    </Button>
                    {book.status === 'buy' && (
                        <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8 mt-1.5">
                            <ShoppingCart size={14} className="mr-1.5" />
                            <BilingualText en="Add to Cart" hi="कार्ट में डालें" />
                        </Button>
                    )}
                  </>
                ) : book.status === 'buy' ? ( 
                  <>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 opacity-50 cursor-not-allowed">
                      <Info size={14} className="mr-1.5" />
                      <BilingualText en="Sample N/A" hi="नमूना उपलब्ध नहीं" />
                    </Button>
                    <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                      <ShoppingCart size={14} className="mr-1.5" />
                      <BilingualText en="Add to Cart" hi="कार्ट में डालें" />
                    </Button>
                  </>
                ) : ( 
                  <>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 opacity-50 cursor-not-allowed">
                      <BookOpenCheck size={14} className="mr-1.5" />
                      <BilingualText en="Read (N/A)" hi="पढ़ें (N/A)" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 opacity-50 cursor-not-allowed">
                      <DownloadCloud size={14} className="mr-1.5" />
                      <BilingualText en="Download (N/A)" hi="डाउनलोड (N/A)" />
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            <BilingualText en="No books found matching your criteria." hi="आपके मानदंडों से मेल खाने वाली कोई पुस्तक नहीं मिली।" />
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <BilingualText en="Try adjusting your filters." hi="अपने फ़िल्टर समायोजित करने का प्रयास करें।" />
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
