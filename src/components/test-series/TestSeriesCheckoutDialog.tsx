
"use client";

import { useState } from 'react'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, CreditCard, Loader2, Tag } from "lucide-react";
import { BilingualText } from "../shared/BilingualText";
import { LoadingSpinner } from '../shared/LoadingSpinner';

export interface FeaturedTest {
  id: string;
  categoryId: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  price: string;
  generationTitleEn?: string;
  defaultNumQuestions?: number;
}

interface TestSeriesCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testPack: FeaturedTest | null;
  onConfirmPurchase: () => void;
}

type CheckoutStep = 'details' | 'processing' | 'success';

export function TestSeriesCheckoutDialog({ isOpen, onClose, testPack, onConfirmPurchase }: TestSeriesCheckoutDialogProps) {
  const [couponCode, setCouponCode] = useState("");
  const [step, setStep] = useState<CheckoutStep>('details');
  
  if (!testPack) return null;

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onConfirmPurchase();
            setStep('details'); 
        }, 1500);
    }, 2000);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center space-y-3 h-48">
            <LoadingSpinner size={40}/>
            <p className="text-muted-foreground"><BilingualText en="Processing Payment..." hi="भुगतान संसाधित हो रहा है..." /></p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center space-y-3 h-48">
            <CheckCircle className="h-16 w-16 text-green-500"/>
            <p className="font-semibold text-lg"><BilingualText en="Purchase Successful!" hi="खरीद सफल!" /></p>
            <p className="text-muted-foreground text-sm"><BilingualText en="Your test series is now available." hi="आपकी टेस्ट सीरीज़ अब उपलब्ध है।" /></p>
          </div>
        );
      case 'details':
      default:
        return (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-headline flex items-center gap-2">
                <CreditCard className="text-primary h-6 w-6"/>
                <BilingualText en="Confirm Purchase" hi="खरीद की पुष्टि करें" />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <BilingualText en="Review your test series purchase before payment." hi="भुगतान से पहले अपनी टेस्ट सीरीज़ खरीद की समीक्षा करें।" />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 my-4">
               <div className="p-3 bg-muted/50 rounded-md">
                <h4 className="text-sm font-medium mb-1"><BilingualText en="Selected Pack" hi="चयनित पैक" /></h4>
                <p className="font-semibold text-primary"><BilingualText en={testPack.titleEn} hi={testPack.titleHi} /></p>
                <p className="text-sm font-bold mt-1">
                  <BilingualText en="Total: " hi="कुल: " />{testPack.price}
                </p>
              </div>
              <div>
                <Label htmlFor="coupon" className="font-semibold flex items-center gap-1.5"><Tag size={16}/> <BilingualText en="Coupon Code (Optional)" hi="कूपन कोड (वैकल्पिक)" /></Label>
                <Input 
                  id="coupon" 
                  placeholder_en="Enter coupon code" 
                  placeholder_hi="कूपन कोड दर्ज करें" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="mt-1" 
                />
              </div>
            </div>
            <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0 pt-2">
              <AlertDialogAction asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit}>
                  <BilingualText en={`Pay ${testPack.price}`} hi={`${testPack.price} का भुगतान करें`} />
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  <BilingualText en="Cancel" hi="रद्द करें" />
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setStep('details'); }}}>
      <AlertDialogContent className="max-w-sm">
        {renderContent()}
      </AlertDialogContent>
    </AlertDialog>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
