
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StationeryItemCard, type StationeryItem } from '@/components/delivery/StationeryItemCard'; 
import { CheckoutDialog } from '@/components/delivery/CheckoutDialog';
import { OrderConfirmationDialog } from '@/components/delivery/OrderConfirmationDialog';
import { Search, Notebook, PenTool, Book, Package, ShoppingBag, Filter, Apple as AppleIcon, StickyNote, FolderOpen, Palette, Ruler, Scissors, ArrowLeft } from 'lucide-react';
import { BilingualText } from '@/components/shared/BilingualText';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import type { ProfileFormData } from '../edit-profile/page'; 

// Import the vendor order type
interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}
interface VendorOrder {
  id: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  isPriority?: boolean; // Added for priority orders
}

const VENDOR_ORDERS_KEY = "vendorOrders_mock";

const categories = [
  { id: 'all', nameEn: 'All', nameHi: 'सभी', icon: Package, key: 'all' },
  { id: 'notebooks', nameEn: 'Notebooks', nameHi: 'नोटबुक', icon: Notebook, key: 'notebook' },
  { id: 'pens_pencils', nameEn: 'Writing', nameHi: 'लेखन सामग्री', icon: PenTool, key: 'writing_instrument' },
  { id: 'books_guides', nameEn: 'Ref. Books', nameHi: 'संदर्भ पुस्तकें', icon: Book, key: 'reference_book' },
  { id: 'art_craft', nameEn: 'Art & Craft', nameHi: 'कला और शिल्प', icon: Palette, key: 'art_craft' },
  { id: 'desk_organizers', nameEn: 'Desk Org.', nameHi: 'डेस्क सहायक', icon: FolderOpen, key: 'desk_organizer' },
  { id: 'geometry_tools', nameEn: 'Tools', nameHi: 'उपकरण', icon: Ruler, key: 'geometry_tool' },
  { id: 'study_snacks', nameEn: 'Study Snacks', nameHi: 'स्टडी स्नैक्स', icon: AppleIcon, key: 'study_snack' },
];

const sampleItems: StationeryItem[] = [
  // Notebooks
  { id: 'nb1', nameEn: 'Classmate Notebook (Single Line)', nameHi: 'क्लासमेट नोटबुक (एक पंक्ति)', price: 45, imageUrl: 'https://images.unsplash.com/photo-1724915672493-941a6cd2d6a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHNjaG9vbHxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "notebook school", categoryKey: "notebook" },
  { id: 'nb2', nameEn: 'Spiral Notebook (A4 Size)', nameHi: 'स्पाइरल नोटबुक (A4 आकार)', price: 70, imageUrl: 'https://images.unsplash.com/photo-1717726974171-5da822f4c6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3BpcmFsJTIwbm90ZWJvb2t8ZW58MHx8fHwxNzUxNDkwNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080', vendorEn: 'Student Needs', vendorHi: 'स्टूडेंट नीड्स', dataAiHint: "spiral notebook", categoryKey: "notebook" },
  { id: 'nb3', nameEn: 'Pocket Diary (Small)', nameHi: 'पॉकेट डायरी (छोटी)', price: 30, imageUrl: 'https://images.unsplash.com/photo-1640799368806-0b4a4ae27e2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwb2NrZXQlMjBkaWFyeXxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', vendorEn: 'Anil Book Store', vendorHi: 'अनिल बुक स्टोर', dataAiHint: "pocket diary", categoryKey: "notebook" },
  { id: 'nb4', nameEn: 'Graph Book (Standard)', nameHi: 'ग्राफ बुक (मानक)', price: 35, imageUrl: 'https://images.unsplash.com/photo-1542216172-f356fdd22653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmFwaCUyMHBhcGVyfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Modern Books', vendorHi: 'मॉडर्न बुक्स', dataAiHint: "graph paper", categoryKey: "notebook" },
  { id: 'nb5', nameEn: 'Unruled Plain Notebook', nameHi: 'बिना लाइन वाली सादी नोटबुक', price: 40, imageUrl: 'https://images.unsplash.com/photo-1520871942340-42898ab9167f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMG5vdGVib29rfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "plain notebook", categoryKey: "notebook" },
  { id: 'nb6', nameEn: 'Sketch Book (Large)', nameHi: 'स्केच बुक (बड़ी)', price: 120, imageUrl: 'https://images.unsplash.com/photo-1727812100126-efcb3fbd26ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxza2V0Y2hib29rJTIwYXJ0fGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Art Corner', vendorHi: 'आर्ट कॉर्नर', dataAiHint: "sketchbook art", categoryKey: "notebook" },
  
  // Writing Instruments
  { id: 'pen1', nameEn: 'Cello Gripper Ball Pen (Blue)', nameHi: 'सेलो ग्रिपर बॉल पेन (नीला)', price: 10, imageUrl: 'https://images.unsplash.com/photo-1643029184678-31017fa169d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Ymx1ZSUyMHBlbnxlbnwwfHx8fDE3NTE0OTA3MjF8MA&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Anil Book Store', vendorHi: 'अनिल बुक स्टोर', dataAiHint: "blue pen", categoryKey: "writing_instrument" },
  { id: 'pen2', nameEn: 'Apsara Platinum Pencil Pack (10s)', nameHi: 'अप्सरा प्लैटिनम पेंसिल पैक (10 पीस)', price: 50, imageUrl: 'https://images.unsplash.com/photo-1590521611189-5bbc436a26ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZW5jaWxzJTIwZHJhd2luZ3xlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "pencils drawing", categoryKey: "writing_instrument" }, 
  { id: 'pen3', nameEn: 'Gel Pen Set (Assorted Colors, 5 Pack)', nameHi: 'जेल पेन सेट (विभिन्न रंग, 5 का पैक)', price: 75, imageUrl: 'https://images.unsplash.com/photo-1648522066365-f240aaa0cd7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Z2VsJTIwcGVuc3xlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Student Needs', vendorHi: 'स्टूडेंट नीड्स', dataAiHint: "gel pens", categoryKey: "writing_instrument" },
  { id: 'pen4', nameEn: 'Highlighter Pens (Set of 4)', nameHi: 'हाइलाइटर पेन (4 का सेट)', price: 60, imageUrl: 'https://images.unsplash.com/photo-1641212443047-d7f35fd5eb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoaWdobGlnaHRlcnMlMjBzdHVkeXxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Modern Books', vendorHi: 'मॉडर्न बुक्स', dataAiHint: "highlighters study", categoryKey: "writing_instrument" },
  { id: 'pen5', nameEn: 'Mechanical Pencil (0.7mm) with Leads', nameHi: 'मैकेनिकल पेंसिल (0.7मिमी) लीड्स के साथ', price: 40, imageUrl: 'https://images.unsplash.com/photo-1727812100173-b33044cd3071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtZWNoYW5pY2FsJTIwcGVuY2lsfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib-rb-4.1.0&q=80&w=1080', vendorEn: 'Anil Book Store', vendorHi: 'अनिल बुक स्टोर', dataAiHint: "mechanical pencil", categoryKey: "writing_instrument" },

  // Reference Books (quick guides, not full textbooks)
  { id: 'book1', nameEn: 'NCERT Science Book (Class 8)', nameHi: 'एनसीईआरटी विज्ञान पुस्तक (कक्षा 8)', price: 150, imageUrl: 'https://images.unsplash.com/photo-1725870976697-938e9fdc012b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzY2llbmNlJTIwdGV4dGJvb2t8ZW58MHx8fHwxNzUxNDkwNzIxfDA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Modern Books', vendorHi: 'मॉडर्न बुक्स', dataAiHint: "science textbook", categoryKey: "reference_book" },
  { id: 'book2', nameEn: 'Student Atlas (India & World)', nameHi: 'छात्र एटलस (भारत और विश्व)', price: 120, imageUrl: 'https://images.unsplash.com/photo-1614728672820-e88260ce6d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhdGxhcyUyMG1hcHxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Book World', vendorHi: 'बुक वर्ल्ड', dataAiHint: "atlas map", categoryKey: "reference_book" },
  { id: 'book3', nameEn: 'Quick English Grammar Guide', nameHi: 'त्वरित अंग्रेजी व्याकरण गाइड', price: 90, imageUrl: 'https://images.unsplash.com/photo-1549293507-1f38ee0b2e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxncmFtbWFyJTIwYm9va3xlbnwwfHx8fDE3NTE0OTA3MjF8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Learners Point', vendorHi: 'लर्नर्स पॉइंट', dataAiHint: "grammar book", categoryKey: "reference_book" },

  // Art & Craft
  { id: 'art1', nameEn: 'Drawing Color Pencils (24 Shades)', nameHi: 'ड्राइंग कलर पेंसिल (24 शेड)', price: 150, imageUrl: 'https://images.unsplash.com/photo-1609126788187-323a73f38a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxjb2xvciUyMHBlbmNpbHN8ZW58MHx8fHwxNzUxNDkwNzIwfDA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Art Corner', vendorHi: 'आर्ट कॉर्नर', dataAiHint: "color pencils", categoryKey: "art_craft" },
  { id: 'art2', nameEn: 'Craft Paper A4 (Assorted Colors, 50 Sheets)', nameHi: 'क्राफ्ट पेपर A4 (विभिन्न रंग, 50 शीट)', price: 80, imageUrl: 'https://images.unsplash.com/photo-1659166925474-1706ba9546e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjcmFmdCUyMHBhcGVyfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Hobby Hub', vendorHi: 'हॉबी हब', dataAiHint: "craft paper", categoryKey: "art_craft" },
  { id: 'art3', nameEn: 'Modeling Clay (12 Colors)', nameHi: 'मॉडलिंग क्ले (12 रंग)', price: 100, imageUrl: 'https://images.unsplash.com/photo-1560427450-4aa993c4c6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2RlbGluZyUyMGNsYXl8ZW58MHx8fHwxNzUxNDkwNzIxfDA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Art Corner', vendorHi: 'आर्ट कॉर्नर', dataAiHint: "modeling clay", categoryKey: "art_craft" },
  { id: 'art4', nameEn: 'Water Color Tubes (Set of 12)', nameHi: 'वॉटर कलर ट्यूब्स (12 का सेट)', price: 130, imageUrl: 'https://images.unsplash.com/photo-1695151841116-a9372573053b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3YXRlciUyMGNvbG9yc3xlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Art Corner', vendorHi: 'आर्ट कॉर्नर', dataAiHint: "water colors", categoryKey: "art_craft" },

  // Desk Organizers
  { id: 'desk1', nameEn: 'Pen Stand (Mesh Metal)', nameHi: 'पेन स्टैंड (मेश मेटल)', price: 90, imageUrl: 'https://images.unsplash.com/photo-1627629720935-06d2147f3e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZW4lMjBzdGFuZHxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Office Needs', vendorHi: 'ऑफिस नीड्स', dataAiHint: "pen stand", categoryKey: "desk_organizer" },
  { id: 'desk2', nameEn: 'Sticky Notes Pad (3x3 inch, Yellow)', nameHi: 'स्टिकी नोट्स पैड (3x3 इंच, पीला)', price: 25, imageUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzdGlja3klMjBub3Rlc3xlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Student Needs', vendorHi: 'स्टूडेंट नीड्स', dataAiHint: "sticky notes", categoryKey: "desk_organizer" },
  { id: 'desk3', nameEn: 'Document File Folder (Plastic)', nameHi: 'दस्तावेज़ फ़ाइल फ़ोल्डर (प्लास्टिक)', price: 35, imageUrl: 'https://images.unsplash.com/photo-1557487307-2ca7e1c153d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmaWxlJTIwZm9sZGVyfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Anil Book Store', vendorHi: 'अनिल बुक स्टोर', dataAiHint: "file folder", categoryKey: "desk_organizer" },

  // Geometry Tools
  { id: 'geo1', nameEn: 'Geometry Box (Full Set)', nameHi: 'ज्यामिति बॉक्स (पूरा सेट)', price: 80, imageUrl: 'https://images.unsplash.com/photo-1727522974614-b592018e49e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxnZW9tZXRyeSUyMGtpdHxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Student Needs', vendorHi: 'स्टूडेंट नीड्स', dataAiHint: "geometry kit", categoryKey: "geometry_tool" },
  { id: 'geo2', nameEn: 'Plastic Ruler (30cm)', nameHi: 'प्लास्टिक रूलर (30सेमी)', price: 15, imageUrl: 'https://images.unsplash.com/photo-1662137263017-61395f6b6213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cnVsZXIlMjBzY2FsZXxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Gupta Stationery', vendorHi: 'गुप्ता स्टेशनरी', dataAiHint: "ruler scale", categoryKey: "geometry_tool" },
  { id: 'geo3', nameEn: 'Student Scissors (Small)', nameHi: 'छात्र कैंची (छोटी)', price: 30, imageUrl: 'https://images.unsplash.com/photo-1596518432939-479596b448b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzY2lzc29ycyUyMGNyYWZ0fGVufDB8fHx8MTc1MTQ5MDcyMXww&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Hobby Hub', vendorHi: 'हॉबी हब', dataAiHint: "scissors craft", categoryKey: "geometry_tool" },

  // Study Snacks
  { id: 'snack1', nameEn: 'Roasted Almonds (100g)', nameHi: 'भुने हुए बादाम (100 ग्राम)', price: 90, imageUrl: 'https://images.unsplash.com/photo-1612031337676-3981ffa2a1a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxhbG1vbmRzJTIwc25hY2t8ZW58MHx8fHwxNzUxNDkwNzIwfDA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Healthy Bites', vendorHi: 'हेल्दी बाइट्स', dataAiHint: "almonds snack", categoryKey: "study_snack" },
  { id: 'snack2', nameEn: 'Fruit & Nut Bar', nameHi: 'फल और अखरोट बार', price: 35, imageUrl: 'https://images.unsplash.com/photo-1629214831802-bb2a07f9517e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxlbmVyZ3klMjBiYXJ8ZW58MHx8fHwxNzUxNDkwNzIwfDA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Energy Snacks Co.', vendorHi: 'एनर्जी स्नैक्स कंपनी', dataAiHint: "energy bar", categoryKey: "study_snack" },
  { id: 'snack3', nameEn: 'Dark Chocolate (Small)', nameHi: 'डार्क चॉकलेट (छोटी)', price: 50, imageUrl: 'https://images.unsplash.com/photo-1646303339019-a57056b180ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2hvY29sYXRlJTIwYmFyfGVufDB8fHx8MTc1MTQ5MDcyMHww&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Sweet Treats', vendorHi: 'स्वीट ट्रीट्स', dataAiHint: "chocolate bar", categoryKey: "study_snack" },
  { id: 'snack4', nameEn: 'Trail Mix (Student Pack, 50g)', nameHi: 'ट्रेल मिक्स (छात्र पैक, 50 ग्राम)', price: 40, imageUrl: 'https://images.unsplash.com/photo-1599933595372-bb876160e63b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx0cmFpbCUyMG1peHxlbnwwfHx8fDE3NTE0OTA3MjB8MA&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Healthy Bites', vendorHi: 'हेल्दी बाइट्स', dataAiHint: "trail mix", categoryKey: "study_snack" },
  { id: 'snack5', nameEn: 'Digestive Biscuits (Small Pack)', nameHi: 'पाचक बिस्कुट (छोटा पैक)', price: 20, imageUrl: 'https://images.unsplash.com/photo-1641642400132-9873806af82f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxiaXNjdWl0cyUyMHNuYWNrfGVufDB8fHx8MTc1MTQ5MDcyMXww&ixlib.rb-4.1.0&q=80&w=1080', vendorEn: 'Daily Needs', vendorHi: 'डेली नीड्स', dataAiHint: "biscuits snack", categoryKey: "study_snack" },
];

export default function DeliveryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('all');
  const [cart, setCart] = useState<StationeryItem[]>([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load profile data to get user's name for the order
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }
    }
  }, []);

  const handleAddToCart = (item: StationeryItem) => {
    setCart((prevCart) => [...prevCart, item]);
    toast({
        title: "Item Added",
        description: `${item.nameEn} added to your cart.`,
    });
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
        toast({
            title: "Empty Cart",
            description: "Please add items to your cart before proceeding.",
            variant: "destructive"
        });
        return;
    }
    setIsCheckoutDialogOpen(true);
  };

  const handleConfirmOrderFromCheckout = (details: { address: string; coupon?: string; items: StationeryItem[]; isPriority: boolean }) => {
    const newOrderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;
    
    // Create new order object for vendor dashboard
    const newOrder: VendorOrder = {
      id: newOrderId,
      customerName: profileData?.fullName || "A Student",
      date: new Date().toISOString().split('T')[0],
      items: details.items.map(item => ({ id: item.id, productName: item.nameEn, quantity: 1, price: item.price })), // Simplification: quantity is 1
      totalAmount: details.items.reduce((sum, item) => sum + item.price, 0),
      status: "Pending",
      isPriority: details.isPriority,
    };

    // Save to localStorage to simulate backend
    try {
        const existingOrdersString = localStorage.getItem(VENDOR_ORDERS_KEY);
        const existingOrders: VendorOrder[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(updatedOrders));
    } catch(e) {
        console.error("Failed to save order to localStorage:", e);
        toast({ title: "Error", description: "Could not place order (localStorage error).", variant: "destructive"});
        return;
    }

    setConfirmedOrderId(newOrderId);
    setIsOrderConfirmed(true);
    setCart([]); 
    setIsCheckoutDialogOpen(false); 
    toast({
        title: "Order Placed!",
        description: `Your order ${newOrderId} for delivery to ${details.address} is confirmed.`,
    });
  };

  const filteredItems = sampleItems.filter(item =>
    (item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || item.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategoryKey === 'all' || item.categoryKey === selectedCategoryKey)
  );
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="space-y-6">
      <Card className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 -mx-4 px-4 pt-3 pb-2 shadow-sm rounded-none border-x-0 border-t-0 ">
        <CardHeader className="flex flex-row items-center justify-between p-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground hover:bg-accent/10">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-primary">
                <BilingualText en="OSO Delivery" hi="OSO डिलीवरी" />
            </h1>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                <BilingualText en="Stationery & essentials, delivered fast!" hi="स्टेशनरी और आवश्यक वस्तुएं, तेजी से डिलीवर!" />
            </CardDescription>
          </div>
          <div className="w-10 h-10 flex-shrink-0" /> {/* Invisible spacer to help center title */}
        </CardHeader>
        
        <div className="relative mb-3">
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
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryKey === category.key ? 'default' : 'outline'}
                size="sm"
                className="rounded-full px-3 py-1.5 h-auto text-xs sm:text-sm flex-shrink-0"
                onClick={() => setSelectedCategoryKey(category.key)}
              >
                <category.icon className="mr-1.5 h-4 w-4" />
                <BilingualText en={category.nameEn} hi={category.nameHi} separator=" " hiClassName="hidden sm:inline"/>
              </Button>
            ))}
             <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <Filter className="h-5 w-5"/>
                <span className="sr-only"><BilingualText en="Filter" hi="फ़िल्टर"/></span>
             </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>


      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
        <Card className="fixed bottom-16 md:bottom-0 left-0 right-0 mx-auto max-w-3xl shadow-2xl rounded-t-lg md:rounded-lg border-t md:border z-40 bg-card">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm sm:text-base"><BilingualText en={`${cart.length} items`} hi={`${cart.length} आइटम`} /> </p>
              <p className="text-md sm:text-lg font-bold text-primary">INR {cartTotal.toFixed(2)}</p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base" onClick={handleOpenCheckout}>
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <BilingualText en="Checkout" hi="चेकआउट" />
            </Button>
          </CardContent>
        </Card>
      )}
      
      <CheckoutDialog
        isOpen={isCheckoutDialogOpen}
        onClose={() => setIsCheckoutDialogOpen(false)}
        cartItems={cart}
        cartTotal={cartTotal}
        onConfirmOrder={handleConfirmOrderFromCheckout}
      />
      
      <OrderConfirmationDialog 
        isOpen={isOrderConfirmed} 
        onClose={() => setIsOrderConfirmed(false)}
        orderId={confirmedOrderId}
      />

    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
