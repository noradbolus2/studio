"use client";

import { useState, type ChangeEvent, useMemo } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { StationeryItem } from '@/components/delivery/StationeryItemCard';
import { cn } from '@/lib/utils';


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

// Mock stationery data (normally from a shared file/API)
const stationeryCategories = [
  { id: 'all', nameEn: 'All', nameHi: 'सभी' },
  { id: 'notebooks', nameEn: 'Notebooks', nameHi: 'नोटबुक' },
  { id: 'writing', nameEn: 'Writing', nameHi: 'लेखन' },
  { id: 'art', nameEn: 'Art & Craft', nameHi: 'कला और शिल्प' },
];
const allStationeryItems: (StationeryItem & { category: string })[] = [
  { id: 'nb1', nameEn: 'Classmate Notebook', nameHi: 'क्लासमेट नोटबुक', price: 45, vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', category: 'notebooks', imageUrl: 'https://placehold.co/100x100.png', dataAiHint:'notebook' },
  { id: 'pen1', nameEn: 'Cello Gripper Pen', nameHi: 'सेलो ग्रिपर पेन', price: 10, vendorEn: 'Anil Store', vendorHi: 'अनिल स्टोर', category: 'writing', imageUrl: 'https://placehold.co/100x100.png', dataAiHint:'pen' },
  { id: 'art1', nameEn: 'Modeling Clay', nameHi: 'मॉडलिंग क्ले', price: 100, vendorEn: 'Hobby Hub', vendorHi: 'हॉबी हब', category: 'art', imageUrl: 'https://placehold.co/100x100.png', dataAiHint:'clay art' },
  { id: 'art2', nameEn: 'A4 Chart Paper', nameHi: 'A4 चार्ट पेपर', price: 5, vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', category: 'art', imageUrl: 'https://placehold.co/100x100.png', dataAiHint:'chart paper' },
  { id: 'art3', nameEn: 'Acrylic Paints', nameHi: 'एक्रिलिक पेंट', price: 120, vendorEn: 'Hobby Hub', vendorHi: 'हॉबी हब', category: 'art', imageUrl: 'https://placehold.co/100x100.png', dataAiHint:'paints' },
];

interface SelectedMaterial extends StationeryItem {
    quantity: number;
}

function StationeryPickerDialog({ open, onOpenChange, onSelectItems }: { open: boolean; onOpenChange: (open: boolean) => void; onSelectItems: (items: SelectedMaterial[]) => void; }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedItems, setSelectedItems] = useState<Map<string, SelectedMaterial>>(new Map());

    const filteredItems = useMemo(() => allStationeryItems.filter(item => 
        (item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || item.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
    ), [searchTerm, selectedCategory]);

    const handleToggleItem = (item: StationeryItem) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (newMap.has(item.id)) {
                newMap.delete(item.id);
            } else {
                newMap.set(item.id, { ...item, quantity: 1 });
            }
            return newMap;
        });
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            const item = newMap.get(itemId);
            if(item) {
                newMap.set(itemId, { ...item, quantity: newQuantity });
            }
            return newMap;
        });
    }
    
    const handleConfirmSelection = () => {
        onSelectItems(Array.from(selectedItems.values()));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Materials from OSO Store</DialogTitle>
                    <DialogDescription>Browse and add required materials to your project request.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search materials..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{stationeryCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.nameEn}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <ScrollArea className="flex-grow border rounded-md p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredItems.map(item => (
                            <Card key={item.id} className={cn("cursor-pointer transition-all", selectedItems.has(item.id) && "ring-2 ring-primary border-primary")} onClick={() => handleToggleItem(item)}>
                                <div className="aspect-square relative"><Image src={item.imageUrl || ''} alt={item.nameEn} layout="fill" objectFit="cover" className="rounded-t-md p-2"/></div>
                                <div className="p-2 text-xs"><p className="font-semibold line-clamp-2">{item.nameEn}</p><p className="text-primary font-bold">₹{item.price}</p></div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter className="flex-col sm:flex-row justify-between items-stretch sm:items-center pt-2 border-t">
                    <div className="text-sm">
                        <span className="font-semibold">{selectedItems.size}</span> items selected
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleConfirmSelection} disabled={selectedItems.size === 0}>Add to Request</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
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
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  
  const handleMaterialQuantityChange = (itemId: string, newQuantity: number) => {
    if(newQuantity < 1) return;
    setMaterials(prev => prev.map(m => m.id === itemId ? { ...m, quantity: newQuantity } : m));
  };
  
  const handleRemoveMaterial = (itemId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== itemId));
  };
  
  const handleAddMaterialsFromStore = (items: SelectedMaterial[]) => {
      setMaterials(prev => {
          const newItemsMap = new Map(prev.map(item => [item.id, item]));
          items.forEach(newItem => {
              newItemsMap.set(newItem.id, newItem);
          });
          return Array.from(newItemsMap.values());
      });
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
        <CardHeader><CardTitle className="flex items-center gap-2"><Package size={20}/> Materials & Add-ons</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Required Materials:</p>
                {materials.length > 0 ? (
                    <div className="space-y-2">
                        {materials.map(mat => (
                            <div key={mat.id} className="flex items-center gap-2 text-sm p-2 bg-background rounded-md">
                                <Image src={mat.imageUrl || ''} alt={mat.nameEn} width={32} height={32} className="rounded object-cover"/>
                                <span className="flex-grow font-medium">{mat.nameEn}</span>
                                <Input type="number" value={mat.quantity} onChange={(e) => handleMaterialQuantityChange(mat.id, parseInt(e.target.value))} className="w-16 h-8 text-center" min="1"/>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveMaterial(mat.id)}><X size={16}/></Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No materials added yet.</p>
                )}
                 <Button type="button" variant="secondary" onClick={() => setIsMaterialPickerOpen(true)} className="w-full mt-3">
                    <PlusCircle size={16} className="mr-2"/> Browse & Add Materials
                </Button>
            </div>

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
            <div className="flex justify-between"><span>Creator Fee:</span> <span className="font-medium">INR {creator.baseFee.toFixed(2)}</span></div>
            {wantsVideo && <div className="flex justify-between"><span>Explanation Video:</span> <span className="font-medium">INR {creator.videoFee.toFixed(2)}</span></div>}
            {materialsCost > 0 && <div className="flex justify-between"><span>Materials Cost:</span> <span className="font-medium">INR {materialsCost.toFixed(2)}</span></div>}
            <hr/>
            <div className="flex justify-between text-lg font-bold text-primary"><span>Subtotal:</span> <span>INR {totalCost.toFixed(2)}</span></div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Proceed to Payment</Button>
        </CardFooter>
      </Card>

      <StationeryPickerDialog open={isMaterialPickerOpen} onOpenChange={setIsMaterialPickerOpen} onSelectItems={handleAddMaterialsFromStore} />

    </div>
  );
}

