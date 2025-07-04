
// src/app/(app)/vendor-dashboard/print-on-demand/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Printer, FileText, Palette, Book, Circle, CheckCircle, Truck, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


interface PrintJob {
  id: string;
  customerName: string;
  fileName: string;
  pages: number;
  printType: "B/W" | "Color";
  binding: "None" | "Spiral" | "Stapled";
  status: "New" | "Printing" | "Completed" | "Dispatched";
  totalCost: number;
  date: string;
}

const mockPrintJobs: PrintJob[] = [
    { id: "PRINT001", customerName: "Aanya Sharma", fileName: "Physics_Assignment.pdf", pages: 12, printType: "B/W", binding: "Spiral", status: "New", totalCost: 32, date: "2024-07-23 10:00 AM" },
    { id: "PRINT002", customerName: "Rohan Desai", fileName: "Chemistry_Notes_Ch5.pdf", pages: 25, printType: "Color", binding: "None", status: "New", totalCost: 75, date: "2024-07-23 10:05 AM" },
    { id: "PRINT003", customerName: "Priya Singh", fileName: "History_Project.pdf", pages: 8, printType: "B/W", binding: "Stapled", status: "Printing", totalCost: 13, date: "2024-07-23 09:30 AM" },
    { id: "PRINT004", customerName: "Sameer Khan", fileName: "Maths_PYQ.pdf", pages: 50, printType: "B/W", binding: "Spiral", status: "Completed", totalCost: 70, date: "2024-07-22 05:00 PM" },
];

export default function PrintOnDemandPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<PrintJob[]>(mockPrintJobs);

  const handleUpdateStatus = (jobId: string, newStatus: PrintJob['status']) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    toast({
      title: "Job Updated",
      description: `Job #${jobId} has been marked as ${newStatus}.`
    });
  };

  const getStatusBadgeVariant = (status: PrintJob['status']) => {
    switch (status) {
      case "New": return "bg-blue-500/20 text-blue-700 border-blue-400";
      case "Printing": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
      case "Completed": return "bg-green-500/20 text-green-700 border-green-400";
      case "Dispatched": return "bg-purple-500/20 text-purple-700 border-purple-400";
      default: return "outline";
    }
  };

  const JobCard = ({ job }: { job: PrintJob }) => (
    <Card className="shadow-md">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <CardTitle className="text-md font-bold">#{job.id}</CardTitle>
                <Badge variant="outline" className={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
            </div>
            <CardDescription className="text-xs">{job.date} - by {job.customerName}</CardDescription>
        </CardHeader>
        <CardContent className="pb-3 space-y-1.5 text-sm">
            <p className="flex items-center gap-2"><FileText size={14} className="text-muted-foreground"/> {job.fileName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1"><Book size={12}/> {job.pages} pages</span>
                <span className="flex items-center gap-1"><Palette size={12}/> {job.printType}</span>
                <span className="flex items-center gap-1"><Circle size={12}/> {job.binding}</span>
            </div>
            <p className="font-semibold text-primary pt-1">Total: INR {job.totalCost.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-3 bg-muted/50 border-t">
            {job.status === "New" && (
                <Button className="w-full" onClick={() => handleUpdateStatus(job.id, 'Printing')}>Accept & Start Printing</Button>
            )}
             {job.status === "Printing" && (
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700" onClick={() => handleUpdateStatus(job.id, 'Completed')}>Mark as Printed & Packed</Button>
            )}
             {job.status === "Completed" && (
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(job.id, 'Dispatched')}>Ready for Dispatch</Button>
            )}
             {job.status === "Dispatched" && (
                <div className="flex items-center gap-2 text-sm text-purple-700"><Truck size={16}/> Awaiting Rider Pickup</div>
            )}
        </CardFooter>
    </Card>
  );

  const renderJobs = (status: PrintJob['status'] | 'All') => {
      const filteredJobs = status === 'All' ? jobs : jobs.filter(j => j.status === status);
      if (filteredJobs.length === 0) {
          return (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Info className="mx-auto mb-2 h-8 w-8"/>
                  <p>No jobs in this category.</p>
              </div>
          );
      }
      return (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredJobs.map(job => <JobCard key={job.id} job={job}/>)}
           </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Printer className="h-7 w-7 text-primary" />
          <BilingualText en="Print-on-Demand" hi="प्रिंट-ऑन-डिमांड" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/vendor-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Incoming Print Jobs" hi="आने वाली प्रिंट नौकरियां" /></CardTitle>
          <CardDescription><BilingualText en="Manage print requests from students for their notes and assignments." hi="छात्रों से उनके नोट्स और असाइनमेंट के लिए प्रिंट अनुरोध प्रबंधित करें।" /></CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="New">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="New">New</TabsTrigger>
                    <TabsTrigger value="Printing">Printing</TabsTrigger>
                    <TabsTrigger value="Completed">Completed</TabsTrigger>
                    <TabsTrigger value="Dispatched">Dispatched</TabsTrigger>
                </TabsList>
                <TabsContent value="New">{renderJobs("New")}</TabsContent>
                <TabsContent value="Printing">{renderJobs("Printing")}</TabsContent>
                <TabsContent value="Completed">{renderJobs("Completed")}</TabsContent>
                <TabsContent value="Dispatched">{renderJobs("Dispatched")}</TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
