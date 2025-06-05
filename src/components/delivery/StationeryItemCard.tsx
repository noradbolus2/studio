import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BilingualText } from '../shared/BilingualText';

export interface StationeryItem {
  id: string;
  nameEn: string;
  nameHi: string;
  price: number;
  imageUrl: string;
  vendorEn: string;
  vendorHi: string;
  dataAiHint?: string;
}

interface StationeryItemCardProps {
  item: StationeryItem;
  onAddToCart: (item: StationeryItem) => void;
}

export function StationeryItemCard({ item, onAddToCart }: StationeryItemCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow w-full">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Image 
            src={item.imageUrl} 
            alt={item.nameEn} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={item.dataAiHint || "stationery item"}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        <CardTitle className="text-md font-semibold leading-tight">
          <BilingualText en={item.nameEn} hi={item.nameHi} />
        </CardTitle>
        <p className="text-xs text-muted-foreground">
            <BilingualText en={`By ${item.vendorEn}`} hi={`${item.vendorHi} द्वारा`} />
        </p>
        <p className="text-sm font-bold text-primary">₹{item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onAddToCart(item)}>
          <PlusCircle size={16} className="mr-2" />
          <BilingualText en="Add to Cart" hi="कार्ट में डालें" />
        </Button>
      </CardFooter>
    </Card>
  );
}
