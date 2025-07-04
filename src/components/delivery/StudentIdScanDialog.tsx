
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BilingualText } from "../shared/BilingualText";
import { Camera, CheckCircle, Loader2, UserCheck, School, User } from "lucide-react";
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface StudentInfo {
  name: string;
  classInfo: string;
  school: string;
  avatarUrl: string;
  dataAiHint: string;
}

interface StudentIdScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelivery: () => void;
  studentName: string; // To pass in for mock data lookup
}

const mockStudentData: { [key: string]: StudentInfo } = {
    "Priya (Class 8)": { name: "Priya Singh", classInfo: "Class 8, Section B", school: "Modern School, Barakhamba", avatarUrl: "https://placehold.co/100x100.png?text=PS", dataAiHint: "girl student" },
    "Mohan (Class 12)": { name: "Mohan Kumar", classInfo: "Class 12, Section A", school: "Springdales School, Pusa Road", avatarUrl: "https://placehold.co/100x100.png?text=MK", dataAiHint: "boy student" },
    // Default fallback
    "Default": { name: "A. Student", classInfo: "Class 10, Section A", school: "OSO Public School", avatarUrl: "https://placehold.co/100x100.png", dataAiHint: "student avatar" },
};


export function StudentIdScanDialog({ isOpen, onClose, onConfirmDelivery, studentName }: StudentIdScanDialogProps) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned'>('idle');
  const [studentDetails, setStudentDetails] = useState<StudentInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setScanState('scanning');
      const studentData = mockStudentData[studentName] || mockStudentData["Default"];
      
      // Simulate scanning delay
      const timer = setTimeout(() => {
        setStudentDetails(studentData);
        setScanState('scanned');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
        // Reset state when dialog is closed
        setTimeout(() => {
            setScanState('idle');
            setStudentDetails(null);
        }, 300); // Delay reset to allow for closing animation
    }
  }, [isOpen, studentName]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck />
            <BilingualText en="Confirm Student Identity" hi="छात्र की पहचान की पुष्टि करें" />
          </DialogTitle>
           <DialogDescription>
            <BilingualText en="Scan the student's QR code or ID card to ensure correct delivery." hi="सही डिलीवरी सुनिश्चित करने के लिए छात्र का क्यूआर कोड या आईडी कार्ड स्कैन करें।" />
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 min-h-[250px] flex flex-col items-center justify-center">
            {scanState === 'scanning' && (
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative w-32 h-32">
                        <Camera className="w-full h-full text-primary/30"/>
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-scan-y"></div>
                    </div>
                    <LoadingSpinner />
                    <p className="text-muted-foreground"><BilingualText en="Scanning QR/ID Card..." hi="क्यूआर/आईडी कार्ड स्कैन हो रहा है..." /></p>
                </div>
            )}
            {scanState === 'scanned' && studentDetails && (
                <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
                    <Image 
                        src={studentDetails.avatarUrl}
                        alt={studentDetails.name}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-green-500 shadow-lg"
                        data-ai-hint={studentDetails.dataAiHint}
                    />
                    <h3 className="text-xl font-bold">{studentDetails.name}</h3>
                    <div className="text-muted-foreground text-sm">
                        <p className="flex items-center gap-1.5"><User size={14}/> {studentDetails.classInfo}</p>
                        <p className="flex items-center gap-1.5"><School size={14}/> {studentDetails.school}</p>
                    </div>
                     <div className="mt-4">
                        <Button
                        variant="link"
                        className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
                        onClick={() => toast({ title: "Parental OTP Sent (Simulated)", description: "OTP sent to the parent's registered number."})}
                        >
                        <BilingualText en="Student unavailable? Use Parental OTP" hi="छात्र उपलब्ध नहीं है? माता-पिता का OTP उपयोग करें" />
                        </Button>
                    </div>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="button" 
            onClick={onConfirmDelivery}
            disabled={scanState !== 'scanned'}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4"/>
            Confirm Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
