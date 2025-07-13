
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "@/components/shared/BilingualText";
import { ArrowLeft, Search, Users, Star, BookOpen, Edit, BadgeCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
  id: string;
  name: string;
  title: string;
  subjects: string[];
  avatarUrl: string;
  dataAiHint: string;
  rating: number;
  isVerified: boolean;
}

const mockTeachers: Teacher[] = [
  { id: 'teacher1', name: 'Abhishek Verma', title: 'Physics Expert | NEET', subjects: ['Physics', 'NEET'], avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGVhY2hlcnxlbnwwfHx8fDE3NTI1NzU2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'male teacher', rating: 4.9, isVerified: true },
  { id: 'teacher2', name: 'Rohini Sharma', title: 'Chemistry | JEE', subjects: ['Chemistry', 'JEE'], avatarUrl: 'https://images.unsplash.com/photo-1590649880765-91b1956b8276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: 'female teacher professional', rating: 4.8, isVerified: true },
  { id: 'teacher3', name: 'Anjali Gupta', title: 'Biology | Class 10', subjects: ['Biology', 'Class 10'], avatarUrl: 'https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmZW1hbGUlMjBkZXZlbG9wZXJ8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: 'female teacher science', rating: 4.7, isVerified: false },
  { id: 'teacher4', name: 'Ravi Kumar', title: 'Mathematics | JEE Advanced', subjects: ['Maths', 'JEE'], avatarUrl: 'https://images.unsplash.com/photo-1688829388910-8c43a88d85a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxtYWxlJTIwYWNhZGVtaWN8ZW58MHx8fHwxNzUxNTcwNTI3fDA&ixlib.rb-4.1.0&q=80&w=1080', dataAiHint: 'male teacher academic', rating: 4.9, isVerified: true },
];

const subjectsFilter = ['All', 'Physics', 'Chemistry', 'Maths', 'Biology', 'NEET', 'JEE', 'Class 10'];

const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint={teacher.dataAiHint} />
                <AvatarFallback>{teacher.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <CardTitle className="text-lg font-bold flex items-center gap-1.5">{teacher.name} {teacher.isVerified && <BadgeCheck size={16} className="text-blue-500"/>}</CardTitle>
                <CardDescription className="text-xs">{teacher.title}</CardDescription>
                <div className="flex items-center gap-1 text-sm mt-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{teacher.rating}</span>
                    <span className="text-muted-foreground">Rating</span>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href={`/teacher-profile/${teacher.id}`}>View Profile</Link>
            </Button>
        </CardFooter>
    </Card>
);

export default function FindTeachersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const filteredTeachers = useMemo(() => {
    return mockTeachers.filter(teacher =>
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || teacher.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubject === "All" || teacher.subjects.includes(selectedSubject))
    );
  }, [searchTerm, selectedSubject]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <BilingualText en="Find Your Teacher" hi="अपना शिक्षक खोजें" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Search & Filter" hi="खोजें और फ़िल्टर करें" /></CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, subject, or exam..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Subject/Exam" />
                </SelectTrigger>
                <SelectContent>
                    {subjectsFilter.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
            {filteredTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map(teacher => <TeacherCard key={teacher.id} teacher={teacher} />)}
                </div>
            ) : (
                <p className="text-center py-8 text-muted-foreground">No teachers found matching your criteria.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
