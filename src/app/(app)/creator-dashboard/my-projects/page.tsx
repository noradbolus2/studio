
// src/app/(app)/creator-dashboard/my-projects/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Edit3, PlusCircle, Search, Trash2, Eye, PackageSearch, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CreatorProject {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dataAiHint: string;
  status: "Approved" | "Pending Review" | "Needs Revision" | "Draft";
  priceDigital?: number;
  pricePhysicalKit?: number;
  orders: number;
  views: number;
}

const mockCreatorProjects: CreatorProject[] = [
  { id: "cp1", title: "AI Story Generator Template", category: "Coding & AI", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "ai code project", status: "Approved", priceDigital: 499, orders: 25, views: 250 },
  { id: "cp2", title: "Volcano Model Kit Guide", category: "Science Model", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "volcano model kit", status: "Approved", pricePhysicalKit: 349, orders: 15, views: 180 },
  { id: "cp3", title: "Indus Valley Diorama Plan", category: "Art & Craft", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "history diorama", status: "Pending Review", priceDigital: 199, orders: 0, views: 30 },
  { id: "cp4", title: "Essay Writing Framework", category: "Research/Essay", imageUrl: "https://placehold.co/300x200.png", dataAiHint: "essay writing", status: "Draft", priceDigital: 99, orders: 0, views: 5 },
];

export default function MyProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<CreatorProject[]>(mockCreatorProjects);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    // Simulate deletion
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Deleted (Simulated)",
      description: `"${projectTitle}" has been removed from your projects.`,
      variant: "destructive"
    });
  };
  
  const getStatusBadgeVariant = (status: CreatorProject['status']) => {
    switch(status) {
        case "Approved": return "bg-green-500/20 text-green-700 border-green-400";
        case "Pending Review": return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
        case "Needs Revision": return "bg-orange-500/20 text-orange-700 border-orange-400";
        case "Draft": return "bg-gray-500/20 text-gray-700 border-gray-400";
        default: return "outline";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <PackageSearch className="h-7 w-7 text-primary" />
          <BilingualText en="My Uploaded Projects" hi="मेरे अपलोड किए गए प्रोजेक्ट" />
        </h1>
        <Button variant="outline" onClick={() => router.push('/creator-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle><BilingualText en="Your Creative Portfolio" hi="आपका रचनात्मक पोर्टफोलियो" /></CardTitle>
            <CardDescription><BilingualText en="Manage and track your project templates." hi="अपने प्रोजेक्ट टेम्पलेट्स को प्रबंधित और ट्रैक करें।" /></CardDescription>
          </div>
          <Button asChild>
            <Link href="/creator-dashboard/upload-project">
              <PlusCircle className="mr-2 h-4 w-4" />
              <BilingualText en="Upload New Project" hi="नया प्रोजेक्ट अपलोड करें" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Input
            placeholder_en="Search your projects..."
            placeholder_hi="अपने प्रोजेक्ट खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="p-0 relative">
                     <div className="aspect-video relative bg-muted">
                        <Image src={project.imageUrl} alt={project.title} layout="fill" objectFit="cover" data-ai-hint={project.dataAiHint}/>
                     </div>
                     <Badge variant="outline" className={`absolute top-2 right-2 text-xs ${getStatusBadgeVariant(project.status)}`}>{project.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-3 space-y-1">
                    <h3 className="font-semibold text-sm leading-tight truncate">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Orders: {project.orders}</span>
                        <span>Views: {project.views}</span>
                    </div>
                    {project.priceDigital && <p className="text-xs font-medium text-primary">Digital: ₹{project.priceDigital}</p>}
                    {project.pricePhysicalKit && <p className="text-xs font-medium text-primary">Kit: ₹{project.pricePhysicalKit}</p>}
                  </CardContent>
                  <CardFooter className="p-2 flex gap-1.5 justify-end bg-muted/30 border-t">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="View Stats (Coming Soon)">
                        <BarChart3 className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit Project">
                        <Edit3 className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete Project" onClick={() => handleDeleteProject(project.id, project.title)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              <BilingualText en="You haven't uploaded any projects yet." hi="आपने अभी तक कोई प्रोजेक्ट अपलोड नहीं किया है।" />
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}

