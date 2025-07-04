
"use client";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ClipboardList, Check, MessageSquare, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const mockActiveTasks = [
  { id: "TASK001", title: "Create 20 Biology MCQs", deadline: "6 July", pay: 200, status: 'In Progress' },
  { id: "TASK002", title: "Review History Flashcards", deadline: "8 July", pay: 150, status: 'Pending' }
];

export default function MyTasksPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmitForReview = (taskId: string) => {
    toast({
      title: "Submitted for Review",
      description: `Task #${taskId} has been submitted.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-primary" />
          <BilingualText en="My Active Tasks" hi="मेरे सक्रिय कार्य" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      {mockActiveTasks.map(task => (
         <Card key={task.id}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{task.title}</CardTitle>
                    <Badge variant={task.status === 'In Progress' ? 'secondary' : 'default'}>{task.status}</Badge>
                </div>
                <CardDescription>Deadline: {task.deadline} | Payout: INR {task.pay}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor={`upload-${task.id}`} className="flex items-center gap-2 mb-1">
                        <UploadCloud className="h-4 w-4"/>
                        Upload your work
                    </Label>
                    <Input id={`upload-${task.id}`} type="file" className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                <div>
                    <Label htmlFor={`notes-${task.id}`} className="mb-1">Notes to Reviewer (Optional)</Label>
                    <Textarea id={`notes-${task.id}`} placeholder="e.g., Tagged with Bloom’s Taxonomy"/>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id={`ai-help-${task.id}`} />
                    <Label htmlFor={`ai-help-${task.id}`}>I used AI Help for this task</Label>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4"/> Ask for Extension
                </Button>
                <Button onClick={() => handleSubmitForReview(task.id)}>
                    <Check className="mr-2 h-4 w-4"/> Submit for Review
                </Button>
            </CardFooter>
        </Card>
      ))}
      {mockActiveTasks.length === 0 && (
         <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                You have no active tasks.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
