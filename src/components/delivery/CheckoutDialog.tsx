
"use client";

import { useState } from 'react'; // Added this line
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, MapPin, Tag, CreditCard, ChevronDown } from "lucide-react";
import { BilingualText } from "../shared/BilingualText";
import type { StationeryItem } from "./StationeryItemCard";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: StationeryItem[];
  cartTotal: number;
  onConfirmOrder: (details: { address: string; coupon?: string; items: StationeryItem[] }) => void;
}

// Mock saved addresses
const savedAddresses = [
  { id: "home", labelEn: "Home - 123 Main St, Anytown", labelHi: "घर - 123 मेन स्ट्रीट, एनीटाउन", value: "123 Main St, Anytown" },
  { id: "work", labelEn: "Work - 456 Business Ave, Anytown", labelHi: "कार्य - 456 बिजनेस एवेन्यू, एनीटाउन", value: "456 Business Ave, Anytown" },
  { id: "school", labelEn: "School - 789 Learning Rd, Anytown", labelHi: "स्कूल - 789 लर्निंग रोड, एनीटाउन", value: "789 Learning Rd, Anytown" },
];

export function CheckoutDialog({ isOpen, onClose, cartItems, cartTotal, onConfirmOrder }: CheckoutDialogProps) {
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]?.value || "");
  const [couponCode, setCouponCode] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const handleAddressChange = (value: string) => {
    if (value === "add_new") {
        setIsAddingNewAddress(true);
        setSelectedAddress(""); 
    } else {
        setIsAddingNewAddress(false);
        setSelectedAddress(value);
        setCustomAddress(""); // Clear custom address if a saved one is selected
    }
  };
  
  const finalAddress = isAddingNewAddress ? customAddress : selectedAddress;

  const handleSubmit = () => {
    if (!finalAddress.trim()) {
        // In a real app, you'd use a toast here
        alert("Please select or enter a delivery address.");
        return;
    }
    onConfirmOrder({ address: finalAddress, coupon: couponCode, items: cartItems });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-headline flex items-center gap-2">
            <CreditCard className="text-primary h-6 w-6"/>
            <BilingualText en="Confirm Your Order" hi="अपने ऑर्डर की पुष्टि करें" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <BilingualText en="Review your items, select delivery address, and apply coupon if any." hi="अपने आइटम की समीक्षा करें, डिलीवरी पता चुनें, और यदि कोई हो तो कूपन लागू करें।" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="address" className="font-semibold flex items-center gap-1.5"><MapPin size={16}/> <BilingualText en="Delivery Address" hi="डिलीवरी पता" /></Label>
            <Select onValueChange={handleAddressChange} defaultValue={selectedAddress || (savedAddresses.length > 0 ? savedAddresses[0].value : "")}>
              <SelectTrigger id="address" className="mt-1">
                <SelectValue placeholder={<BilingualText en="Select an address" hi="एक पता चुनें" />} />
              </SelectTrigger>
              <SelectContent>
                {savedAddresses.map(addr => (
                  <SelectItem key={addr.id} value={addr.value}>
                    <BilingualText en={addr.labelEn} hi={addr.labelHi} />
                  </SelectItem>
                ))}
                <SelectItem value="add_new"><BilingualText en="Add New Address..." hi="नया पता जोड़ें..."/></SelectItem>
              </SelectContent>
            </Select>
            {isAddingNewAddress && (
                <Input 
                    type="text" 
                    placeholder_en="Enter new address" 
                    placeholder_hi="नया पता दर्ज करें" 
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="mt-2"
                />
            )}
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

          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium mb-1"><BilingualText en="Order Summary" hi="ऑर्डर सारांश" /></h4>
            <p className="text-xs"><BilingualText en={`${cartItems.length} items`} hi={`${cartItems.length} आइटम`} /></p>
            <p className="text-sm font-semibold text-primary">
              <BilingualText en="Total: INR " hi="कुल: INR " />{cartTotal.toFixed(2)}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0 pt-2">
          <AlertDialogAction asChild>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit} disabled={!finalAddress.trim()}>
              <BilingualText en="Confirm & Place Order" hi="पुष्टि करें और ऑर्डर दें" />
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full" onClick={onClose}>
              <BilingualText en="Cancel" hi="रद्द करें" />
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
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
