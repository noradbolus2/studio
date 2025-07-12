
"use client";

import { useState, type ChangeEvent, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Edit3, UploadCloud, Video, Package, IndianRupee, ShoppingCart, Wand2, PlusCircle, Trash2, Search, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { enhanceProjectDescription } from '@/ai/flows/enhance-project-description-flow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { StationeryItem } from '@/components/delivery/StationeryItemCard';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


// Mock data for the creator being hired
const mockCreator = {
  id: 'creator1',
  nameEn: 'Priya\'s Projects',
  nameHi: 'प्रिया के प्रोजेक्ट्स',
  avatarUrl: 'https://images.unsplash.com/photo-1694638278223-4c3907aa2354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmZW1hbGUlMjBjcmVhdG9yfGVufDB8fHx8MTc1MjMwNjc0N3ww&lib=rb-4.1.0&q=80&w=1080',
  dataAiHint: 'female creator',
  baseFee: 250, 
  videoFee: 99, 
};

// This key will be used to pass materials between pages
const PROJECT_MATERIALS_CART_KEY = "projectMaterialsCart";

interface SelectedMaterial extends StationeryItem {
    quantity: number;
}


export default function OrderCreatorPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const creatorId = params.creatorId as string;
  const creator = mockCreator;

  const [projectDescription, setProjectDescription] = useState('');
  const [wantsVideo, setWantsVideo] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('123, Learning Lane, Student City, 110011');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [materials, setMaterials] = useState<SelectedMaterial[]>([]);
  
  // This effect will run when the component mounts or when the user returns to this page.
  // It checks localStorage for any materials selected on the delivery page.
  useEffect(() => {
    try {
      const storedMaterials = localStorage.getItem(PROJECT_MATERIALS_CART_KEY);
      if (storedMaterials) {
        const parsedMaterials = JSON.parse(storedMaterials);
        // Simple validation to ensure it's an array
        if (Array.isArray(parsedMaterials)) {
          setMaterials(parsedMaterials);
        }
      }
    } catch (e) {
      console.error("Could not parse project materials from localStorage:", e);
      // Clear potentially corrupted data
      localStorage.removeItem(PROJECT_MATERIALS_CART_KEY);
    }
  }, []);


  const handleRemoveMaterial = (itemId: string) => {
    const updatedMaterials = materials.filter(m => m.id !== itemId);
    setMaterials(updatedMaterials);
    // Update localStorage as well
    localStorage.setItem(PROJECT_MATERIALS_CART_KEY, JSON.stringify(updatedMaterials));
  };
  
  const handleAddMaterialsClick = () => {
    // Save current state before navigating away
    localStorage.setItem('projectOrderCreatorId', creatorId); // Save creator context
    localStorage.setItem('projectOrderDescription', projectDescription);
    localStorage.setItem('projectOrderVideoChoice', JSON.stringify(wantsVideo));
    
    // Navigate to the delivery page in "selection mode"
    router.push('/delivery?mode=project-materials');
  };

  const materialsCost = useMemo(() => {
    return materials.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [materials]);

  const totalCost = creator.baseFee + (wantsVideo ? creator.videoFee : 0) + materialsCost;

  const handlePlaceOrder = () => {
    if (!projectDescription.trim()) {
        toast({ title: "Project Description Needed", description: "Please describe the project you need.", variant: "destructive" });
        return;
    }
     toast({
        title: "Order Placed (Simulated)!",
        description: `Your request has been sent to ${creator.nameEn}.`,
    });
    // Clean up localStorage after placing order
    localStorage.removeItem(PROJECT_MATERIALS_CART_KEY);
    localStorage.removeItem('projectOrderCreatorId');
    localStorage.removeItem('projectOrderDescription');
    localStorage.removeItem('projectOrderVideoChoice');
    router.push('/delivery');
  }
  
  const handleEnhanceDescription = async () => {
      if (!projectDescription.trim()) {
        toast({ title: "Please write a short description first.", variant: "destructive" });
        return;
      }
      setIsEnhancing(true);
      try {
        const result = await enhanceProjectDescription(projectDescription);
        setProjectDescription(result.enhancedDescription);
        toast({ title: "Description Enhanced!", description: "AI has added more details to your request."});
      } catch (error: any) {
        toast({ title: "AI Enhancement Failed", description: error.message || "Could not enhance description.", variant: "destructive" });
      } finally {
        setIsEnhancing(false);
      }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <BilingualText en="Request a Project" hi="एक प्रोजेक्ट का अनुरोध करें" />
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center gap-4">
           <Image 
            src={creator.avatarUrl} 
            alt={creator.nameEn} 
            width={60} 
            height={60} 
            className="rounded-full border-2 border-primary object-cover" 
            data-ai-hint={creator.dataAiHint} 
          />
          <div>
            <CardDescription><BilingualText en="Hiring Creator" hi="निर्माता को काम पर रखना"/></CardDescription>
            <CardTitle className="text-xl"><BilingualText en={creator.nameEn} hi={creator.nameHi} /></CardTitle>
          </div>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2"><Edit3 size={20}/> Project Details</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleEnhanceDescription} disabled={isEnhancing}>
                    {isEnhancing ? <LoadingSpinner size={16}/> : <Wand2 className="mr-2 h-4 w-4"/>}
                    Enhance with AI
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Label htmlFor="description">Describe your project requirements*</Label>
            <Textarea 
                id="description" 
                placeholder="e.g., I need a working model of a windmill for my Class 8 science fair. It should be about 1ft tall..."
                className="min-h-[120px]"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
            />
             <div className="mt-4">
                <Label>Upload reference images or documents (optional)</Label>
                <Input type="file" className="cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package size={20}/> Order Summary</CardTitle>
          <CardDescription>Review the items and services for your project request.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Item / Service</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Creator Fee</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-right">₹{creator.baseFee.toFixed(2)}</TableCell>
                </TableRow>
                 {materials.map(mat => (
                  <TableRow key={mat.id}>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                        <Image src={mat.imageUrl || ''} alt={mat.nameEn} width={24} height={24} className="rounded object-cover"/>
                        <BilingualText en={mat.nameEn} hi={mat.nameHi}/>
                    </TableCell>
                    <TableCell>
                        <Input type="number" value={mat.quantity} className="w-16 h-8 text-center" min="1" readOnly disabled/>
                    </TableCell>
                    <TableCell className="text-right">₹{(mat.price * mat.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                 ))}
                 {wantsVideo && (
                    <TableRow className="bg-primary/5">
                        <TableCell className="font-medium text-primary">Explanation Video</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-right">₹{creator.videoFee.toFixed(2)}</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </div>
          <Button type="button" variant="secondary" onClick={handleAddMaterialsClick} className="w-full mt-3">
              <PlusCircle size={16} className="mr-2"/> Browse & Add Materials from OSO Store
          </Button>

          <Card className={cn(
            "mt-4 p-4 flex items-center justify-between transition-all cursor-pointer",
            wantsVideo ? "bg-primary/10 border-primary" : "bg-muted/50 hover:bg-muted"
          )} onClick={() => setWantsVideo(!wantsVideo)}>
            <div className="flex items-center gap-3">
              <Video className={cn("h-6 w-6", wantsVideo ? "text-primary" : "text-muted-foreground")} />
              <div>
                <Label htmlFor="video-switch" className="font-medium">Add explanation video by creator?</Label>
                <p className="text-xs text-muted-foreground">Get a detailed video walkthrough of your project.</p>
              </div>
            </div>
            <Switch id="video-switch" checked={wantsVideo} readOnly/>
          </Card>
        </CardContent>
        <CardFooter className="flex-col items-stretch space-y-2 bg-muted/30 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{(materialsCost + creator.baseFee + (wantsVideo ? creator.videoFee : 0)).toFixed(2)}</span>
          </div>
           <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery & Service Fee</span>
            <span>₹40.00</span>
          </div>
          <hr className="my-1"/>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Grand Total</span>
            <span>₹{(totalCost + 40).toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
      
      <div className="flex justify-end">
          <Button size="lg" onClick={handlePlaceOrder} className="w-full md:w-auto">
            <ShoppingCart className="mr-2"/>
            Place Order & Proceed to Payment
          </Button>
      </div>

    </div>
  );
}

