
// Placeholder for Competitive Bookstore UI
"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import { BilingualText } from "@/components/shared/BilingualText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, DownloadCloud, Filter, Search, ShoppingCart, ThumbsUp, ArrowLeft } from "lucide-react";
import Image from 'next/image';
import type { ProfileFormData } from '../edit-profile/page'; // Import ProfileFormData
import { useRouter } from 'next/navigation';

const examCategories = [
  { id: 'all', nameEn: 'All Exams', nameHi: 'सभी परीक्षाएं' },
  // Engineering
  { id: 'engineering_jee_main', nameEn: 'JEE Main', nameHi: 'जेईई मुख्य' },
  { id: 'engineering_jee_advanced', nameEn: 'JEE Advanced', nameHi: 'जेईई एडवांस्ड' },
  { id: 'engineering_bitsat', nameEn: 'BITSAT', nameHi: 'बिटसैट' },
  { id: 'engineering_viteee', nameEn: 'VITEEE', nameHi: 'वीआईटीईईई' },
  { id: 'engineering_srmjee', nameEn: 'SRMJEEE', nameHi: 'एसआरएमजेईईई' },
  { id: 'engineering_met', nameEn: 'MET (Manipal)', nameHi: 'एमईटी (मणिपाल)' },
  { id: 'engineering_comedk', nameEn: 'COMEDK UGET', nameHi: 'सीओएमईडीके यूजीईटी' },
  { id: 'engineering_kiitee', nameEn: 'KIITEE', nameHi: 'केआईआईटीईई' },
  { id: 'engineering_wbjee', nameEn: 'WBJEE', nameHi: 'डब्ल्यूबीजेईई' },
  { id: 'engineering_mht_cet', nameEn: 'MHT CET (Engineering)', nameHi: 'एमएचटी सीईटी (इंजीनियरिंग)' },
  { id: 'engineering_gujcet', nameEn: 'GUJCET', nameHi: 'जीयूजेसीईटी' },
  { id: 'engineering_ap_eamcet', nameEn: 'AP EAMCET (Engineering)', nameHi: 'एपी ईएएमसीईटी (इंजीनियरिंग)' },
  { id: 'engineering_ts_eamcet', nameEn: 'TS EAMCET (Engineering)', nameHi: 'टीएस ईएएमसीईटी (इंजीनियरिंग)' },
  { id: 'engineering_kcet', nameEn: 'KCET (Engineering)', nameHi: 'केसीईटी (इंजीनियरिंग)' },
  { id: 'engineering_gate', nameEn: 'GATE (PG/PSU)', nameHi: 'गेट (पीजी/पीएसयू)' },
  // Medical
  { id: 'medical_neet_ug', nameEn: 'NEET UG (MBBS, BDS, AYUSH, B.V.Sc)', nameHi: 'नीट यूजी (एमबीबीएस, बीडीएस, आयुष, बी.वी.एससी)' },
  { id: 'medical_neet_pg', nameEn: 'NEET PG (MD, MS, PG Diploma)', nameHi: 'नीट पीजी (एमडी, एमएस, पीजी डिप्लोमा)' },
  { id: 'medical_ini_cet', nameEn: 'INI CET (AIIMS, JIPMER, PGIMER, NIMHANS)', nameHi: 'आईएनआई सीईटी (एम्स, जिपमर, पीजीआईएमईआर, निमहांस)' },
  { id: 'medical_neet_ss', nameEn: 'NEET SS (DM, MCh)', nameHi: 'नीट एसएस (डीएम, एमसीएच)' },
  { id: 'medical_fmge', nameEn: 'FMGE', nameHi: 'एफएमजीई' },
  { id: 'medical_aiims_nursing', nameEn: 'AIIMS Nursing', nameHi: 'एम्स नर्सिंग' },
  { id: 'medical_army_nursing', nameEn: 'Indian Army B.Sc Nursing / MNS', nameHi: 'भारतीय सेना बी.एससी नर्सिंग / एमएनएस' },
  { id: 'medical_aiapget', nameEn: 'AIAPGET (PG AYUSH)', nameHi: 'एआईएपीजीईटी (पीजी आयुष)' },
  // Management
  { id: 'management_cat', nameEn: 'CAT', nameHi: 'कैट' },
  { id: 'management_xat', nameEn: 'XAT', nameHi: 'एक्सएटी' },
  { id: 'management_cmat', nameEn: 'CMAT', nameHi: 'सीएमएटी' },
  { id: 'management_snap', nameEn: 'SNAP', nameHi: 'स्नैप' },
  { id: 'management_nmat', nameEn: 'NMAT by GMAC', nameHi: 'एनएमएटी बाय जीएमएसी' },
  { id: 'management_mat', nameEn: 'MAT', nameHi: 'मैट' },
  { id: 'management_atma', nameEn: 'ATMA', nameHi: 'एटीएमए' },
  { id: 'management_iift', nameEn: 'IIFT', nameHi: 'आईआईएफटी' },
  { id: 'management_tissnet', nameEn: 'TISSNET (check latest)', nameHi: 'टीआईएसएसएनईटी (नवीनतम जांचें)' },
  { id: 'management_ibsat', nameEn: 'IBSAT', nameHi: 'आईबीएसएटी' },
  { id: 'management_micat', nameEn: 'MICAT', nameHi: 'एमआईसीएटी' },
  { id: 'management_gmat_indian_b', nameEn: 'GMAT (for Indian B-schools)', nameHi: 'जीमैट (भारतीय बी-स्कूलों के लिए)' },
  // Law
  { id: 'law_clat_ug_pg', nameEn: 'CLAT (UG & PG)', nameHi: 'क्लैट (यूजी और पीजी)' },
  { id: 'law_ailet_ug_pg', nameEn: 'AILET (UG & PG)', nameHi: 'एआईएलईटी (यूजी और पीजी)' },
  { id: 'law_lsat_india', nameEn: 'LSAT India', nameHi: 'एलएसएटी इंडिया' },
  { id: 'law_slat', nameEn: 'SLAT', nameHi: 'स्लैट' },
  { id: 'law_mh_cet_law', nameEn: 'MH CET Law', nameHi: 'एमएच सीईटी लॉ' },
  { id: 'law_ap_lawcet', nameEn: 'AP LAWCET', nameHi: 'एपी लॉसेट' },
  { id: 'law_ts_lawcet', nameEn: 'TS LAWCET', nameHi: 'टीएस लॉसेट' },
  { id: 'law_kerala_klee', nameEn: 'Kerala KLEE', nameHi: 'केरल केएलईई' },
  { id: 'law_pcs_j', nameEn: 'State Judicial Services (PCS-J)', nameHi: 'राज्य न्यायिक सेवाएं (पीसीएस-जे)' },
  // Civil Services & Government Jobs
  { id: 'govt_upsc_cse', nameEn: 'UPSC CSE (IAS, IPS, etc.)', nameHi: 'यूपीएससी सीएसई (आईएएस, आईपीएस, आदि)' },
  { id: 'govt_upsc_ifos', nameEn: 'UPSC IFoS', nameHi: 'यूपीएससी आईएफओएस' },
  { id: 'govt_upsc_ese_ies', nameEn: 'UPSC ESE/IES', nameHi: 'यूपीएससी ईएसई/आईईएस' },
  { id: 'govt_upsc_geo_scientist', nameEn: 'UPSC Combined Geo-Scientist', nameHi: 'यूपीएससी संयुक्त भू-वैज्ञानिक' },
  { id: 'govt_upsc_cms', nameEn: 'UPSC CMS', nameHi: 'यूपीएससी सीएमएस' },
  { id: 'govt_upsc_capf', nameEn: 'UPSC CAPF', nameHi: 'यूपीएससी सीएपीएफ' },
  { id: 'govt_ssc_cgl', nameEn: 'SSC CGL', nameHi: 'एसएससी सीजीएल' },
  { id: 'govt_ssc_chsl', nameEn: 'SSC CHSL', nameHi: 'एसएससी सीएचएसएल' },
  { id: 'govt_ssc_je', nameEn: 'SSC JE', nameHi: 'एसएससी जेई' },
  { id: 'govt_ssc_stenographer', nameEn: 'SSC Stenographer', nameHi: 'एसएससी स्टेनोग्राफर' },
  { id: 'govt_ssc_mts', nameEn: 'SSC MTS', nameHi: 'एसएससी एमटीएस' },
  { id: 'govt_ssc_gd_constable', nameEn: 'SSC GD Constable', nameHi: 'एसएससी जीडी कांस्टेबल' },
  { id: 'govt_ssc_cpo', nameEn: 'SSC CPO', nameHi: 'एसएससी सीपीओ' },
  { id: 'govt_ibps_po', nameEn: 'IBPS PO', nameHi: 'आईबीपीएस पीओ' },
  { id: 'govt_ibps_clerk', nameEn: 'IBPS Clerk', nameHi: 'आईबीपीएस क्लर्क' },
  { id: 'govt_ibps_so', nameEn: 'IBPS SO', nameHi: 'आईबीपीएस एसओ' },
  { id: 'govt_ibps_rrb', nameEn: 'IBPS RRB', nameHi: 'आईबीपीएस आरआरबी' },
  { id: 'govt_sbi_po', nameEn: 'SBI PO', nameHi: 'एसबीआई पीओ' },
  { id: 'govt_sbi_clerk', nameEn: 'SBI Clerk', nameHi: 'एसबीआई क्लर्क' },
  { id: 'govt_sbi_so', nameEn: 'SBI SO', nameHi: 'एसबीआई एसओ' },
  { id: 'govt_rbi_grade_b', nameEn: 'RBI Grade B', nameHi: 'आरबीआई ग्रेड बी' },
  { id: 'govt_rbi_assistant', nameEn: 'RBI Assistant', nameHi: 'आरबीआई सहायक' },
  { id: 'govt_nabard', nameEn: 'NABARD Grade A & B', nameHi: 'नाबार्ड ग्रेड ए और बी' },
  { id: 'govt_lic_aao_ado', nameEn: 'LIC AAO / ADO', nameHi: 'एलआईसी एएओ / एडीओ' },
  { id: 'govt_insurance_other', nameEn: 'UIIC/NIACL/Other Insurance', nameHi: 'यूआईआईसी/एनआईएसीएल/अन्य बीमा' },
  { id: 'govt_esic_fci', nameEn: 'ESIC / FCI', nameHi: 'ईएसआईसी / एफसीआई' },
  { id: 'govt_rrb_ntpc', nameEn: 'RRB NTPC', nameHi: 'आरआरबी एनटीपीसी' },
  { id: 'govt_rrb_je', nameEn: 'RRB JE', nameHi: 'आरआरबी जेई' },
  { id: 'govt_rrb_alp', nameEn: 'RRB ALP', nameHi: 'आरआरबी एएलपी' },
  { id: 'govt_rrb_group_d', nameEn: 'RRB Group D', nameHi: 'आरआरबी ग्रुप डी' },
  { id: 'govt_state_psc', nameEn: 'State PSCs (General)', nameHi: 'राज्य पीएससी (सामान्य)' },
  { id: 'govt_state_police', nameEn: 'State Level Police Recruitment', nameHi: 'राज्य स्तरीय पुलिस भर्ती' },
  { id: 'govt_high_court', nameEn: 'High Court Exams', nameHi: 'उच्च न्यायालय परीक्षा' },
  // Defence
  { id: 'defence_nda_na', nameEn: 'NDA & NA', nameHi: 'एनडीए और एनए' },
  { id: 'defence_cds', nameEn: 'CDS', nameHi: 'सीडीएस' },
  { id: 'defence_afcat', nameEn: 'AFCAT', nameHi: 'एएफसीएटी' },
  { id: 'defence_inet', nameEn: 'INET', nameHi: 'आईएनईटी' },
  { id: 'defence_army_tes', nameEn: 'Indian Army TES', nameHi: 'भारतीय सेना टीईएस' },
  { id: 'defence_navy_sailors', nameEn: 'Indian Navy Sailors (SSR, AA, MR)', nameHi: 'भारतीय नौसेना नाविक (एसएसआर, एए, एमआर)' },
  { id: 'defence_airforce_airmen', nameEn: 'Indian Air Force Airmen (Group X & Y)', nameHi: 'भारतीय वायु सेना एयरमैन (ग्रुप एक्स और वाई)' },
  { id: 'defence_coast_guard', nameEn: 'Indian Coast Guard (Navik, Yantrik)', nameHi: 'भारतीय तट रक्षक (नाविक, यांत्रिक)' },
  { id: 'defence_territorial_army', nameEn: 'Territorial Army', nameHi: 'प्रादेशिक सेना' },
  // General University Entrance
  { id: 'uni_cuet_ug', nameEn: 'CUET UG', nameHi: 'सीयूईटी यूजी' },
  { id: 'uni_cuet_pg', nameEn: 'CUET PG', nameHi: 'सीयूईटी पीजी' },
  { id: 'uni_jmi_entrance', nameEn: 'JMI Entrance', nameHi: 'जेएमआई प्रवेश' },
  { id: 'uni_amu_entrance', nameEn: 'AMU Entrance', nameHi: 'एएमयू प्रवेश' },
  // Design & Architecture
  { id: 'design_nid_dat', nameEn: 'NID DAT', nameHi: 'एनआईडी डीएटी' },
  { id: 'design_uceed_ceed', nameEn: 'UCEED / CEED', nameHi: 'यूसीईईडी / सीईईडी' },
  { id: 'design_nift_entrance', nameEn: 'NIFT Entrance', nameHi: 'एनआईएफटी प्रवेश' },
  { id: 'design_nata', nameEn: 'NATA', nameHi: 'एनएटीए' },
  { id: 'design_jee_main_p2', nameEn: 'JEE Main Paper 2 (B.Arch/B.Plan)', nameHi: 'जेईई मुख्य पेपर 2 (बी.आर्क/बी.प्लान)' },
  { id: 'design_aieed', nameEn: 'AIEED', nameHi: 'एआईईईडी' },
  // Hotel Management
  { id: 'hotel_mgmt_nchm_jee', nameEn: 'NCHM JEE', nameHi: 'एनसीएचएम जेईई' },
  { id: 'hotel_mgmt_state_ihm', nameEn: 'State IHM Entrances', nameHi: 'राज्य आईएचएम प्रवेश' },
  // Agriculture & Veterinary Science
  { id: 'agri_vet_icar_aieea', nameEn: 'ICAR AIEEA (UG, PG, PhD)', nameHi: 'आईसीएआर एआईईईए (यूजी, पीजी, पीएचडी)' },
  { id: 'agri_vet_state_agri_uni', nameEn: 'State Agriculture University Entrances', nameHi: 'राज्य कृषि विश्वविद्यालय प्रवेश' },
  // Teaching
  { id: 'teaching_ctet', nameEn: 'CTET', nameHi: 'सीटीईटी' },
  { id: 'teaching_state_tet', nameEn: 'State TETs', nameHi: 'राज्य टीईटी' },
  { id: 'teaching_ugc_net', nameEn: 'UGC NET', nameHi: 'यूजीसी नेट' },
  { id: 'teaching_csir_ugc_net', nameEn: 'CSIR UGC NET', nameHi: 'सीएसआईआर यूजीसी नेट' },
  { id: 'teaching_set_slet', nameEn: 'SET / SLET', nameHi: 'एसईटी / एसएलईटी' },
  { id: 'teaching_kvs_nvs_dsssb', nameEn: 'KVS / NVS / DSSSB', nameHi: 'केवीएस / एनवीएस / डीएसएसएसबी' },
  { id: 'teaching_bed_entrance', nameEn: 'B.Ed. Entrances', nameHi: 'बी.एड. प्रवेश' },
  // Pharmacy
  { id: 'pharmacy_gpat', nameEn: 'GPAT', nameHi: 'जीपीएटी' },
  { id: 'pharmacy_state_cet_bpharm', nameEn: 'State CETs for B.Pharm', nameHi: 'बी.फार्म के लिए राज्य सीईटी' },
  { id: 'pharmacy_niper_jee', nameEn: 'NIPER JEE', nameHi: 'एनआईपीईआर जेईई' },
  // Research Fellowships & PhD Entrance
  { id: 'research_fellowship_phd', nameEn: 'Research Fellowships & PhD Entrance', nameHi: 'रिसर्च फेलोशिप और पीएचडी प्रवेश' },
  // Commerce & Finance Professional Courses
  { id: 'commerce_ca', nameEn: 'CA (Foundation, Inter, Final)', nameHi: 'सीए (फाउंडेशन, इंटर, फाइनल)' },
  { id: 'commerce_cs', nameEn: 'CS (CSEET, Executive, Professional)', nameHi: 'सीएस (सीएसईईटी, एक्जीक्यूटिव, प्रोफेशनल)' },
  { id: 'commerce_cma', nameEn: 'CMA (Foundation, Inter, Final)', nameHi: 'सीएमए (फाउंडेशन, इंटर, फाइनल)' },
  // School Level Olympiads & Talent Search
  { id: 'school_olympiads_ntse', nameEn: 'NTSE', nameHi: 'एनटीएसई' },
  { id: 'school_olympiads_kvpy', nameEn: 'KVPY (check status)', nameHi: 'केवीपीवाई (स्थिति जांचें)' },
  { id: 'school_olympiads_sof', nameEn: 'SOF Olympiads (NSO, IMO, IEO, etc.)', nameHi: 'एसओएफ ओलंपियाड (एनएसओ, आईएमओ, आईईओ, आदि)' },
  { id: 'school_olympiads_homi_bhabha', nameEn: 'Homi Bhabha Balvaidnyanik Spardha', nameHi: 'होमी भाभा बालवैज्ञानिक स्पर्धा' },
  // Nursery, LKG, UKG (Play School)
  { id: 'playschool_nursery', nameEn: 'Nursery Books', nameHi: 'नर्सरी की किताबें' },
  { id: 'playschool_lkg', nameEn: 'LKG Books', nameHi: 'एलकेजी की किताबें' },
  { id: 'playschool_ukg', nameEn: 'UKG Books', nameHi: 'यूकेजी की किताबें' },
  // Class 1-12 (Generic for board books if not covered by NCERT page)
  { id: 'school_boards_class1_5', nameEn: 'Class 1-5 Board Books', nameHi: 'कक्षा 1-5 बोर्ड की किताबें' },
  { id: 'school_boards_class6_8', nameEn: 'Class 6-8 Board Books', nameHi: 'कक्षा 6-8 बोर्ड की किताबें' },
  { id: 'school_boards_class9_10', nameEn: 'Class 9-10 Board Books', nameHi: 'कक्षा 9-10 बोर्ड की किताबें' },
  { id: 'school_boards_class11_12', nameEn: 'Class 11-12 Board Books', nameHi: 'कक्षा 11-12 बोर्ड की किताबें' },
];


const publishers = [
    {id: "oswaal", name: "Oswaal Books", logoUrl: "https://placehold.co/100x40.png?text=Oswaal", dataAiHint:"oswaal logo"},
    {id: "arihant", name: "Arihant Experts", logoUrl: "https://placehold.co/100x40.png?text=Arihant", dataAiHint:"arihant logo"},
    {id: "mtg", name: "MTG Learning Media", logoUrl: "https://placehold.co/100x40.png?text=MTG", dataAiHint:"mtg logo"},
    {id: "disha", name: "Disha Publication", logoUrl: "https://placehold.co/100x40.png?text=Disha", dataAiHint:"disha logo"},
    {id: "mcgraw_hill", name: "McGraw Hill", logoUrl: "https://placehold.co/100x40.png?text=McGrawH", dataAiHint:"mcgraw hill logo"},
    {id: "s_chand", name: "S. Chand Publishing", logoUrl: "https://placehold.co/100x40.png?text=SChand", dataAiHint:"s chand logo"},
];

interface CompetitiveBook {
  id: string;
  titleEn: string;
  titleHi: string;
  exam: string; // Should match an 'id' from examCategories
  publisher: string; // Should match an 'id' from publishers
  price: number;
  imageUrl?: string; 
  dataAiHint: string;
  class?: string; 
}

const sampleBooks: CompetitiveBook[] = [
  { id: '1', titleEn: 'JEE Main Solved Papers (2002-2023)', titleHi: 'जेईई मुख्य हल प्रश्नपत्र (2002-2023)', exam: 'engineering_jee_main', publisher: 'arihant', price: 450, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "jee book cover", class: "N/A" },
  { id: '2', titleEn: 'Objective Biology for NEET - Vol 1', titleHi: 'नीट के लिए वस्तुनिष्ठ जीवविज्ञान - खंड 1', exam: 'medical_neet_ug', publisher: 'mtg', price: 799, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "neet book cover", class: "N/A" },
  { id: '3', titleEn: 'CUET (UG) General Test Guide', titleHi: 'सीयूईटी (यूजी) सामान्य परीक्षा गाइड', exam: 'uni_cuet_ug', publisher: 'oswaal', price: 350, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "cuet book cover", class: "N/A" },
  { id: '4', titleEn: 'Indian Polity by M. Laxmikanth', titleHi: 'एम. लक्ष्मीकांत द्वारा भारतीय राजनीति', exam: 'govt_upsc_cse', publisher: 'mcgraw_hill', price: 600, dataAiHint: "upsc book cover", class: "N/A" },
  { id: '5', titleEn: 'Verbal Ability & Reading Comprehension for CAT', titleHi: 'कैट के लिए मौखिक क्षमता और पढ़ने की समझ', exam: 'management_cat', publisher: 'arihant', price: 500, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "cat exam book", class: "N/A" },
  { id: '6', titleEn: 'Legal Reasoning for CLAT & AILET', titleHi: 'क्लैट और एआईएलईटी के लिए कानूनी तर्क', exam: 'law_clat_ug_pg', publisher: 'oswaal', price: 400, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "clat law book", class: "N/A" },
  { id: '7', titleEn: 'Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal', titleHi: 'आर.एस. अग्रवाल द्वारा प्रतियोगी परीक्षाओं के लिए मात्रात्मक योग्यता', exam: 'govt_ssc_cgl', publisher: 's_chand', price: 550, dataAiHint: "quantitative aptitude book", class: "N/A"},
  { id: '8', titleEn: 'Pathfinder NDA/NA National Defence Academy', titleHi: 'पाथफाइंडर एनडीए/एनए राष्ट्रीय रक्षा अकादमी', exam: 'defence_nda_na', publisher: 'arihant', price: 650, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "nda exam book", class: "N/A" },
  { id: '9', titleEn: 'My First ABC Book (Nursery)', titleHi: 'मेरी पहली एबीसी किताब (नर्सरी)', exam: 'playschool_nursery', publisher: 'oswaal', price: 150, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "nursery abc book", class: "Nursery"},
  { id: '10', titleEn: 'Goyal\'s ICSE Computer Applications Class 10', titleHi: 'गोयल की आईसीएसई कंप्यूटर एप्लीकेशन कक्षा 10', exam: 'school_boards_class9_10', publisher: 's_chand', price: 320, imageUrl: 'https://placehold.co/150x200.png', dataAiHint: "icse computer book", class: "10"},
];

function getCategoryFromExamTarget(examTarget?: string): string {
  if (!examTarget) return 'all';
  const targetLower = examTarget.toLowerCase();

  const categoryKeywordsMap: Record<string, string[]> = {
    engineering_jee_main: ['jee main'], engineering_jee_advanced: ['jee advanced'], engineering_bitsat: ['bitsat'], engineering_viteee: ['viteee'], engineering_srmjee: ['srmjeee'], engineering_met: ['met', 'manipal'], engineering_comedk: ['comedk'], engineering_kiitee: ['kiitee'], engineering_wbjee: ['wbjee'], engineering_mht_cet: ['mht cet (eng'], engineering_gujcet: ['gujcet'], engineering_ap_eamcet: ['ap eamcet (eng', 'apeamcet (eng'], engineering_ts_eamcet: ['ts eamcet (eng', 'tseamcet (eng'], engineering_kcet: ['kcet (eng'], engineering_gate: ['gate'],
    medical_neet_ug: ['neet ug', 'mbbs', 'bds', 'ayush ug', 'b.v.sc'], medical_neet_pg: ['neet pg', 'md', 'ms', 'pg diploma'], medical_ini_cet: ['ini cet', 'aiims pg', 'jipmer pg', 'pgimer', 'nimhans pg'], medical_neet_ss: ['neet ss', 'dm', 'mch'], medical_fmge: ['fmge'], medical_aiims_nursing: ['aiims nursing'], medical_army_nursing: ['army nursing', 'mns'], medical_aiapget: ['aiapget', 'pg ayush'],
    management_cat: ['cat'], management_xat: ['xat'], management_cmat: ['cmat'], management_snap: ['snap'], management_nmat: ['nmat'], management_mat: ['mat'], management_atma: ['atma'], management_iift: ['iift'], management_tissnet: ['tissnet'], management_ibsat: ['ibsat'], management_micat: ['micat'], management_gmat_indian_b: ['gmat'],
    law_clat_ug_pg: ['clat'], law_ailet_ug_pg: ['ailet'], law_lsat_india: ['lsat india'], law_slat: ['slat'], law_mh_cet_law: ['mh cet law'], law_ap_lawcet: ['ap lawcet'], law_ts_lawcet: ['ts lawcet'], law_kerala_klee: ['kerala klee', 'klee'], law_pcs_j: ['judicial services', 'pcs-j'],
    govt_upsc_cse: ['upsc cse', 'ias', 'ips', 'civil services'], govt_upsc_ifos: ['upsc ifos', 'ifs'], govt_upsc_ese_ies: ['upsc ese', 'ies'], govt_upsc_geo_scientist: ['geo-scientist'], govt_upsc_cms: ['upsc cms'], govt_upsc_capf: ['capf'],
    govt_ssc_cgl: ['ssc cgl'], govt_ssc_chsl: ['ssc chsl'], govt_ssc_je: ['ssc je'], govt_ssc_stenographer: ['ssc steno'], govt_ssc_mts: ['ssc mts'], govt_ssc_gd_constable: ['ssc gd'], govt_ssc_cpo: ['ssc cpo'],
    govt_ibps_po: ['ibps po'], govt_ibps_clerk: ['ibps clerk'], govt_ibps_so: ['ibps so'], govt_ibps_rrb: ['ibps rrb'],
    govt_sbi_po: ['sbi po'], govt_sbi_clerk: ['sbi clerk'], govt_sbi_so: ['sbi so'],
    govt_rbi_grade_b: ['rbi grade b'], govt_rbi_assistant: ['rbi assistant'],
    govt_nabard: ['nabard'], govt_lic_aao_ado: ['lic aao', 'lic ado'], govt_insurance_other: ['uiic', 'niacl', 'oicl', 'insurance exam'], govt_esic_fci: ['esic', 'fci'],
    govt_rrb_ntpc: ['rrb ntpc', 'railway ntpc'], govt_rrb_je: ['rrb je'], govt_rrb_alp: ['rrb alp'], govt_rrb_group_d: ['rrb group d'],
    govt_state_psc: ['state psc', 'public service commission'], govt_state_police: ['state police', 'police recruitment'], govt_high_court: ['high court exam'],
    defence_nda_na: ['nda', 'na exam'], defence_cds: ['cds'], defence_afcat: ['afcat'], defence_inet: ['inet'], defence_army_tes: ['army tes'], defence_navy_sailors: ['navy sailor', 'ssr', 'aa', 'mr'], defence_airforce_airmen: ['airforce airmen', 'group x', 'group y'], defence_coast_guard: ['coast guard', 'navik', 'yantrik'], defence_territorial_army: ['territorial army'],
    uni_cuet_ug: ['cuet ug'], uni_cuet_pg: ['cuet pg'], uni_jmi_entrance: ['jmi entrance', 'jamia millia'], uni_amu_entrance: ['amu entrance', 'aligarh muslim'],
    design_nid_dat: ['nid dat'], design_uceed_ceed: ['uceed', 'ceed'], design_nift_entrance: ['nift'], design_nata: ['nata'], design_jee_main_p2: ['jee paper 2', 'b.arch', 'b.plan'], design_aieed: ['aieed'],
    hotel_mgmt_nchm_jee: ['nchm jee', 'hotel management entrance'], hotel_mgmt_state_ihm: ['state ihm'],
    agri_vet_icar_aieea: ['icar aieea', 'agriculture entrance', 'veterinary science'], agri_vet_state_agri_uni: ['state agriculture university'],
    teaching_ctet: ['ctet'], teaching_state_tet: ['state tet', 'tet'], teaching_ugc_net: ['ugc net'], teaching_csir_ugc_net: ['csir net'], teaching_set_slet: ['set exam', 'slet'], teaching_kvs_nvs_dsssb: ['kvs', 'nvs', 'dsssb'], teaching_bed_entrance: ['b.ed entrance'],
    pharmacy_gpat: ['gpat'], pharmacy_state_cet_bpharm: ['b.pharm cet'], pharmacy_niper_jee: ['niper jee'],
    research_fellowship_phd: ['research fellowship', 'phd entrance', 'jrf'],
    commerce_ca: ['ca foundation', 'ca inter', 'ca final', 'chartered accountant'], commerce_cs: ['cs cseet', 'cs executive', 'cs professional', 'company secretary'], commerce_cma: ['cma foundation', 'cma inter', 'cma final', 'cost management accountant'],
    school_olympiads_ntse: ['ntse'], school_olympiads_kvpy: ['kvpy'], school_olympiads_sof: ['sof olympiad', 'nso', 'imo', 'ieo'], school_olympiads_homi_bhabha: ['homi bhabha'],
    playschool_nursery: ['nursery'], playschool_lkg: ['lkg', 'lower kindergarten'], playschool_ukg: ['ukg', 'upper kindergarten'],
    school_boards_class1_5: ['class 1 books', 'class 2 books', 'class 3 books', 'class 4 books', 'class 5 books', 'primary school books'],
    school_boards_class6_8: ['class 6 books', 'class 7 books', 'class 8 books', 'middle school books'],
    school_boards_class9_10: ['class 9 books', 'class 10 books', 'secondary school books', 'board exam prep 10'],
    school_boards_class11_12: ['class 11 books', 'class 12 books', 'senior secondary books', 'board exam prep 12'],
  };

  for (const categoryId in categoryKeywordsMap) {
    if (categoryKeywordsMap[categoryId].some(keyword => targetLower.includes(keyword))) {
      return categoryId;
    }
  }
  // Fallback for general class mentions if not caught by board-specific keywords
  if (targetLower.includes("class 10") || targetLower.includes("10th board")) return 'school_boards_class9_10';
  if (targetLower.includes("class 12") || targetLower.includes("12th board")) return 'school_boards_class11_12';

  return 'all'; // Default if no specific match
}


export default function CompetitiveBookstorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const storedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          if (storedProfile.examTarget) {
            const categoryId = getCategoryFromExamTarget(storedProfile.examTarget);
            if (examCategories.some(cat => cat.id === categoryId)) {
              setSelectedExam(categoryId);
            }
          } else if (storedProfile.className) { // Fallback to class if examTarget is not set
             const categoryId = getCategoryFromExamTarget(storedProfile.className.toLowerCase()); // Use lowercased className for broader matching
             if (examCategories.some(cat => cat.id === categoryId)) {
               setSelectedExam(categoryId);
             }
          }
        } catch (e) {
          console.error("Failed to parse profile for bookstore page:", e);
        }
      }
    }
  }, []);


  const filteredBooks = sampleBooks.filter(book => 
    (book.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || book.titleHi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedExam === 'all' || book.exam.toLowerCase() === selectedExam)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold font-headline">
            <BilingualText en="Competitive Exam Bookstore" hi="प्रतियोगी परीक्षा बुकस्टोर" />
          </h1>
          <p className="text-muted-foreground">
            <BilingualText en="Your success starts here. Best books for all major exams." hi="आपकी सफलता यहीं से शुरू होती है। सभी प्रमुख परीक्षाओं के लिए सर्वश्रेष्ठ पुस्तकें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder_en="Search books by title or exam..."
            placeholder_hi="शीर्षक या परीक्षा के अनुसार पुस्तकें खोजें..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={<BilingualText en="Select Exam Category" hi="परीक्षा श्रेणी चुनें" />} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]"> {/* Added max-height for scrollability */}
              {examCategories.map(exam => (
                <SelectItem key={exam.id} value={exam.id}>
                  <BilingualText en={exam.nameEn} hi={exam.nameHi} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Button variant="outline" className="h-11 w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <BilingualText en="More Filters" hi="अधिक फ़िल्टर" />
          </Button>
        </div>
      </div>

       <section>
            <h2 className="text-xl font-semibold mb-3 font-headline"><BilingualText en="Top Publishers" hi="शीर्ष प्रकाशक"/></h2>
            <ScrollArea className="w-full whitespace-nowrap pb-2.5">
                <div className="flex space-x-4">
                    {publishers.map(pub => (
                        <Card key={pub.id} className="min-w-[150px] p-3 hover:shadow-md transition-shadow">
                            <Image 
                              src={pub.logoUrl || `https://placehold.co/100x40.png`} 
                              alt={pub.name} 
                              width={100} 
                              height={40} 
                              className="object-contain mx-auto" 
                              data-ai-hint={pub.dataAiHint || 'publisher logo'}
                            />
                            <p className="text-xs text-center mt-2 text-muted-foreground">{pub.name}</p>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-[3/4] relative w-full bg-muted/30">
                  <Image 
                    src={book.imageUrl || `https://placehold.co/150x200.png`} 
                    alt={book.titleEn} 
                    layout="fill" 
                    objectFit="contain" 
                    className="p-2" 
                    data-ai-hint={book.dataAiHint || 'book cover'} 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-1">
                <CardTitle className="text-sm font-semibold leading-tight h-10 overflow-hidden">
                  <BilingualText en={book.titleEn} hi={book.titleHi} />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  <BilingualText 
                    en={`Exam: ${examCategories.find(cat => cat.id === book.exam)?.nameEn || book.exam}`} 
                    hi={`परीक्षा: ${examCategories.find(cat => cat.id === book.exam)?.nameHi || book.exam}`} 
                  />
                </p>
                <p className="text-xs text-muted-foreground"><BilingualText en={`By ${publishers.find(p => p.id === book.publisher)?.name || book.publisher}`} hi={`${publishers.find(p => p.id === book.publisher)?.name || book.publisher} द्वारा`} /></p>
                <p className="text-md font-bold text-primary">INR {book.price}</p>
              </CardContent>
              <CardFooter className="p-2 pt-0 flex flex-col space-y-1.5">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                  <ShoppingCart size={14} className="mr-1.5" />
                  <BilingualText en="Add to Cart" hi="कार्ट में डालें" />
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                   <DownloadCloud size={14} className="mr-1.5" />
                   <BilingualText en="Free PDF Sample" hi="मुफ़्त पीडीएफ नमूना" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground"><BilingualText en="No books found matching your criteria." hi="आपके मानदंडों से मेल खाने वाली कोई पुस्तक नहीं मिली।" /></p>
        </div>
      )}
    </div>
  );
}

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      placeholder_en?: string;
      placeholder_hi?: string;
    }
}
