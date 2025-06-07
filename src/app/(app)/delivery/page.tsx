
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StationeryItemCard, type StationeryItem } from '@/components/delivery/StationeryItemCard';
import { OrderConfirmationDialog } from '@/components/delivery/OrderConfirmationDialog';
import { Search, Notebook, PenTool, Book, Package, ShoppingBag, Filter, Apple as AppleIcon } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';

const categories = [
  { id: 'all', nameEn: 'All', nameHi: 'सभी', icon: Package, key: 'all' },
  { id: 'notebooks', nameEn: 'Notebooks', nameHi: 'नोटबुक', icon: Notebook, key: 'notebook' },
  { id: 'pens', nameEn: 'Pens', nameHi: 'पेन', icon: PenTool, key: 'pen' },
  { id: 'books', nameEn: 'Books', nameHi: 'किताबें', icon: Book, key: 'book' },
  { id: 'kits', nameEn: 'Kits', nameHi: 'किट', icon: Package, key: 'kit' },
  { id: 'study_snacks', nameEn: 'Study Snacks', nameHi: 'स्टडी स्नैक्स', icon: AppleIcon, key: 'study_snack' },
];

const sampleItems: StationeryItem[] = [
  { id: '1', nameEn: 'Classmate Notebook', nameHi: 'क्लासमेट नोटबुक', price: 45, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "notebook school", categoryKey: "notebook" },
  { id: '2', nameEn: 'Cello Gripper Pen', nameHi: 'सेलो ग्रिपर पेन', price: 10, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Anil Book Store', vendorHi: 'अनिल बुक स्टोर', dataAiHint: "pen writing", categoryKey: "pen" },
  { id: '3', nameEn: 'NCERT Science Book', nameHi: 'एनसीईआरटी विज्ञान पुस्तक', price: 150, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Modern Books', vendorHi: 'मॉडर्न बुक्स', dataAiHint: "book science", categoryKey: "book" },
  { id: '4', nameEn: 'Geometry Box', nameHi: 'ज्यामिति बॉक्स', price: 80, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Student Needs', vendorHi: 'स्टूडेंट नीड्स', dataAiHint: "geometry kit", categoryKey: "kit" },
  { id: '5', nameEn: 'Apsara Pencil Pack', nameHi: 'अप्सरा पेंसिल पैक', price: 50, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "pencils drawing", categoryKey: "pen" }, 
  { id: '6', nameEn: 'Sketch Book Large', nameHi: 'स्केच बुक बड़ी', price: 120, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Art Corner', vendorHi: 'आर्ट कॉर्नर', dataAiHint: "sketchbook art", categoryKey: "notebook" }, 
  { id: 'snack1', nameEn: 'Roasted Almonds (100g)', nameHi: 'भुने हुए बादाम (100 ग्राम)', price: 90, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Healthy Bites', vendorHi: 'हेल्दी बाइट्स', dataAiHint: "almonds snack", categoryKey: "study_snack" },
  { id: 'snack2', nameEn: 'Fruit & Nut Bar', nameHi: 'फल और अखरोट बार', price: 35, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Energy Snacks Co.', vendorHi: 'एनर्जी स्नैक्स कंपनी', dataAiHint: "energy bar", categoryKey: "study_snack" },
  { id: 'snack3', nameEn: 'Dark Chocolate (Small)', nameHi: 'डार्क चॉकलेट (छोटी)', price: 50, imageUrl: 'https://placehold.co/300x225.png', vendorEn: 'Sweet Treats', vendorHi: 'स्वीट ट्रीट्स', dataAiHint: "chocolate bar", categoryKey: "study_snack" },
];

export default function DeliveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('all');
  const [cart, setCart] = useState<StationeryItem[]>([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const handleAddToCart = (item: StationeryItem) => {
    setCart((prevCart) => [...prevCart, item]);
    // Potentially show a toast message
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return; // Prevent placing empty order
    // Simulate order placement
    const newOrderId = `OSO${Math.floor(Math.random() * 90000) + 10000}`;
    setConfirmedOrderId(newOrderId);
    setIsOrderConfirmed(true);
    setCart([]); // Clear cart after order
  };

  const filteredItems = sampleItems.filter(item =>
    (item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || item.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategoryKey === 'all' || item.categoryKey === selectedCategoryKey)
  );
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">
            <BilingualText en="OSO Delivery" hi="OSO डिलीवरी" />
        </h1>
        <p className="text-muted-foreground">
            <BilingualText en="Stationery & books, delivered in 45 mins!" hi="स्टेशनरी और किताबें, 45 मिनट में डिलीवर!" />
        </p>
      </header>

      <div className="sticky top-0_override pt-2 pb-2 bg-background z-10 -mx-4 px-4"> 
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder_en="Search for notebooks, pens, books..."
            placeholder_hi="नोटबुक, पेन, किताबें खोजें..."
            className="pl-10 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryKey === category.key ? 'default' : 'outline'}
                size="sm"
                className="rounded-full px-4 py-2 h-auto text-sm"
                onClick={() => setSelectedCategoryKey(category.key)}
              >
                <category.icon className="mr-2 h-4 w-4" />
                <BilingualText en={category.nameEn} hi={category.nameHi} separator=" " hiClassName="hidden sm:inline"/>
              </Button>
            ))}
             <Button variant="ghost" size="icon" className="rounded-full">
                <Filter className="h-5 w-5"/>
                <span className="sr-only"><BilingualText en="Filter" hi="फ़िल्टर"/></span>
             </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>


      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <StationeryItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground"><BilingualText en="No items found for your search." hi="आपकी खोज के लिए कोई आइटम नहीं मिला।" /></p>
        </div>
      )}

      {cart.length > 0 && (
        <Card className="fixed bottom-16_override md:bottom-0 left-0 right-0_override mx-auto max-w-3xl_override shadow-2xl_override rounded-t-lg md:rounded-lg border-t md:border z-40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold"><BilingualText en={`${cart.length} items`} hi={`${cart.length} आइटम`} /> </p>
              <p className="text-lg font-bold text-primary">₹{cartTotal.toFixed(2)}</p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handlePlaceOrder}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              <BilingualText en="Place Order" hi="ऑर्डर दें" />
            </Button>
          </CardContent>
        </Card>
      )}
      
      <OrderConfirmationDialog 
        isOpen={isOrderConfirmed} 
        onClose={() => setIsOrderConfirmed(false)}
        orderId={confirmedOrderId}
      />

    </div>
  );
}
