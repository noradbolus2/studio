
// src/app/(app)/coaching-panel/promotions/page.tsx
"use client";
import { useState } from "react";
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BadgePercent, PlusCircle, Edit, Trash2, Gift, Tag, Star, Share2, Timer, Image as ImageIcon, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { GeneratePosterDialog } from "@/components/coaching/GeneratePosterDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


interface PromoCode {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  status: "Active" | "Expired" | "Inactive";
  usageCount: number;
}

const mockPromoCodes: PromoCode[] = [
  { id: "PC001", code: "WELCOME50", type: "Fixed Amount", value: 50, status: "Active", usageCount: 120 },
  { id: "PC002", code: "NEET2025", type: "Percentage", value: 10, status: "Active", usageCount: 45 },
  { id: "PC003", code: "DIWALI20", type: "Percentage", value: 20, status: "Expired", usageCount: 500 },
];

interface AutoDiscount {
  id: string;
  description: string;
  type: "Quantity" | "Combo";
  status: "Active" | "Inactive";
}

const mockAutoDiscounts: AutoDiscount[] = [
    { id: "AD001", description: "Buy 3 Pens, Get INR 5 Off", type: "Quantity", status: "Active" },
    { id: "AD002", description: "Class 10 Kit (Maths + Science book)", type: "Combo", status: "Active" },
    { id: "AD003", description: "Any 5 Notebooks, 10% Off", type: "Quantity", status: "Inactive" },
];


export default function PromotionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPosterDialogOpen, setIsPosterDialogOpen] = useState(false);
  const [promos, setPromos] = useState<PromoCode[]>(mockPromoCodes);
  const [autoDiscounts, setAutoDiscounts] = useState<AutoDiscount[]>(mockAutoDiscounts);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <BadgePercent className="h-7 w-7 text-primary" />
            <BilingualText en="Promotions & Loyalty" hi="प्रचार और वफादारी" />
          </h1>
          <Button variant="outline" onClick={() => router.push('/coaching-panel')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back to Dashboard" hi="डैशबोर्ड पर वापस" />
          </Button>
        </div>

        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Share2/> Share & Promote</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => setIsPosterDialogOpen(true)}>
                  <ImageIcon className="h-5 w-5"/> 
                  <div>
                    <p>Generate Course Poster</p>
                    <p className="text-xs text-muted-foreground text-left">Create a shareable poster with AI.</p>
                  </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => toast({title: "Coming Soon!", description: "WhatsApp share link copied to clipboard."})}>
                  <MessageSquare className="h-5 w-5 text-green-500"/>
                  <div>
                    <p>Share on WhatsApp</p>
                    <p className="text-xs text-muted-foreground text-left">Quickly share your course link.</p>
                  </div>
              </Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle><BilingualText en="Promo Codes" hi="प्रोमो कोड" /></CardTitle>
                <CardDescription><BilingualText en="Manage discount codes for your customers." hi="अपने ग्राहकों के लिए डिस्काउंट कोड प्रबंधित करें।" /></CardDescription>
              </div>
              <Button onClick={() => toast({title: "Coming Soon!", description: "A dialog to create new promo codes will be added here."})}>
                  <PlusCircle className="mr-2 h-4 w-4"/> Create Code
              </Button>
          </CardHeader>
          <CardContent>
              <div className="rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Code</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Usage</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {promos.map(promo => (
                              <TableRow key={promo.id}>
                                  <TableCell className="font-mono font-semibold">{promo.code}</TableCell>
                                  <TableCell>{promo.type}</TableCell>
                                  <TableCell>{promo.type === "Percentage" ? `${promo.value}%` : `INR ${promo.value}`}</TableCell>
                                  <TableCell>{promo.usageCount}</TableCell>
                                  <TableCell>
                                      <Badge variant={promo.status === 'Active' ? 'default' : 'outline'} className={promo.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
                                          {promo.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-right space-x-1">
                                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4"/></Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle><BilingualText en="Automatic Discounts" hi="स्वचालित छूट" /></CardTitle>
                <CardDescription><BilingualText en="Set up quantity or combo-based discounts that apply automatically." hi="मात्रा या कॉम्बो-आधारित छूट सेट करें जो स्वचालित रूप से लागू होती हैं।" /></CardDescription>
              </div>
              <Button onClick={() => toast({title: "Coming Soon!", description: "A dialog to create new discount rules will be added here."})}>
                  <PlusCircle className="mr-2 h-4 w-4"/> Create Rule
              </Button>
          </CardHeader>
          <CardContent>
              <div className="rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {autoDiscounts.map(discount => (
                              <TableRow key={discount.id}>
                                  <TableCell className="font-medium">{discount.description}</TableCell>
                                  <TableCell>{discount.type}</TableCell>
                                  <TableCell>
                                      <Badge variant={discount.status === 'Active' ? 'default' : 'outline'} className={discount.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
                                          {discount.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-right space-x-1">
                                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4"/></Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gift/> Loyalty Program</CardTitle>
              <CardDescription>Reward your repeat customers and encourage referrals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <Label htmlFor="loyalty-switch" className="font-medium">Enable OSO Loyalty Program</Label>
                  <Switch id="loyalty-switch" checked={loyaltyEnabled} onCheckedChange={setLoyaltyEnabled} />
              </div>
              {loyaltyEnabled && (
                  <div className="space-y-2 text-sm text-muted-foreground p-3">
                      <p>✓ After 3 orders, automatically send a "1 Free Pen" coupon.</p>
                      <p>✓ After 5 orders, offer a 10% discount on the next purchase.</p>
                      <p>✓ Generate unique referral codes for customers to share.</p>
                      <Button variant="link" className="p-0 h-auto">Configure Loyalty Rules</Button>
                  </div>
              )}
          </CardContent>
        </Card>
      </div>
      <GeneratePosterDialog isOpen={isPosterDialogOpen} onOpenChange={setIsPosterDialogOpen} />
    </>
  );
}

