
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, School, Search, CheckCircle, Clock, AlertTriangle, Send, BadgeCheck, FileText, IndianRupee, CalendarDays, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Institution {
  id: string;
  name: string;
  city: string;
  type: 'School' | 'College';
  isOsoVerified: boolean;
}

const mockInstitutions: Institution[] = [
  { id: 'school321', name: 'OSO Academy, Delhi', city: 'Delhi', type: 'School', isOsoVerified: true },
  { id: 'school789', name: 'Sunshine College, Mumbai', city: 'Mumbai', type: 'College', isOsoVerified: true },
  { id: 'school111', name: 'Wisdom School, Kanpur', city: 'Kanpur', type: 'School', isOsoVerified: false },
  { id: 'school222', name: 'Springdales, Pusa Road', city: 'Delhi', type: 'School', isOsoVerified: true },
  { id: 'school555', name: 'Lucknow Public College', city: 'Lucknow', type: 'College', isOsoVerified: true},
  { id: 'school666', name: 'City Montessori School', city: 'Lucknow', type: 'School', isOsoVerified: false},
];

type TransferStatus = 'idle' | 'pending_approval' | 'dues_pending' | 'transfer_complete';

export default function SwitchSchoolPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [targetInstitution, setTargetInstitution] = useState<Institution | null>(null);
  
  const currentInstitution = {
    name: 'OSO Public School, Lucknow',
    id: 'school456',
    osoId: 'OSO-SCH-UP1039',
    dues: 0 // Example: Set to 0 for "No dues" case
  };
  
  const filteredInstitutions = useMemo(() => 
    mockInstitutions.filter(inst => 
      (inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inst.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
      inst.id !== currentInstitution.id
    ), [searchTerm, currentInstitution.id]
  );
  
  const handleApply = (institution: Institution) => {
    if (!institution.isOsoVerified) {
      toast({
        title: "Application Not Available",
        description: "This institution is not yet digitally verified on the OSO network for transfers.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setTargetInstitution(institution);
    toast({ title: "Submitting Request", description: `Sending transfer request to ${institution.name}...` });

    setTimeout(() => {
      if (currentInstitution.dues > 0) {
        setTransferStatus('dues_pending');
      } else {
        setTransferStatus('pending_approval');
      }
      setIsLoading(false);
    }, 2000);
  };
  
  const handleClearDues = () => {
    setIsLoading(true);
    toast({ title: "Processing Payment", description: "Redirecting to fees page to clear dues..."});
    setTimeout(() => {
      currentInstitution.dues = 0;
      setTransferStatus('pending_approval');
      setIsLoading(false);
      toast({ title: "Dues Cleared!", description: "Your transfer request is now awaiting approval from the new institution."});
    }, 2500);
  };

  const renderStatusCard = () => {
    if (transferStatus === 'idle') {
      return null;
    }

    let statusDetails;
    switch (transferStatus) {
      case 'dues_pending':
        statusDetails = {
          icon: AlertTriangle,
          title: "Application Status",
          color: "destructive",
          content: (
            <>
              <p>Your transfer request to <strong>{targetInstitution?.name}</strong> is on hold.</p>
              <p className="font-semibold mt-2">Reason: Pending dues of INR {currentInstitution.dues} at {currentInstitution.name}.</p>
            </>
          ),
          footer: (
            <Button onClick={handleClearDues} disabled={isLoading} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isLoading ? <LoadingSpinner/> : <><IndianRupee className="mr-2 h-4 w-4" /> Clear Dues Now</>}
            </Button>
          )
        };
        break;
      case 'pending_approval':
        statusDetails = {
          icon: Clock,
          title: "Application Status",
          color: "yellow-600",
          content: (
            <>
                <p className="flex items-center gap-2"><ArrowRight className="h-4 w-4"/> Transfer Request: Sent to <strong>{targetInstitution?.name}</strong></p>
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4"/> Status: Awaiting School Approval</p>
            </>
          )
        };
        break;
       case 'transfer_complete':
        statusDetails = {
          icon: CheckCircle,
          title: "Transfer Complete!",
          color: "green-600",
          content: <p>Congratulations! Your OSO ID has been successfully transferred to <strong>{targetInstitution?.name}</strong>. Your profile is now updated.</p>
        };
        break;
      default:
        return null;
    }

    return (
        <Card className={`border-${statusDetails.color}/50 bg-${statusDetails.color}/10`}>
            <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-${statusDetails.color}`}>
                    <statusDetails.icon /> {statusDetails.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">{statusDetails.content}</CardContent>
            {statusDetails.footer && <CardFooter>{statusDetails.footer}</CardFooter>}
        </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <School className="h-7 w-7 text-primary" />
          <BilingualText en="OSO Campus Switch™" hi="OSO कैंपस स्विच™" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Current Institution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2 font-semibold text-lg"><School className="h-5 w-5 text-muted-foreground"/> {currentInstitution.name}</p>
            <p className="flex items-center gap-2"><FileText className="h-5 w-5 text-muted-foreground"/> OSO ID: {currentInstitution.osoId}</p>
            <p className="flex items-center gap-2 text-green-600 font-medium"><CheckCircle className="h-5 w-5"/> No dues pending</p>
        </CardContent>
      </Card>

      {renderStatusCard()}

      <Card>
        <CardHeader>
          <CardTitle>Apply to New School/College</CardTitle>
          <CardDescription>Search for an OSO Verified institution and request admission.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or city..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {filteredInstitutions.map(inst => (
              <div key={inst.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    {inst.name}
                    {inst.isOsoVerified && <BadgeCheck size={14} className="text-blue-500"/>}
                  </h4>
                  <p className="text-xs text-muted-foreground">{inst.city} • {inst.type}</p>
                </div>
                <Button size="sm" onClick={() => handleApply(inst)} disabled={isLoading || transferStatus !== 'idle' || !inst.isOsoVerified}>
                  <Send className="mr-2 h-4 w-4" /> Apply
                </Button>
              </div>
            ))}
             {filteredInstitutions.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">No other verified institutions found.</p>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
