
'use client';

import { useState, type FormEvent } from 'react';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, FileCode, TestTube2, ShieldCheck, CheckCircle, XCircle, Code2, Play, HardHat, Rocket, ArrowLeft } from "lucide-react";
import { runCodeMate, type CodeMateOutput } from '@/ai/flows/codemate-flow';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

export default function CodeMatePage() {
  const router = useRouter();
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<CodeMateOutput | null>(null);
  const { toast } = useToast();
  
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) {
      toast({ title: "Instruction Required", description: "Please provide instructions for CodeMate.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await runCodeMate({ instruction });
      setAiResponse(response);
      toast({ title: "Plan Generated", description: "CodeMate has generated a plan for your feature." });
    } catch (error: any) {
      toast({ title: "CodeMate Error", description: error.message || "An error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = () => {
    toast({ title: "Deploy Action (Simulated)", description: "This would trigger a CI/CD pipeline to deploy the changes." });
  };
  
  const handleRollback = () => {
    toast({ title: "Rollback Action (Simulated)", description: "This would revert to the previous version.", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Bot className="h-7 w-7 text-primary" />
          <BilingualText en="OSO CodeMate™ AI Agent" hi="OSO कोडमेट™ एआई एजेंट" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/platform-admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Admin" hi="एडमिन पर वापस" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><BilingualText en="Developer Instructions" hi="डेवलपर निर्देश" /></CardTitle>
          <CardDescription><BilingualText en="Describe the feature or bug fix you want CodeMate to work on." hi="उस सुविधा या बग फिक्स का वर्णन करें जिस पर आप कोडमेट को काम कराना चाहते हैं।" /></CardDescription>
        </CardHeader>
        <form onSubmit={handleGenerate}>
          <CardContent>
            <Textarea 
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., 'Add a 'Cancel Order' button in the vendor dashboard that updates the order status to 'Cancelled' in Firestore.'"
              className="min-h-[100px] text-sm font-mono"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !instruction.trim()} className="w-full sm:w-auto">
              {isLoading ? <LoadingSpinner /> : <Code2 className="mr-2"/>}
              <BilingualText en="Generate Code Plan" hi="कोड योजना बनाएं" />
            </Button>
          </CardFooter>
        </form>
      </Card>

      {aiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>CodeMate's Plan</CardTitle>
            <CardDescription>{aiResponse.explanation}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code"><FileCode className="mr-2"/>Code Changes</TabsTrigger>
                <TabsTrigger value="tests"><TestTube2 className="mr-2"/>Test Logs</TabsTrigger>
                <TabsTrigger value="rules"><ShieldCheck className="mr-2"/>Firestore Rules</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="mt-4">
                 <Tabs defaultValue={aiResponse.codeChanges[0]?.filePath || 'file-0'} className="w-full">
                   <TabsList>
                     {aiResponse.codeChanges.map((change, index) => (
                       <TabsTrigger key={index} value={change.filePath || `file-${index}`}>
                         {change.filePath.split('/').pop()}
                       </TabsTrigger>
                     ))}
                   </TabsList>
                   {aiResponse.codeChanges.map((change, index) => (
                     <TabsContent key={index} value={change.filePath || `file-${index}`}>
                       <ScrollArea className="h-72 w-full rounded-md border bg-muted/30">
                         <pre className="text-xs p-4 font-code">{change.code}</pre>
                       </ScrollArea>
                     </TabsContent>
                   ))}
                 </Tabs>
              </TabsContent>
              
              <TabsContent value="tests" className="mt-4">
                <ScrollArea className="h-72 w-full rounded-md border bg-black text-green-400">
                  <pre className="text-xs p-4 font-mono whitespace-pre-wrap">{aiResponse.testLogs}</pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="rules" className="mt-4">
                <ScrollArea className="h-72 w-full rounded-md border bg-muted/30">
                  <pre className="text-xs p-4 font-code">{aiResponse.firestoreRulesUpdate || "No Firestore rules update suggested."}</pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="destructive" onClick={handleRollback}>
              <HardHat className="mr-2" /> Rollback (Simulated)
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleDeploy}>
              <Rocket className="mr-2"/> Approve & Deploy (Simulated)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
