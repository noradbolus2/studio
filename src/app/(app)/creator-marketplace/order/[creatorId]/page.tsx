
"use client";

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Edit3, UploadCloud, Video, Package, IndianRupee, ShoppingCart, Wand2, PlusCircle, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { enhanceProjectDescription } from '@/ai/flows/enhance-project-description-flow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


// Mock data for the creator being hired
const mockCreator = {
  id: 'creator1',
  nameEn: 'Priya\'s Projects',
  nameHi: 'प्रिया के प्रोजेक्ट्स',
  avatarUrl: 'https://images.unsplash.com/photo-1694638278223-4c3907aa2354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmZW1hbGUlMjBjcmVhdG9yfGVufDB8fHx8MTc1MjMwNjc0N3ww&lib=rb-4.1.0&q=80&w=1080',
  dataAiHint: 'female creator',
  baseFee: 250, // Example base fee
  videoFee: 99, // Example video fee
};

interface MaterialItem {
    id: number;
    name: string;
    quantity: string;
}

export default function OrderCreatorPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const creatorId = params.creatorId as string;
  const creator = mockCreator;

  const [projectDescription, setProjectDescription] = useState('');
  const [wantsVideo, setWantsVideo] = useState(false);
  const [wantsMaterials, setWantsMaterials] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('123, Learning Lane, Student City, 110011');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // New state for editable materials
  const [materials, setMaterials] = useState<MaterialItem[]>([
      { id: 1, name: 'A4 Chart Paper', quantity: '5' },
      { id: 2, name: 'Modeling Clay (12 colors)', quantity: '1 pack' },
  ]);

  const handleMaterialChange = (id: number, field: 'name' | 'quantity', value: string) => {
    setMaterials(prev => prev.map(mat => mat.id === id ? { ...mat, [field]: value } : mat));
  };
  
  const addMaterialRow = () => {
      setMaterials(prev => [...prev, { id: Date.now(), name: '', quantity: '1' }]);
  };

  const removeMaterialRow = (id: number) => {
      setMaterials(prev => prev.filter(mat => mat.id !== id));
  };

  // The cost of materials is complex to calculate on the frontend now,
  // so we'll show it as "To be calculated".
  const totalCost = creator.baseFee + (wantsVideo ? creator.videoFee : 0);

  const handlePlaceOrder = () => {
    if (!projectDescription.trim()) {
        toast({ title: "Project Description Needed", description: "Please describe the project you need.", variant: "destructive" });
        return;
    }
     toast({
        title: "Order Placed (Simulated)!",
        description: `Your request has been sent to ${creator.nameEn}. The final cost including materials will be confirmed.`,
    });
    router.push('/delivery'); // Redirect to a confirmation/tracking page
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
        <CardHeader><CardTitle className="flex items-center gap-2"><Package size={20}/> Materials & Add-ons</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <Label htmlFor="materials-switch" className="font-medium">OSO to deliver required materials to creator?</Label>
                <Switch id="materials-switch" checked={wantsMaterials} onCheckedChange={setWantsMaterials} />
            </div>
            {wantsMaterials && (
                <div className="p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg space-y-3">
                    <p className="text-xs text-muted-foreground">Specify the materials needed. OSO will procure and deliver them to the creator.</p>
                    <div className="space-y-2">
                        {materials.map((mat, index) => (
                           <div key={mat.id} className="flex items-center gap-2">
                               <Input 
                                   placeholder={`Material ${index + 1}`} 
                                   value={mat.name}
                                   onChange={(e) => handleMaterialChange(mat.id, 'name', e.target.value)}
                                   className="flex-grow"
                                />
                               <Input 
                                   placeholder="Qty" 
                                   value={mat.quantity}
                                   onChange={(e) => handleMaterialChange(mat.id, 'quantity', e.target.value)}
                                   className="w-24"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMaterialRow(mat.id)} className="text-destructive h-8 w-8">
                                    <Trash2 size={16}/>
                                </Button>
                           </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addMaterialRow} className="mt-2">
                        <PlusCircle size={16} className="mr-2"/> Add Material
                    </Button>
                </div>
            )}
             <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <Label htmlFor="video-switch" className="font-medium">Add explanation video by creator?</Label>
                <Switch id="video-switch" checked={wantsVideo} onCheckedChange={setWantsVideo} />
            </div>
            {wantsVideo && (
                <p className="text-sm text-primary p-2 bg-primary/10 rounded-lg text-center">An additional fee of <strong>INR {creator.videoFee}</strong> will be added for the explanation video.</p>
            )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><IndianRupee size={20}/> Payment Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Creator Fee:</span> <span className="font-medium">INR {creator.baseFee}</span></div>
            {wantsVideo && <div className="flex justify-between"><span>Explanation Video:</span> <span className="font-medium">INR {creator.videoFee}</span></div>}
            {wantsMaterials && <div className="flex justify-between"><span>Materials Cost:</span> <span className="font-medium">To be Calculated</span></div>}
            <hr/>
            <div className="flex justify-between text-lg font-bold text-primary"><span>Subtotal:</span> <span>INR {totalCost.toFixed(2)} + Materials</span></div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Proceed to Payment</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
