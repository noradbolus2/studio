
// Placeholder for Competitive Bookstore UI
"use client";

import { useState } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, DownloadCloud, Filter, Search, ShoppingCart, ThumbsUp } from "lucide-react";
import Image from 'next/image';

const examCategories = [
  { id: 'all', nameEn: 'All Exams', nameHi: 'सभी परीक्षाएं' },
  { id: 'jee', nameEn: 'JEE (Main & Adv)', nameHi: 'जेईई (मुख्य और एडवांस्ड)' },
  { id: 'neet', nameEn: 'NEET UG', nameHi: 'नीट यूजी' },
  { id: 'cuet', nameEn: 'CUET', nameHi: 'सीयूईटी' },
  { id: 'upsc', nameEn: 'UPSC Civil Services', nameHi: 'यूपीएससी सिविल सेवा' },
  { id: 'nda', nameEn: 'NDA & NA', nameHi: 'एनडीए और एनए' },
  { id: 'ssc', nameEn: 'SSC Exams', nameHi: 'एसएससी परीक्षाएं' },
];

const publishers = [
    {id: "oswaal", name: "Oswaal Books", logoUrl: "https://placehold.co/100x40.png?text=Oswaal", dataAiHint:"oswaal logo"},
    {id: "arihant", name: "Arihant Experts", logoUrl: "https://placehold.co/100x40.png?text=Arihant", dataAiHint:"arihant logo"},
    {id: "mtg", name: "MTG Learning Media", logoUrl: "https://placehold.co/100x40.png?text=MTG", dataAiHint:"mtg logo"},
    {id: "disha", name: "Disha Publication", logoUrl: "https://placehold.co/100x40.png?text=Disha", dataAiHint:"disha logo"},
];

const sampleBooks = [
  { id: '1', titleEn: 'JEE Main Solved Papers', titleHi: 'जेईई मुख्य हल प्रश्नपत्र', exam: 'JEE', publisher: 'Arihant', price: 450, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "jee book cover", class: "N/A" },
  { id: '2', titleEn: 'NEET Biology Guide', titleHi: 'नीट जीवविज्ञान गाइड', exam: 'NEET', publisher: 'MTG', price: 799, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "neet book cover", class: "N/A" },
  { id: '3', titleEn: 'CUET (UG) General Test', titleHi: 'सीयूईटी (यूजी) सामान्य परीक्षा', exam: 'CUET', publisher: 'Oswaal', price: 350, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "cuet book cover", class: "N/A" },
  { id: '4', titleEn: 'Indian Polity for UPSC', titleHi: 'यूपीएससी के लिए भारतीय राजनीति', exam: 'UPSC', publisher: 'Disha', price: 600, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "upsc book cover", class: "N/A" },
];

export default function CompetitiveBookstorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  // Add more filters for subject, language, price as state if needed

  const filteredBooks = sampleBooks.filter(book => 
    (book.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || book.titleHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedExam === 'all' || book.exam.toLowerCase() === selectedExam)
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">
          <BilingualText en="Competitive Exam Bookstore" hi="प्रतियोगी परीक्षा बुकस्टोर" />
        </h1>
        <p className="text-muted-foreground">
          <BilingualText en="Your success starts here. Best books for all major exams." hi="आपकी सफलता यहीं से शुरू होती है। सभी प्रमुख परीक्षाओं के लिए सर्वश्रेष्ठ पुस्तकें।" />
        </p>
      </header>

      {/* Filters Section */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder_en="Search books by title or exam..."
            placeholder_hi="शीर्षक या परीक्षा के अनुसार पुस्तकें खोजें..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Exam" hi="परीक्षा चुनें" />} />
            </SelectTrigger>
            <SelectContent>
              {examCategories.map(exam => (
                <SelectItem key={exam.id} value={exam.id}>
                  <BilingualText en={exam.nameEn} hi={exam.nameHi} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Add more Select components for Subject, Language, Price Range */}
           <Button variant="outline" className="h-11 w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <BilingualText en="More Filters" hi="अधिक फ़िल्टर" />
          </Button>
        </div>
      </div>

      {/* Publisher Cards */}
       <section>
            <h2 className="text-xl font-semibold mb-3 font-headline"><BilingualText en="Top Publishers" hi="शीर्ष प्रकाशक"/></h2>
            <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                <div className="flex space-x-4">
                    {publishers.map(pub => (
                        <Card key={pub.id} className="min-w-[150px] p-3 hover:shadow-md transition-shadow">
                            <Image src={pub.logoUrl} alt={pub.name} width={100} height={40} className="object-contain mx-auto data-ai-hint={pub.dataAiHint}" />
                            <p className="text-xs text-center mt-2 text-muted-foreground">{pub.name}</p>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>


      {/* Book Listing */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-[3/4] relative w-full bg-muted/30">
                  <Image src={book.imageUrl} alt={book.titleEn} layout="fill" objectFit="contain" className="p-2 data-ai-hint={book.dataAiHint}" />
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-1">
                <CardTitle className="text-sm font-semibold leading-tight h-10 overflow-hidden">
                  <BilingualText en={book.titleEn} hi={book.titleHi} />
                </CardTitle>
                <p className="text-xs text-muted-foreground"><BilingualText en={`Exam: ${book.exam}`} hi={`परीक्षा: ${book.exam}`} /></p>
                <p className="text-xs text-muted-foreground"><BilingualText en={`By ${book.publisher}`} hi={`${book.publisher} द्वारा`} /></p>
                <p className="text-md font-bold text-primary">₹{book.price}</p>
              </CardContent>
              <CardFooter className="p-2 pt-0 flex flex-col space-y-1.5">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                  <ShoppingCart size={14} className="mr-1.5" />
                  <BilingualText en="Add to Cart" hi="कार्ट में डालें" />
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                   <DownloadCloud size={14} className="mr-1.5" />
                   <BilingualText en="Free PDF Sample" hi="मुफ़्त पीडीएफ नमूना" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground"><BilingualText en="No books found matching your criteria." hi="आपके मानदंडों से मेल खाने वाली कोई पुस्तक नहीं मिली।" /></p>
        </div>
      )}
    </div>
  );
}

