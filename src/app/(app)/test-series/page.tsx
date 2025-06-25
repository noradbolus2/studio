
"use client"; 

import { useState, useEffect } from 'react'; 
import { BilingualText } from "@/components/shared/BilingualText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Target, BrainCircuit, Rocket, FileText, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getTestSeriesRecommendations, type TestSeriesRecommendationInput, type TestSeriesRecommendationOutput } from '@/ai/flows/test-series-recommendation-flow';
import { useToast } from '@/hooks/use-toast';
import type { ProfileFormData } from '../edit-profile/page'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

const testCategories = [
  { id: 'all', nameEn: 'All Exams', nameHi: 'सभी परीक्षाएं', descriptionEn: "Browse all available test series.", descriptionHi: "सभी उपलब्ध टेस्ट सीरीज़ ब्राउज़ करें।" },
  // Engineering
  { id: 'engineering_jee_main', nameEn: 'JEE Main', nameHi: 'जेईई मुख्य', descriptionEn: "Tests for Joint Entrance Examination Main.", descriptionHi: "संयुक्त प्रवेश परीक्षा मुख्य के लिए मॉक टेस्ट।" },
  { id: 'engineering_jee_advanced', nameEn: 'JEE Advanced', nameHi: 'जेईई एडवांस्ड', descriptionEn: "Tests for Joint Entrance Examination Advanced (IITs).", descriptionHi: "संयुक्त प्रवेश परीक्षा एडवांस्ड (आईआईटी) के लिए मॉक टेस्ट।" },
  { id: 'engineering_bitsat', nameEn: 'BITSAT', nameHi: 'बिटसैट', descriptionEn: "Tests for Birla Institute of Technology and Science Admission Test.", descriptionHi: "बिरला इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड साइंस प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_viteee', nameEn: 'VITEEE', nameHi: 'वीआईटीईईई', descriptionEn: "Tests for Vellore Institute of Technology Engineering Entrance Exam.", descriptionHi: "वेल्लोर इंस्टीट्यूट ऑफ टेक्नोलॉजी इंजीनियरिंग प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_srmjee', nameEn: 'SRMJEEE', nameHi: 'एसआरएमजेईईई', descriptionEn: "Tests for SRM Joint Engineering Entrance Examination.", descriptionHi: "एसआरएम संयुक्त इंजीनियरिंग प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_met', nameEn: 'MET (Manipal)', nameHi: 'एमईटी (मणिपाल)', descriptionEn: "Tests for Manipal Entrance Test (Engineering).", descriptionHi: "मणिपाल प्रवेश परीक्षा (इंजीनियरिंग) के लिए टेस्ट।" },
  { id: 'engineering_comedk_uget', nameEn: 'COMEDK UGET', nameHi: 'सीओएमईडीके यूजीईटी', descriptionEn: "Tests for Consortium of Medical, Engineering and Dental Colleges of Karnataka Under Graduate Entrance Test.", descriptionHi: "कर्नाटक के मेडिकल, इंजीनियरिंग और डेंटल कॉलेजों के कंसोर्टियम स्नातक प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_kiitee', nameEn: 'KIITEE', nameHi: 'केआईआईटीईई', descriptionEn: "Tests for Kalinga Institute of Industrial Technology Entrance Examination.", descriptionHi: "कलिंग इंस्टीट्यूट ऑफ इंडस्ट्रियल टेक्नोलॉजी प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_wbjee', nameEn: 'WBJEE', nameHi: 'डब्ल्यूबीजेईई', descriptionEn: "Tests for West Bengal Joint Entrance Examination.", descriptionHi: "पश्चिम बंगाल संयुक्त प्रवेश परीक्षा के लिए टेस्ट।" },
  { id: 'engineering_mht_cet', nameEn: 'MHT CET (Engineering)', nameHi: 'एमएचटी सीईटी (इंजीनियरिंग)', descriptionEn: "Tests for Maharashtra Common Entrance Test (Engineering).", descriptionHi: "महाराष्ट्र कॉमन एंट्रेंस टेस्ट (इंजीनियरिंग) के लिए टेस्ट।" },
  { id: 'engineering_gujcet', nameEn: 'GUJCET', nameHi: 'जीयूजेसीईटी', descriptionEn: "Tests for Gujarat Common Entrance Test.", descriptionHi: "गुजरात कॉमन एंट्रेंस टेस्ट के लिए टेस्ट।" },
  { id: 'engineering_ap_eamcet', nameEn: 'AP EAMCET (Engineering)', nameHi: 'एपी ईएएमसीईटी (इंजीनियरिंग)', descriptionEn: "Tests for Andhra Pradesh Engineering, Agriculture and Medical Common Entrance Test.", descriptionHi: "आंध्र प्रदेश इंजीनियरिंग, कृषि और चिकित्सा कॉमन एंट्रेंस टेस्ट के लिए टेस्ट।" },
  { id: 'engineering_ts_eamcet', nameEn: 'TS EAMCET (Engineering)', nameHi: 'टीएस ईएएमसीईटी (इंजीनियरिंग)', descriptionEn: "Tests for Telangana State Engineering, Agriculture and Medical Common Entrance Test.", descriptionHi: "तेलंगाना राज्य इंजीनियरिंग, कृषि और चिकित्सा कॉमन एंट्रेंस टेस्ट के लिए टेस्ट।" },
  { id: 'engineering_kcet', nameEn: 'KCET (Engineering)', nameHi: 'केसीईटी (इंजीनियरिंग)', descriptionEn: "Tests for Karnataka Common Entrance Test (Engineering).", descriptionHi: "कर्नाटक कॉमन एंट्रेंस टेस्ट (इंजीनियरिंग) के लिए टेस्ट।" },
  { id: 'engineering_gate', nameEn: 'GATE (PG/PSU)', nameHi: 'गेट (पीजी/पीएसयू)', descriptionEn: "Graduate Aptitude Test in Engineering for PG/PSU.", descriptionHi: "पीजी/पीएसयू के लिए इंजीनियरिंग में स्नातक योग्यता परीक्षा।" },
  // Medical
  { id: 'medical_neet_ug', nameEn: 'NEET UG (MBBS, BDS, AYUSH, B.V.Sc)', nameHi: 'नीट यूजी (एमबीबीएस, बीडीएस, आयुष, बी.वी.एससी)', descriptionEn: "National Eligibility cum Entrance Test (UG).", descriptionHi: "राष्ट्रीय पात्रता सह प्रवेश परीक्षा (यूजी)।" },
  { id: 'medical_neet_pg', nameEn: 'NEET PG (MD, MS, PG Diploma)', nameHi: 'नीट पीजी (एमडी, एमएस, पीजी डिप्लोमा)', descriptionEn: "National Eligibility cum Entrance Test (PG).", descriptionHi: "राष्ट्रीय पात्रता सह प्रवेश परीक्षा (पीजी)।" },
  { id: 'medical_ini_cet', nameEn: 'INI CET (AIIMS, JIPMER, PGIMER, NIMHANS)', nameHi: 'आईएनआई सीईटी (एम्स, जिपमर, पीजीआईएमईआर, निमहांस)', descriptionEn: "Institute of National Importance Combined Entrance Test.", descriptionHi: "राष्ट्रीय महत्व के संस्थान संयुक्त प्रवेश परीक्षा।" },
  { id: 'medical_neet_ss', nameEn: 'NEET SS (DM, MCh)', nameHi: 'नीट एसएस (डीएम, एमसीएच)', descriptionEn: "National Eligibility cum Entrance Test (Super Speciality).", descriptionHi: "राष्ट्रीय पात्रता सह प्रवेश परीक्षा (सुपर स्पेशियलिटी)।" },
  { id: 'medical_fmge', nameEn: 'FMGE', nameHi: 'एफएमजीई', descriptionEn: "Foreign Medical Graduate Examination.", descriptionHi: "विदेशी चिकित्सा स्नातक परीक्षा।" },
  { id: 'medical_aiims_nursing', nameEn: 'AIIMS Nursing', nameHi: 'एम्स नर्सिंग', descriptionEn: "Entrance tests for AIIMS B.Sc. Nursing.", descriptionHi: "एम्स बी.एससी. नर्सिंग के लिए प्रवेश परीक्षा।" },
  { id: 'medical_army_nursing', nameEn: 'Indian Army B.Sc Nursing / MNS', nameHi: 'भारतीय सेना बी.एससी नर्सिंग / एमएनएस', descriptionEn: "Military Nursing Service entrance.", descriptionHi: "सैन्य नर्सिंग सेवा प्रवेश।" },
  { id: 'medical_aiapget', nameEn: 'AIAPGET (PG AYUSH)', nameHi: 'एआईएपीजीईटी (पीजी आयुष)', descriptionEn: "All India AYUSH Post Graduate Entrance Test.", descriptionHi: "अखिल भारतीय आयुष स्नातकोत्तर प्रवेश परीक्षा।" },
  // Management
  { id: 'management_cat', nameEn: 'CAT', nameHi: 'कैट', descriptionEn: "Common Admission Test (MBA).", descriptionHi: "कॉमन एडमिशन टेस्ट (एमबीए)।" },
  { id: 'management_xat', nameEn: 'XAT', nameHi: 'एक्सएटी', descriptionEn: "Xavier Aptitude Test (MBA).", descriptionHi: "जेवियर एप्टीट्यूड टेस्ट (एमबीए)।" },
  { id: 'management_cmat', nameEn: 'CMAT', nameHi: 'सीएमएटी', descriptionEn: "Common Management Admission Test.", descriptionHi: "कॉमन मैनेजमेंट एडमिशन टेस्ट।" },
  { id: 'management_snap', nameEn: 'SNAP', nameHi: 'स्नैप', descriptionEn: "Symbiosis National Aptitude Test.", descriptionHi: "सिम्बायोसिस नेशनल एप्टीट्यूड टेस्ट।" },
  { id: 'management_nmat', nameEn: 'NMAT by GMAC', nameHi: 'एनएमएटी बाय जीएमएसी', descriptionEn: "NMIMS Management Aptitude Test by GMAC.", descriptionHi: "जीएमएसी द्वारा एनएमआईएमएस मैनेजमेंट एप्टीट्यूड टेस्ट।" },
  { id: 'management_mat', nameEn: 'MAT', nameHi: 'मैट', descriptionEn: "Management Aptitude Test.", descriptionHi: "मैनेजमेंट एप्टीट्यूड टेस्ट।" },
  { id: 'management_atma', nameEn: 'ATMA', nameHi: 'एटीएमए', descriptionEn: "AIMS Test for Management Admissions.", descriptionHi: "प्रबंधन प्रवेश के लिए एआईएमएस टेस्ट।" },
  { id: 'management_iift', nameEn: 'IIFT', nameHi: 'आईआईएफटी', descriptionEn: "Indian Institute of Foreign Trade (MBA-IB).", descriptionHi: "भारतीय विदेश व्यापार संस्थान (एमबीए-आईबी)।" },
  { id: 'management_tissnet', nameEn: 'TISSNET', nameHi: 'टीआईएसएसएनईटी', descriptionEn: "Tata Institute of Social Sciences National Entrance Test.", descriptionHi: "टाटा इंस्टीट्यूट ऑफ सोशल साइंसेज नेशनल एंट्रेंस टेस्ट।" },
  { id: 'management_ibsat', nameEn: 'IBSAT', nameHi: 'आईबीएसएटी', descriptionEn: "ICFAI Business School Aptitude Test.", descriptionHi: "आईसीएफएआई बिजनेस स्कूल एप्टीट्यूड टेस्ट।" },
  { id: 'management_micat', nameEn: 'MICAT', nameHi: 'एमआईसीएटी', descriptionEn: "Mudra Institute of Communications, Ahmedabad Admission Test.", descriptionHi: "मुद्रा इंस्टीट्यूट ऑफ कम्युनिकेशंस, अहमदाबाद प्रवेश परीक्षा।" },
  { id: 'management_gmat_indian_b', nameEn: 'GMAT (for Indian B-schools)', nameHi: 'जीमैट (भारतीय बी-स्कूलों के लिए)', descriptionEn: "Graduate Management Admission Test for Indian B-schools.", descriptionHi: "भारतीय बी-स्कूलों के लिए स्नातक प्रबंधन प्रवेश परीक्षा।" },
  // Law
  { id: 'law_clat_ug_pg', nameEn: 'CLAT (UG & PG)', nameHi: 'क्लैट (यूजी और पीजी)', descriptionEn: "Common Law Admission Test (UG & PG).", descriptionHi: "कॉमन लॉ एडमिशन टेस्ट (यूजी और पीजी)।" },
  { id: 'law_ailet_ug_pg', nameEn: 'AILET (UG & PG)', nameHi: 'एआईएलईटी (यूजी और पीजी)', descriptionEn: "All India Law Entrance Test (UG & PG).", descriptionHi: "अखिल भारतीय विधि प्रवेश परीक्षा (यूजी और पीजी)।" },
  { id: 'law_lsat_india', nameEn: 'LSAT India', nameHi: 'एलएसएटी इंडिया', descriptionEn: "Law School Admission Test India.", descriptionHi: "लॉ स्कूल एडमिशन टेस्ट इंडिया।" },
  { id: 'law_slat', nameEn: 'SLAT', nameHi: 'स्लैट', descriptionEn: "Symbiosis Law Admission Test.", descriptionHi: "सिम्बायोसिस लॉ एडमिशन टेस्ट।" },
  { id: 'law_mh_cet_law', nameEn: 'MH CET Law', nameHi: 'एमएच सीईटी लॉ', descriptionEn: "Maharashtra Common Entrance Test for Law.", descriptionHi: "कानून के लिए महाराष्ट्र कॉमन एंट्रेंस टेस्ट।" },
  { id: 'law_ap_lawcet', nameEn: 'AP LAWCET', nameHi: 'एपी लॉसेट', descriptionEn: "Andhra Pradesh Law Common Entrance Test.", descriptionHi: "आंध्र प्रदेश लॉ कॉमन एंट्रेंस टेस्ट।" },
  { id: 'law_ts_lawcet', nameEn: 'TS LAWCET', nameHi: 'टीएस लॉसेट', descriptionEn: "Telangana State Law Common Entrance Test.", descriptionHi: "तेलंगाना राज्य लॉ कॉमन एंट्रेंस टेस्ट।" },
  { id: 'law_kerala_klee', nameEn: 'Kerala KLEE', nameHi: 'केरल केएलईई', descriptionEn: "Kerala Law Entrance Examination.", descriptionHi: "केरल विधि प्रवेश परीक्षा।" },
  { id: 'law_pcs_j', nameEn: 'State Judicial Services (PCS-J)', nameHi: 'राज्य न्यायिक सेवाएं (पीसीएस-जे)', descriptionEn: "Provincial Civil Service-Judicial Examination.", descriptionHi: "प्रांतीय सिविल सेवा-न्यायिक परीक्षा।" },
  // Civil Services & Government Jobs
  { id: 'govt_upsc_cse', nameEn: 'UPSC CSE (IAS, IPS, etc.)', nameHi: 'यूपीएससी सीएसई (आईएएस, आईपीएस, आदि)', descriptionEn: "UPSC Civil Services Examination.", descriptionHi: "यूपीएससी सिविल सेवा परीक्षा।" },
  { id: 'govt_upsc_ifos', nameEn: 'UPSC IFoS', nameHi: 'यूपीएससी आईएफओएस', descriptionEn: "UPSC Indian Forest Service Exam.", descriptionHi: "यूपीएससी भारतीय वन सेवा परीक्षा।" },
  { id: 'govt_upsc_ese_ies', nameEn: 'UPSC ESE/IES', nameHi: 'यूपीएससी ईएसई/आईईएस', descriptionEn: "UPSC Engineering Services Examination.", descriptionHi: "यूपीएससी इंजीनियरिंग सेवा परीक्षा।" },
  { id: 'govt_upsc_geo_scientist', nameEn: 'UPSC Combined Geo-Scientist', nameHi: 'यूपीएससी संयुक्त भू-वैज्ञानिक', descriptionEn: "UPSC Combined Geo-Scientist Examination.", descriptionHi: "यूपीएससी संयुक्त भू-वैज्ञानिक परीक्षा।" },
  { id: 'govt_upsc_cms', nameEn: 'UPSC CMS', nameHi: 'यूपीएससी सीएमएस', descriptionEn: "UPSC Combined Medical Services Examination.", descriptionHi: "यूपीएससी संयुक्त चिकित्सा सेवा परीक्षा।" },
  { id: 'govt_upsc_capf', nameEn: 'UPSC CAPF', nameHi: 'यूपीएससी सीएपीएफ', descriptionEn: "UPSC Central Armed Police Forces (ACs) Examination.", descriptionHi: "यूपीएससी केंद्रीय सशस्त्र पुलिस बल (एसी) परीक्षा।" },
  { id: 'govt_ssc_cgl', nameEn: 'SSC CGL', nameHi: 'एसएससी सीजीएल', descriptionEn: "SSC Combined Graduate Level Examination.", descriptionHi: "एसएससी संयुक्त स्नातक स्तरीय परीक्षा।" },
  { id: 'govt_ssc_chsl', nameEn: 'SSC CHSL', nameHi: 'एसएससी सीएचएसएल', descriptionEn: "SSC Combined Higher Secondary Level Examination.", descriptionHi: "एसएससी संयुक्त उच्चतर माध्यमिक स्तरीय परीक्षा।" },
  { id: 'govt_ssc_je', nameEn: 'SSC JE', nameHi: 'एसएससी जेई', descriptionEn: "SSC Junior Engineer Examination.", descriptionHi: "एसएससी जूनियर इंजीनियर परीक्षा।" },
  { id: 'govt_ssc_stenographer', nameEn: 'SSC Stenographer', nameHi: 'एसएससी स्टेनोग्राफर', descriptionEn: "SSC Stenographer Grade 'C' & 'D' Examination.", descriptionHi: "एसएससी स्टेनोग्राफर ग्रेड 'सी' और 'डी' परीक्षा।" },
  { id: 'govt_ssc_mts', nameEn: 'SSC MTS', nameHi: 'एसएससी एमटीएस', descriptionEn: "SSC Multi Tasking (Non-Technical) Staff Examination.", descriptionHi: "एसएससी मल्टी टास्किंग (गैर-तकनीकी) स्टाफ परीक्षा।" },
  { id: 'govt_ssc_gd_constable', nameEn: 'SSC GD Constable', nameHi: 'एसएससी जीडी कांस्टेबल', descriptionEn: "SSC Constable (GD) in CAPFs, NIA, SSF and Rifleman (GD).", descriptionHi: "सीएपीएफ, एनआईए, एसएसएफ में एसएससी कांस्टेबल (जीडी) और राइफलमैन (जीडी)।" },
  { id: 'govt_ssc_cpo', nameEn: 'SSC CPO', nameHi: 'एसएससी सीपीओ', descriptionEn: "SSC Sub-Inspector in Delhi Police and CAPFs Examination.", descriptionHi: "दिल्ली पुलिस और सीएपीएफ में एसएससी सब-इंस्पेक्टर परीक्षा।" },
  { id: 'govt_ibps_po', nameEn: 'IBPS PO', nameHi: 'आईबीपीएस पीओ', descriptionEn: "IBPS Probationary Officer / Management Trainee Exam.", descriptionHi: "आईबीपीएस प्रोबेशनरी ऑफिसर / मैनेजमेंट ट्रेनी परीक्षा।" },
  { id: 'govt_ibps_clerk', nameEn: 'IBPS Clerk', nameHi: 'आईबीपीएस क्लर्क', descriptionEn: "IBPS Clerk Cadre Exam.", descriptionHi: "आईबीपीएस क्लर्क कैडर परीक्षा।" },
  { id: 'govt_ibps_so', nameEn: 'IBPS SO', nameHi: 'आईबीपीएस एसओ', descriptionEn: "IBPS Specialist Officer Exam.", descriptionHi: "आईबीपीएस स्पेशलिस्ट ऑफिसर परीक्षा।" },
  { id: 'govt_ibps_rrb', nameEn: 'IBPS RRB', nameHi: 'आईबीपीएस आरआरबी', descriptionEn: "IBPS Regional Rural Banks Exam.", descriptionHi: "आईबीपीएस क्षेत्रीय ग्रामीण बैंक परीक्षा।" },
  { id: 'govt_sbi_po', nameEn: 'SBI PO', nameHi: 'एसबीआई पीओ', descriptionEn: "SBI Probationary Officer Exam.", descriptionHi: "एसबीआई प्रोबेशनरी ऑफिसर परीक्षा।" },
  { id: 'govt_sbi_clerk', nameEn: 'SBI Clerk', nameHi: 'एसबीआई क्लर्क', descriptionEn: "SBI Junior Associates (Customer Support & Sales) Exam.", descriptionHi: "एसबीआई जूनियर एसोसिएट्स (ग्राहक सहायता और बिक्री) परीक्षा।" },
  { id: 'govt_sbi_so', nameEn: 'SBI SO', nameHi: 'एसबीआई एसओ', descriptionEn: "SBI Specialist Cadre Officer Exam.", descriptionHi: "एसबीआई स्पेशलिस्ट कैडर ऑफिसर परीक्षा।" },
  { id: 'govt_rbi_grade_b', nameEn: 'RBI Grade B', nameHi: 'आरबीआई ग्रेड बी', descriptionEn: "RBI Officer Grade B Exam.", descriptionHi: "आरबीआई ऑफिसर ग्रेड बी परीक्षा।" },
  { id: 'govt_rbi_assistant', nameEn: 'RBI Assistant', nameHi: 'आरबीआई सहायक', descriptionEn: "RBI Assistant Exam.", descriptionHi: "आरबीआई सहायक परीक्षा।" },
  { id: 'govt_nabard', nameEn: 'NABARD Grade A & B', nameHi: 'नाबार्ड ग्रेड ए और बी', descriptionEn: "NABARD Officer Grade A & B Exam.", descriptionHi: "नाबार्ड ऑफिसर ग्रेड ए और बी परीक्षा।" },
  { id: 'govt_lic_aao_ado', nameEn: 'LIC AAO / ADO', nameHi: 'एलआईसी एएओ / एडीओ', descriptionEn: "LIC Assistant Administrative Officer / Apprentice Development Officer Exam.", descriptionHi: "एलआईसी सहायक प्रशासनिक अधिकारी / अपरेंटिस डेवलपमेंट ऑफिसर परीक्षा।" },
  { id: 'govt_insurance_other', nameEn: 'UIIC/NIACL/Other Insurance', nameHi: 'यूआईआईसी/एनआईएसीएल/अन्य बीमा', descriptionEn: "Various Insurance Company Exams.", descriptionHi: "विभिन्न बीमा कंपनी परीक्षाएँ।" },
  { id: 'govt_esic_fci', nameEn: 'ESIC / FCI', nameHi: 'ईएसआईसी / एफसीआई', descriptionEn: "ESIC and FCI Recruitment Exams.", descriptionHi: "ईएसआईसी और एफसीआई भर्ती परीक्षाएँ।" },
  { id: 'govt_rrb_ntpc', nameEn: 'RRB NTPC', nameHi: 'आरआरबी एनटीपीसी', descriptionEn: "Railway Recruitment Board Non-Technical Popular Categories Exam.", descriptionHi: "रेलवे भर्ती बोर्ड गैर-तकनीकी लोकप्रिय श्रेणियां परीक्षा।" },
  { id: 'govt_rrb_je', nameEn: 'RRB JE', nameHi: 'आरआरबी जेई', descriptionEn: "Railway Recruitment Board Junior Engineer Exam.", descriptionHi: "रेलवे भर्ती बोर्ड जूनियर इंजीनियर परीक्षा।" },
  { id: 'govt_rrb_alp', nameEn: 'RRB ALP', nameHi: 'आरआरबी एएलपी', descriptionEn: "Railway Recruitment Board Assistant Loco Pilot & Technician Exam.", descriptionHi: "रेलवे भर्ती बोर्ड सहायक लोको पायलट और तकनीशियन परीक्षा।" },
  { id: 'govt_rrb_group_d', nameEn: 'RRB Group D', nameHi: 'आरआरबी ग्रुप डी', descriptionEn: "Railway Recruitment Board Group D Exam.", descriptionHi: "रेलवे भर्ती बोर्ड ग्रुप डी परीक्षा।" },
  { id: 'govt_state_psc', nameEn: 'State PSCs (General)', nameHi: 'राज्य पीएससी (सामान्य)', descriptionEn: "State Public Service Commission Exams.", descriptionHi: "राज्य लोक सेवा आयोग परीक्षाएँ।" },
  { id: 'govt_state_police', nameEn: 'State Level Police Recruitment', nameHi: 'राज्य स्तरीय पुलिस भर्ती', descriptionEn: "State Police Constable & SI Recruitment.", descriptionHi: "राज्य पुलिस कांस्टेबल और एसआई भर्ती।" },
  { id: 'govt_high_court', nameEn: 'High Court Exams', nameHi: 'उच्च न्यायालय परीक्षा', descriptionEn: "Recruitment exams for High Courts.", descriptionHi: "उच्च न्यायालयों के लिए भर्ती परीक्षाएँ।" },
  // Defence
  { id: 'defence_nda_na', nameEn: 'NDA & NA', nameHi: 'एनडीए और एनए', descriptionEn: "National Defence Academy & Naval Academy Examination.", descriptionHi: "राष्ट्रीय रक्षा अकादमी और नौसेना अकादमी परीक्षा।" },
  { id: 'defence_cds', nameEn: 'CDS', nameHi: 'सीडीएस', descriptionEn: "Combined Defence Services Examination.", descriptionHi: "संयुक्त रक्षा सेवा परीक्षा।" },
  { id: 'defence_afcat', nameEn: 'AFCAT', nameHi: 'एएफसीएटी', descriptionEn: "Air Force Common Admission Test.", descriptionHi: "वायु सेना कॉमन एडमिशन टेस्ट।" },
  { id: 'defence_inet', nameEn: 'INET', nameHi: 'आईएनईटी', descriptionEn: "Indian Navy Entrance Test.", descriptionHi: "भारतीय नौसेना प्रवेश परीक्षा।" },
  { id: 'defence_army_tes', nameEn: 'Indian Army TES', nameHi: 'भारतीय सेना टीईएस', descriptionEn: "Indian Army Technical Entry Scheme.", descriptionHi: "भारतीय सेना तकनीकी प्रवेश योजना।" },
  { id: 'defence_navy_sailors', nameEn: 'Indian Navy Sailors (SSR, AA, MR)', nameHi: 'भारतीय नौसेना नाविक (एसएसआर, एए, एमआर)', descriptionEn: "Recruitment for Indian Navy Sailors.", descriptionHi: "भारतीय नौसेना नाविकों के लिए भर्ती।" },
  { id: 'defence_airforce_airmen', nameEn: 'Indian Air Force Airmen (Group X & Y)', nameHi: 'भारतीय वायु सेना एयरमैन (ग्रुप एक्स और वाई)', descriptionEn: "Recruitment for Indian Air Force Airmen.", descriptionHi: "भारतीय वायु सेना एयरमैन के लिए भर्ती।" },
  { id: 'defence_coast_guard', nameEn: 'Indian Coast Guard (Navik, Yantrik)', nameHi: 'भारतीय तट रक्षक (नाविक, यांत्रिक)', descriptionEn: "Recruitment for Indian Coast Guard.", descriptionHi: "भारतीय तट रक्षक के लिए भर्ती।" },
  { id: 'defence_territorial_army', nameEn: 'Territorial Army', nameHi: 'प्रादेशिक सेना', descriptionEn: "Territorial Army Officer Recruitment.", descriptionHi: "प्रादेशिक सेना अधिकारी भर्ती।" },
  // General University Entrance
  { id: 'uni_cuet_ug', nameEn: 'CUET UG', nameHi: 'सीयूईटी यूजी', descriptionEn: "Common University Entrance Test (UG).", descriptionHi: "कॉमन यूनिवर्सिटी एंट्रेंस टेस्ट (यूजी)।" },
  { id: 'uni_cuet_pg', nameEn: 'CUET PG', nameHi: 'सीयूईटी पीजी', descriptionEn: "Common University Entrance Test (PG).", descriptionHi: "कॉमन यूनिवर्सिटी एंट्रेंस टेस्ट (पीजी)।" },
  { id: 'uni_jmi_entrance', nameEn: 'JMI Entrance', nameHi: 'जेएमआई प्रवेश', descriptionEn: "Jamia Millia Islamia Entrance Exams.", descriptionHi: "जामिया मिलिया इस्लामिया प्रवेश परीक्षाएँ।" },
  { id: 'uni_amu_entrance', nameEn: 'AMU Entrance', nameHi: 'एएमयू प्रवेश', descriptionEn: "Aligarh Muslim University Entrance Exams.", descriptionHi: "अलीगढ़ मुस्लिम विश्वविद्यालय प्रवेश परीक्षाएँ।" },
  // Design & Architecture
  { id: 'design_nid_dat', nameEn: 'NID DAT', nameHi: 'एनआईडी डीएटी', descriptionEn: "National Institute of Design - Design Aptitude Test.", descriptionHi: "नेशनल इंस्टीट्यूट ऑफ डिजाइन - डिजाइन एप्टीट्यूड टेस्ट।" },
  { id: 'design_uceed_ceed', nameEn: 'UCEED / CEED', nameHi: 'यूसीईईडी / सीईईडी', descriptionEn: "Undergraduate/Common Entrance Exam for Design.", descriptionHi: "डिजाइन के लिए स्नातक/कॉमन एंट्रेंस एग्जाम।" },
  { id: 'design_nift_entrance', nameEn: 'NIFT Entrance', nameHi: 'एनआईएफटी प्रवेश', descriptionEn: "National Institute of Fashion Technology Entrance Exam.", descriptionHi: "नेशनल इंस्टीट्यूट ऑफ फैशन टेक्नोलॉजी प्रवेश परीक्षा।" },
  { id: 'design_nata', nameEn: 'NATA', nameHi: 'एनएटीए', descriptionEn: "National Aptitude Test in Architecture.", descriptionHi: "वास्तुकला में राष्ट्रीय योग्यता परीक्षा।" },
  { id: 'design_jee_main_p2', nameEn: 'JEE Main Paper 2 (B.Arch/B.Plan)', nameHi: 'जेईई मुख्य पेपर 2 (बी.आर्क/बी.प्लान)', descriptionEn: "JEE Main Paper 2 for B.Arch/B.Planning.", descriptionHi: "बी.आर्क/बी.प्लानिंग के लिए जेईई मुख्य पेपर 2।" },
  { id: 'design_aieed', nameEn: 'AIEED', nameHi: 'एआईईईडी', descriptionEn: "All India Entrance Examination for Design.", descriptionHi: "डिजाइन के लिए अखिल भारतीय प्रवेश परीक्षा।" },
  // Hotel Management
  { id: 'hotel_mgmt_nchm_jee', nameEn: 'NCHM JEE', nameHi: 'एनसीएचएम जेईई', descriptionEn: "National Council for Hotel Management Joint Entrance Examination.", descriptionHi: "नेशनल काउंसिल फॉर होटल मैनेजमेंट संयुक्त प्रवेश परीक्षा।" },
  { id: 'hotel_mgmt_state_ihm', nameEn: 'State IHM Entrances', nameHi: 'राज्य आईएचएम प्रवेश', descriptionEn: "State level Institute of Hotel Management entrances.", descriptionHi: "राज्य स्तरीय होटल प्रबंधन संस्थान प्रवेश।" },
  // Agriculture & Veterinary Science
  { id: 'agri_vet_icar_aieea', nameEn: 'ICAR AIEEA (UG, PG, PhD)', nameHi: 'आईसीएआर एआईईईए (यूजी, पीजी, पीएचडी)', descriptionEn: "Indian Council of Agricultural Research All India Entrance Examination.", descriptionHi: "भारतीय कृषि अनुसंधान परिषद अखिल भारतीय प्रवेश परीक्षा।" },
  { id: 'agri_vet_state_agri_uni', nameEn: 'State Agriculture University Entrances', nameHi: 'राज्य कृषि विश्वविद्यालय प्रवेश', descriptionEn: "Entrance exams for State Agriculture Universities.", descriptionHi: "राज्य कृषि विश्वविद्यालयों के लिए प्रवेश परीक्षाएँ।" },
  // Teaching
  { id: 'teaching_ctet', nameEn: 'CTET', nameHi: 'सीटीईटी', descriptionEn: "Central Teacher Eligibility Test.", descriptionHi: "केंद्रीय शिक्षक पात्रता परीक्षा।" },
  { id: 'teaching_state_tet', nameEn: 'State TETs', nameHi: 'राज्य टीईटी', descriptionEn: "State Teacher Eligibility Tests.", descriptionHi: "राज्य शिक्षक पात्रता परीक्षाएँ।" },
  { id: 'teaching_ugc_net', nameEn: 'UGC NET', nameHi: 'यूजीसी नेट', descriptionEn: "University Grants Commission National Eligibility Test.", descriptionHi: "विश्वविद्यालय अनुदान आयोग राष्ट्रीय पात्रता परीक्षा।" },
  { id: 'teaching_csir_ugc_net', nameEn: 'CSIR UGC NET', nameHi: 'सीएसआईआर यूजीसी नेट', descriptionEn: "Council of Scientific & Industrial Research UGC NET.", descriptionHi: "वैज्ञानिक और औद्योगिक अनुसंधान परिषद यूजीसी नेट।" },
  { id: 'teaching_set_slet', nameEn: 'SET / SLET', nameHi: 'एसईटी / एसएलईटी', descriptionEn: "State Eligibility Test / State Level Eligibility Test.", descriptionHi: "राज्य पात्रता परीक्षा / राज्य स्तरीय पात्रता परीक्षा।" },
  { id: 'teaching_kvs_nvs_dsssb', nameEn: 'KVS / NVS / DSSSB', nameHi: 'केवीएस / एनवीएस / डीएसएसएसबी', descriptionEn: "Kendriya Vidyalaya Sangathan / Navodaya Vidyalaya Samiti / Delhi Subordinate Services Selection Board.", descriptionHi: "केन्द्रीय विद्यालय संगठन / नवोदय विद्यालय समिति / दिल्ली अधीनस्थ सेवा चयन बोर्ड।" },
  { id: 'teaching_bed_entrance', nameEn: 'B.Ed. Entrances', nameHi: 'बी.एड. प्रवेश', descriptionEn: "Bachelor of Education Entrance Exams.", descriptionHi: "बैचलर ऑफ एजुकेशन प्रवेश परीक्षाएँ।" },
  // Pharmacy
  { id: 'pharmacy_gpat', nameEn: 'GPAT', nameHi: 'जीपीएटी', descriptionEn: "Graduate Pharmacy Aptitude Test.", descriptionHi: "स्नातक फार्मेसी एप्टीट्यूड टेस्ट।" },
  { id: 'pharmacy_state_cet_bpharm', nameEn: 'State CETs for B.Pharm', nameHi: 'बी.फार्म के लिए राज्य सीईटी', descriptionEn: "State Common Entrance Tests for B.Pharmacy.", descriptionHi: "बी.फार्मेसी के लिए राज्य कॉमन एंट्रेंस टेस्ट।" },
  { id: 'pharmacy_niper_jee', nameEn: 'NIPER JEE', nameHi: 'एनआईपीईआर जेईई', descriptionEn: "National Institute of Pharmaceutical Education and Research Joint Entrance Exam.", descriptionHi: "नेशनल इंस्टीट्यूट ऑफ फार्मास्युटिकल एजुकेशन एंड रिसर्च संयुक्त प्रवेश परीक्षा।" },
  // Research Fellowships & PhD Entrance
  { id: 'research_fellowship_phd', nameEn: 'Research Fellowships & PhD Entrance', nameHi: 'रिसर्च फेलोशिप और पीएचडी प्रवेश', descriptionEn: "Exams like UGC NET JRF, CSIR NET JRF, ICMR JRF, DBT JRF, etc.", descriptionHi: "यूजीसी नेट जेआरएफ, सीएसआईआर नेट जेआरएफ, आईसीएमआर जेआरएफ, डीबीटी जेआरएफ, आदि जैसी परीक्षाएँ।" },
  // Commerce & Finance Professional Courses
  { id: 'commerce_ca', nameEn: 'CA (Foundation, Inter, Final)', nameHi: 'सीए (फाउंडेशन, इंटर, फाइनल)', descriptionEn: "Chartered Accountancy exams.", descriptionHi: "चार्टर्ड अकाउंटेंसी परीक्षाएँ।" },
  { id: 'commerce_cs', nameEn: 'CS (CSEET, Executive, Professional)', nameHi: 'सीएस (सीएसईईटी, एक्जीक्यूटिव, प्रोफेशनल)', descriptionEn: "Company Secretary exams.", descriptionHi: "कंपनी सचिव परीक्षाएँ।" },
  { id: 'commerce_cma', nameEn: 'CMA (Foundation, Inter, Final)', nameHi: 'सीएमए (फाउंडेशन, इंटर, फाइनल)', descriptionEn: "Cost and Management Accountancy exams.", descriptionHi: "लागत और प्रबंधन लेखा परीक्षाएँ।" },
  // School Level Olympiads & Talent Search
  { id: 'school_olympiads_ntse', nameEn: 'NTSE', nameHi: 'एनटीएसई', descriptionEn: "National Talent Search Examination.", descriptionHi: "राष्ट्रीय प्रतिभा खोज परीक्षा।" },
  { id: 'school_olympiads_kvpy', nameEn: 'KVPY (check status)', nameHi: 'केवीपीवाई (स्थिति जांचें)', descriptionEn: "Kishore Vaigyanik Protsahan Yojana.", descriptionHi: "किशोर वैज्ञानिक प्रोत्साहन योजना।" },
  { id: 'school_olympiads_sof', nameEn: 'SOF Olympiads (NSO, IMO, IEO, etc.)', nameHi: 'एसओएफ ओलंपियाड (एनएसओ, आईएमओ, आईईओ, आदि)', descriptionEn: "Science Olympiad Foundation exams.", descriptionHi: "साइंस ओलंपियाड फाउंडेशन परीक्षाएँ।" },
  { id: 'school_olympiads_homi_bhabha', nameEn: 'Homi Bhabha Balvaidnyanik Spardha', nameHi: 'होमी भाभा बालवैज्ञानिक स्पर्धा', descriptionEn: "For students in Maharashtra & Goa.", descriptionHi: "महाराष्ट्र और गोवा के छात्रों के लिए।" },
  // School Boards
  { id: 'school_boards_class10', nameEn: 'Class 10 Boards', nameHi: 'कक्षा 10 बोर्ड', descriptionEn: "Practice tests for Class 10 board exams (CBSE, ICSE, State).", descriptionHi: "कक्षा 10 बोर्ड परीक्षाओं (सीबीएसई, आईसीएसई, राज्य) के लिए अभ्यास परीक्षण।" },
  { id: 'school_boards_class12', nameEn: 'Class 12 Boards', nameHi: 'कक्षा 12 बोर्ड', descriptionEn: "Practice tests for Class 12 board exams (CBSE, ICSE, State).", descriptionHi: "कक्षा 12 बोर्ड परीक्षाओं (सीबीएसई, आईसीएसई, राज्य) के लिए अभ्यास परीक्षण।" },
];


interface FeaturedTest {
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

const featuredTests: FeaturedTest[] = [
  // Medical
  {
    id: 'neet_mock_1',
    categoryId: 'medical_neet_ug',
    titleEn: "NEET UG Test Series Pack (25 Tests)",
    titleHi: "नीट यूजी टेस्ट सीरीज़ पैक (25 टेस्ट)",
    descriptionEn: "Comprehensive pack: 12 Unit Tests, 4 Part-Syllabus Tests, and 9 Full NEET Replica Mock Tests. All India Ranking.",
    descriptionHi: "व्यापक पैक: 12 यूनिट टेस्ट, 4 भाग-सिलेबस टेस्ट, और 9 पूर्ण नीट प्रतिकृति मॉक टेस्ट। अखिल भारतीय रैंकिंग।",
    price: "₹199",
    generationTitleEn: "NEET UG Full Syllabus Mock Test (Sample)",
    defaultNumQuestions: 200
  },
  // Engineering
  {
    id: 'jee_main_pack_1',
    categoryId: 'engineering_jee_main',
    titleEn: "JEE Main Test Series Pack (20 Tests)",
    titleHi: "जेईई मुख्य टेस्ट सीरीज़ पैक (20 टेस्ट)",
    descriptionEn: "Boost your prep: 10 Topic Tests, 5 Part-Syllabus Tests, and 5 Full JEE Main Replica Mocks.",
    descriptionHi: "अपनी तैयारी बढ़ाएँ: 10 टॉपिक टेस्ट, 5 भाग-सिलेबस टेस्ट, और 5 पूर्ण जेईई मुख्य प्रतिकृति मॉक।",
    price: "₹179",
    generationTitleEn: "JEE Main Full Mock (Sample)",
    defaultNumQuestions: 90
  },
  {
    id: 'jee_advanced_pack_1',
    categoryId: 'engineering_jee_advanced',
    titleEn: "JEE Advanced Test Series Pack (15 Tests)",
    titleHi: "जेईई एडवांस्ड टेस्ट सीरीज़ पैक (15 टेस्ट)",
    descriptionEn: "Ace IITs: 7 Challenging Topic Tests, 3 Part-Syllabus Tests, and 5 Full JEE Advanced Replica Mocks.",
    descriptionHi: "आईआईटी में सफलता: 7 चुनौतीपूर्ण टॉपिक टेस्ट, 3 भाग-सिलेबस टेस्ट, और 5 पूर्ण जेईई एडवांस्ड प्रतिकृति मॉक।",
    price: "₹249",
    generationTitleEn: "JEE Advanced Full Mock (Sample)",
    defaultNumQuestions: 54 // Example: 1 Paper (18P+18C+18M)
  },
  // Management
  {
    id: 'cat_pack_1',
    categoryId: 'management_cat',
    titleEn: "CAT Full Test Series Pack (10 Tests)",
    titleHi: "कैट पूर्ण टेस्ट सीरीज़ पैक (10 टेस्ट)",
    descriptionEn: "Conquer CAT: 4 Sectional Tests (VARC, DILR, QA) and 6 Full-Length CAT Replica Mocks.",
    descriptionHi: "कैट पर विजय: 4 अनुभागीय टेस्ट (वीएआरसी, डीआईएलआर, क्यूए) और 6 पूर्ण-लंबाई कैट प्रतिकृति मॉक।",
    price: "₹299",
    generationTitleEn: "CAT Full Mock (Sample)",
    defaultNumQuestions: 66 // (VARC 24, DILR 20, QA 22)
  },
  // Law
  {
    id: 'clat_pack_1',
    categoryId: 'law_clat_ug_pg',
    titleEn: "CLAT UG Test Series Pack (15 Tests)",
    titleHi: "क्लैट यूजी टेस्ट सीरीज़ पैक (15 टेस्ट)",
    descriptionEn: "Law School Ready: 5 Sectional Tests (English, Legal, Logical, GK, Quant) and 10 Full CLAT UG Mocks.",
    descriptionHi: "लॉ स्कूल के लिए तैयार: 5 अनुभागीय टेस्ट (अंग्रेजी, कानूनी, तार्किक, जीके, मात्रात्मक) और 10 पूर्ण क्लैट यूजी मॉक।",
    price: "₹199",
    generationTitleEn: "CLAT UG Full Mock (Sample)",
    defaultNumQuestions: 120 // New pattern
  },
  // Civil Services
  {
    id: 'upsc_prelims_pack_1',
    categoryId: 'govt_upsc_cse',
    titleEn: "UPSC CSE Prelims GS Pack (20 Tests)",
    titleHi: "यूपीएससी सीएसई प्रीलिम्स जीएस पैक (20 टेस्ट)",
    descriptionEn: "Crack Civils: 10 Subject-wise Tests, 5 Current Affairs Mocks, and 5 Full GS Paper 1 Replicas.",
    descriptionHi: "सिविल सेवा में सफलता: 10 विषय-वार टेस्ट, 5 करंट अफेयर्स मॉक, और 5 पूर्ण जीएस पेपर 1 प्रतिकृति।",
    price: "₹349",
    generationTitleEn: "UPSC CSE Prelims GS Paper 1 Mock (Sample)",
    defaultNumQuestions: 100
  },
   // Defence
  {
    id: 'nda_pack_1',
    categoryId: 'defence_nda_na',
    titleEn: "NDA & NA Test Series Pack (15 Tests)",
    titleHi: "एनडीए और एनए टेस्ट सीरीज़ पैक (15 टेस्ट)",
    descriptionEn: "Join the Forces: 5 Maths Tests, 5 GAT Tests, and 5 Full NDA Replica Mocks.",
    descriptionHi: "सेना में शामिल हों: 5 गणित टेस्ट, 5 जीएटी टेस्ट, और 5 पूर्ण एनडीए प्रतिकृति मॉक।",
    price: "₹229",
    generationTitleEn: "NDA GAT Mock (Sample)", 
    defaultNumQuestions: 150 
  },
  // University Entrance
  {
    id: 'cuet_ug_pack_1',
    categoryId: 'uni_cuet_ug',
    titleEn: "CUET UG Comprehensive Pack (Humanities)",
    titleHi: "सीयूईटी यूजी व्यापक पैक (मानविकी)",
    descriptionEn: "College Ready: Tests for English, General Test, and 3 Domain Subjects (e.g., History, Pol Sci, Eco).",
    descriptionHi: "कॉलेज के लिए तैयार: अंग्रेजी, सामान्य परीक्षा, और 3 डोमेन विषयों (जैसे, इतिहास, राजनीति विज्ञान, अर्थशास्त्र) के लिए टेस्ट।",
    price: "₹279",
    generationTitleEn: "CUET UG General Test (Sample)", 
    defaultNumQuestions: 60 
  },
  // School Boards
  {
    id: 'class10_board_pack_1',
    categoryId: 'school_boards_class10',
    titleEn: "Class 10 Board Exam Prep Pack (Science)",
    titleHi: "कक्षा 10 बोर्ड परीक्षा तैयारी पैक (विज्ञान)",
    descriptionEn: "Excel in Boards: Chapter-wise tests for Science, 3 Pre-Board Science Mocks, and sample papers.",
    descriptionHi: "बोर्ड में उत्कृष्टता: विज्ञान के लिए अध्याय-वार टेस्ट, 3 प्री-बोर्ड विज्ञान मॉक, और नमूना पत्र।",
    price: "₹149",
    generationTitleEn: "Class 10 Science Board Mock (Sample)",
    defaultNumQuestions: 38 
  },
  {
    id: 'class12_board_pack_1',
    categoryId: 'school_boards_class12',
    titleEn: "Class 12 Board Exam Prep Pack (Commerce)",
    titleHi: "कक्षा 12 बोर्ड परीक्षा तैयारी पैक (वाणिज्य)",
    descriptionEn: "Score High: Chapter tests for Accountancy, Business Studies, Economics, 3 Full Pre-Board Mocks.",
    descriptionHi: "उच्च अंक प्राप्त करें: अकाउंटेंसी, बिजनेस स्टडीज, इकोनॉमिक्स के लिए अध्याय टेस्ट, 3 पूर्ण प्री-बोर्ड मॉक।",
    price: "₹229",
    generationTitleEn: "Class 12 Accountancy Board Mock (Sample)", 
    defaultNumQuestions: 34 
  }
];


function getCategoryFromExamTarget(examTarget?: string): string {
  if (!examTarget) return 'all';
  const targetLower = examTarget.toLowerCase().trim();

  // Prioritize direct matches from testCategories (id or nameEn)
  const directMatch = testCategories.find(cat => 
    cat.id.toLowerCase() === targetLower || 
    cat.nameEn.toLowerCase() === targetLower ||
    cat.nameEn.toLowerCase().split('(')[0].trim() === targetLower // Match "NEET UG" from "NEET UG (MBBS...)"
  );
  if (directMatch && directMatch.id !== 'all') return directMatch.id;

  // Broader keyword matching as fallback
  const categoryKeywordsMap: Record<string, string[]> = {
    // Engineering
    engineering_jee_main: ['jee main'], engineering_jee_advanced: ['jee advanced'], engineering_bitsat: ['bitsat'], engineering_viteee: ['viteee'], engineering_srmjee: ['srmjeee'], engineering_met: ['met', 'manipal'], engineering_comedk_uget: ['comedk'], engineering_kiitee: ['kiitee'], engineering_wbjee: ['wbjee'], engineering_mht_cet: ['mht cet eng'], engineering_gujcet: ['gujcet'], engineering_ap_eamcet: ['ap eamcet eng', 'apeamcet eng'], engineering_ts_eamcet: ['ts eamcet eng', 'tseamcet eng'], engineering_kcet: ['kcet eng'], engineering_gate: ['gate'],
    // Medical
    medical_neet_ug: ['neet ug', 'mbbs', 'bds', 'ayush ug', 'b.v.sc', 'neet'], medical_neet_pg: ['neet pg', 'md', 'ms', 'pg diploma'], medical_ini_cet: ['ini cet', 'aiims pg', 'jipmer pg', 'pgimer', 'nimhans pg'], medical_neet_ss: ['neet ss', 'dm', 'mch'], medical_fmge: ['fmge'], medical_aiims_nursing: ['aiims nursing'], medical_army_nursing: ['army nursing', 'mns'], medical_aiapget: ['aiapget', 'pg ayush'],
    // Management
    management_cat: ['cat'], management_xat: ['xat'], management_cmat: ['cmat'], management_snap: ['snap'], management_nmat: ['nmat'], management_mat: ['mat'], management_atma: ['atma'], management_iift: ['iift'], management_tissnet: ['tissnet'], management_ibsat: ['ibsat'], management_micat: ['micat'], management_gmat_indian_b: ['gmat'],
    // Law
    law_clat_ug_pg: ['clat'], law_ailet_ug_pg: ['ailet'], law_lsat_india: ['lsat india'], law_slat: ['slat'], law_mh_cet_law: ['mh cet law'], law_ap_lawcet: ['ap lawcet'], law_ts_lawcet: ['ts lawcet'], law_kerala_klee: ['kerala klee', 'klee'], law_pcs_j: ['judicial services', 'pcs-j'],
    // Govt
    govt_upsc_cse: ['upsc cse', 'ias', 'ips', 'civil services'], govt_upsc_ifos: ['upsc ifos', 'ifs'], govt_upsc_ese_ies: ['upsc ese', 'ies'], govt_upsc_geo_scientist: ['geo-scientist'], govt_upsc_cms: ['upsc cms'], govt_upsc_capf: ['capf'],
    govt_ssc_cgl: ['ssc cgl'], govt_ssc_chsl: ['ssc chsl'], govt_ssc_je: ['ssc je'], govt_ssc_stenographer: ['ssc steno'], govt_ssc_mts: ['ssc mts'], govt_ssc_gd_constable: ['ssc gd'], govt_ssc_cpo: ['ssc cpo'],
    govt_ibps_po: ['ibps po'], govt_ibps_clerk: ['ibps clerk'], govt_ibps_so: ['ibps so'], govt_ibps_rrb: ['ibps rrb'],
    govt_sbi_po: ['sbi po'], govt_sbi_clerk: ['sbi clerk'], govt_sbi_so: ['sbi so'],
    govt_rbi_grade_b: ['rbi grade b'], govt_rbi_assistant: ['rbi assistant'],
    govt_nabard: ['nabard'], govt_lic_aao_ado: ['lic aao', 'lic ado'], govt_insurance_other: ['uiic', 'niacl', 'oicl', 'insurance exam'], govt_esic_fci: ['esic', 'fci'],
    govt_rrb_ntpc: ['rrb ntpc', 'railway ntpc'], govt_rrb_je: ['rrb je'], govt_rrb_alp: ['rrb alp'], govt_rrb_group_d: ['rrb group d'],
    govt_state_psc: ['state psc', 'public service commission'], govt_state_police: ['state police', 'police recruitment'], govt_high_court: ['high court exam'],
    // Defence
    defence_nda_na: ['nda', 'na exam'], defence_cds: ['cds'], defence_afcat: ['afcat'], defence_inet: ['inet'], defence_army_tes: ['army tes'], defence_navy_sailors: ['navy sailor', 'ssr', 'aa', 'mr'], defence_airforce_airmen: ['airforce airmen', 'group x', 'group y'], defence_coast_guard: ['coast guard', 'navik', 'yantrik'], defence_territorial_army: ['territorial army'],
    // University
    uni_cuet_ug: ['cuet ug'], uni_cuet_pg: ['cuet pg'], uni_jmi_entrance: ['jmi entrance', 'jamia millia'], uni_amu_entrance: ['amu entrance', 'aligarh muslim'],
    // Design
    design_nid_dat: ['nid dat'], design_uceed_ceed: ['uceed', 'ceed'], design_nift_entrance: ['nift'], design_nata: ['nata'], design_jee_main_p2: ['jee paper 2', 'b.arch', 'b.plan'], design_aieed: ['aieed'],
    // Hotel Management
    hotel_mgmt_nchm_jee: ['nchm jee', 'hotel management entrance'], hotel_mgmt_state_ihm: ['state ihm'],
    // Agriculture
    agri_vet_icar_aieea: ['icar aieea', 'agriculture entrance', 'veterinary science'], agri_vet_state_agri_uni: ['state agriculture university'],
    // Teaching
    teaching_ctet: ['ctet'], teaching_state_tet: ['state tet', 'tet'], teaching_ugc_net: ['ugc net'], teaching_csir_ugc_net: ['csir net'], teaching_set_slet: ['set exam', 'slet'], teaching_kvs_nvs_dsssb: ['kvs', 'nvs', 'dsssb'], teaching_bed_entrance: ['b.ed entrance'],
    // Pharmacy
    pharmacy_gpat: ['gpat'], pharmacy_state_cet_bpharm: ['b.pharm cet'], pharmacy_niper_jee: ['niper jee'],
    // Research
    research_fellowship_phd: ['research fellowship', 'phd entrance', 'jrf'],
    // Commerce
    commerce_ca: ['ca foundation', 'ca inter', 'ca final', 'chartered accountant'], commerce_cs: ['cs cseet', 'cs executive', 'cs professional', 'company secretary'], commerce_cma: ['cma foundation', 'cma inter', 'cma final', 'cost management accountant'],
    // Olympiads
    school_olympiads_ntse: ['ntse'], school_olympiads_kvpy: ['kvpy'], school_olympiads_sof: ['sof olympiad', 'nso', 'imo', 'ieo'], school_olympiads_homi_bhabha: ['homi bhabha'],
    // School Boards
    school_boards_class10: ['class 10 board', '10th board', 'matriculation', 'class 10'],
    school_boards_class12: ['class 12 board', '12th board', 'intermediate', 'class 12'],
  };

  for (const categoryId in categoryKeywordsMap) {
    if (categoryKeywordsMap[categoryId].some(keyword => targetLower.includes(keyword))) {
      return categoryId;
    }
  }
  
  return 'all';
}


export default function TestSeriesPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<TestSeriesRecommendationOutput | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileString = localStorage.getItem('userProfileData');
      if (storedProfileString) {
        try {
          const parsedProfile = JSON.parse(storedProfileString) as ProfileFormData;
          setProfileData(parsedProfile);
          if (parsedProfile.examTarget) {
            const categoryId = getCategoryFromExamTarget(parsedProfile.examTarget);
            if (testCategories.some(cat => cat.id === categoryId)) {
              setSelectedTestCategory(categoryId);
            }
          } else if (parsedProfile.className) { 
             const categoryId = getCategoryFromExamTarget(parsedProfile.className.toLowerCase());
             if (testCategories.some(cat => cat.id === categoryId)) {
               setSelectedTestCategory(categoryId);
             }
          }
        } catch (e) {
          console.error("Failed to parse profile for Test Series page:", e);
        }
      }
    }
  }, []);

  const handleGetRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setRecommendationError(null);
    setRecommendations(null);

    const studentNameFromProfile = profileData?.fullName || "Student";
    const examTargetFromProfile = profileData?.examTarget || "General Competitive Exam"; 

    const dynamicStudentInput: TestSeriesRecommendationInput = {
        studentName: studentNameFromProfile,
        examType: examTargetFromProfile, 
        preferredLanguage: 'en', 
        lastTestPerformances: [ 
            { title: "General Aptitude Mock 1", score: "70/100", weakTopics: ["Quantitative Reasoning", "Logical Puzzles"] },
            { title: "Subject Proficiency Test - Physics", score: "60/100", weakTopics: ["Rotational Motion", "Thermodynamics"] },
             { title: `Previous ${examTargetFromProfile} Mock`, score: "65%", weakTopics: ["Topic A", "Topic B"] }
        ],
        availableTestSets: [ 
            { title: `${examTargetFromProfile} Full Syllabus Mock (Set A)`, subject: "All", level: "Medium" },
            { title: `${examTargetFromProfile} - Advanced Problems`, subject: "Mixed", level: "Hard" },
            { title: "General Knowledge Booster", subject: "GK", level: "Medium" },
            { title: "Verbal Ability Challenge", subject: "English", level: "Tough" },
            { title: "JEE Main Physics Practice Set 1", subject: "Physics", level: "Medium"},
            { title: "NEET UG Biology Concept Reviewer", subject: "Biology", level: "Medium"},
            { title: "CAT Quantitative Aptitude Drills", subject: "Maths", level: "Hard"},
            { title: "UPSC Prelims Current Affairs Quiz", subject: "Current Affairs", level: "Medium"},
        ]
    };

    try {
        const result = await getTestSeriesRecommendations(dynamicStudentInput);
        setRecommendations(result);
    } catch (err: any) {
        console.error("Error getting test recommendations:", err);
        setRecommendationError(err.message || "Failed to get recommendations. Guruji might be busy.");
        toast({
            title: "Recommendation Error",
            description: err.message || "Guruji couldn't fetch recommendations right now. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoadingRecommendations(false);
    }
  };


  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
              <Target className="h-8 w-8 text-primary"/>
              <BilingualText en="Test Series" hi="टेस्ट सीरीज़" />
          </h1>
          <p className="text-muted-foreground">
              <BilingualText en="Practice and ace your exams." hi="अभ्यास करें और अपनी परीक्षाओं में उत्कृष्टता प्राप्त करें।" />
          </p>
        </header>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <BilingualText en="Back" hi="वापस"/>
        </Button>
      </div>

      <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <BrainCircuit className="h-7 w-7"/>
                <BilingualText en="Guruji's Recommendations" hi="गुरुजी की सिफारिशें" />
            </CardTitle>
            <CardDescription>
                <BilingualText en="Get personalized test series suggestions from Guruji based on your profile and (mock) performance." hi="गुरुजी से अपनी प्रोफ़ाइल और (मॉक) प्रदर्शन के आधार पर व्यक्तिगत टेस्ट सीरीज़ सुझाव प्राप्त करें।" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleGetRecommendations} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoadingRecommendations}>
                {isLoadingRecommendations ? <LoadingSpinner size={20}/> : <Rocket className="mr-2 h-5 w-5" />}
                <BilingualText en="Ask Guruji for Recommendations" hi="गुरुजी से सिफारिशें पूछें" />
            </Button>
        </CardContent>
      </Card>

      {isLoadingRecommendations && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <LoadingSpinner size={32} />
          <p className="text-muted-foreground"><BilingualText en="Guruji is analyzing your profile..." hi="गुरुजी आपकी प्रोफ़ाइल का विश्लेषण कर रहे हैं..." /></p>
        </div>
      )}

      {recommendationError && !isLoadingRecommendations && (
         <Alert variant="destructive">
            <AlertTitle><BilingualText en="Error Fetching Recommendations" hi="सिफारिशें प्राप्त करने में त्रुटि" /></AlertTitle>
            <AlertDescription>{recommendationError}</AlertDescription>
        </Alert>
      )}

      {recommendations && !isLoadingRecommendations && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-headline text-primary"><BilingualText en="Guruji's Advice for You" hi="आपके लिए गुरुजी की सलाह"/></CardTitle>
                <CardDescription>
                    <BilingualText en={`Language: ${recommendations.respondedInLanguage.toUpperCase()}`} hi={`भाषा: ${recommendations.respondedInLanguage.toUpperCase()}`} />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap">{recommendations.gurujiAdvice}</p>
                </Card>
                
                {recommendations.recommendedTests.length > 0 && (
                    <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                           <FileText size={18}/> <BilingualText en="Recommended Tests:" hi="अनुशंसित परीक्षण:" />
                        </h4>
                        <div className="space-y-3">
                            {recommendations.recommendedTests.map((test, index) => (
                                <Card key={index} className="overflow-hidden border hover:shadow-md transition-shadow">
                                    <CardHeader className="p-3 bg-card">
                                        <CardTitle className="text-md font-semibold text-primary flex items-center gap-2">
                                            <Target size={18}/> {test.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 text-xs text-muted-foreground">
                                        <p className="mb-2">{test.reason}</p>
                                    </CardContent>
                                     <CardFooter className="p-3 bg-card border-t">
                                         <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                            <Link href={`/attempt-test?title=${encodeURIComponent(test.title)}`}>
                                                <BilingualText en="Attempt Test" hi="टेस्ट दें"/>
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                 {recommendations.recommendedTests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-3"><BilingualText en="Guruji didn't find specific tests for you right now, but gave some general advice. Keep learning!" hi="गुरुजी को अभी आपके लिए कोई विशिष्ट परीक्षण नहीं मिला, लेकिन कुछ सामान्य सलाह दी। सीखते रहें!"/></p>
                 )}
            </CardContent>
        </Card>
      )}
      
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          <BilingualText en="Featured Test Series" hi="विशेष रुप से प्रदर्शित टेस्ट सीरीज़" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTests.map(test => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="text-md font-semibold text-primary"><BilingualText en={test.titleEn} hi={test.titleHi} /></CardTitle>
                <CardDescription className="text-xs"><BilingualText en={test.descriptionEn} hi={test.descriptionHi} /></CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-bold text-accent">{test.price}</p>
              </CardContent>
              <CardFooter>
                <Button asChild size="sm" className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
                  <Link href={`/attempt-test?id=${test.id}&title=${encodeURIComponent(test.generationTitleEn || test.titleEn)}${test.defaultNumQuestions ? `&numQuestions=${test.defaultNumQuestions}` : ''}&examType=${encodeURIComponent(testCategories.find(tc => tc.id === test.categoryId)?.nameEn || test.generationTitleEn || test.titleEn)}`}>
                     <BilingualText 
                        en="Attempt Sample Full Test"
                        hi="सैंपल पूर्ण टेस्ट दें" 
                    />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <div className="my-6">
        <Label htmlFor="testCategoryFilter" className="text-md font-semibold text-foreground mb-2 block">
          <BilingualText en="Browse Test Categories" hi="टेस्ट श्रेणियां ब्राउज़ करें" />
        </Label>
        <Select value={selectedTestCategory} onValueChange={setSelectedTestCategory}>
          <SelectTrigger id="testCategoryFilter" className="h-11">
            <SelectValue placeholder={<BilingualText en="Select Exam Category" hi="परीक्षा श्रेणी चुनें" />} />
          </SelectTrigger>
          <SelectContent>
            {testCategories.map(exam => (
              <SelectItem key={exam.id} value={exam.id}>
                <BilingualText en={exam.nameEn} hi={exam.nameHi} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCategories.filter(category => selectedTestCategory === 'all' || category.id === selectedTestCategory).map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline"><BilingualText en={category.nameEn} hi={category.nameHi} /></CardTitle>
                    <CardDescription><BilingualText en={category.descriptionEn || ""} hi={category.descriptionHi || ""} /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/attempt-test?examType=${encodeURIComponent(category.nameEn)}&title=${encodeURIComponent(category.nameEn + " Mock Test")}`}>
                        <BilingualText en="View Tests" hi="टेस्ट देखें" />
                      </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
         {selectedTestCategory !== 'all' && !testCategories.find(tc => tc.id === selectedTestCategory) && (
          <Card className="md:col-span-2 text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                <BilingualText 
                    en={`No specific category found for "${selectedTestCategory}". Showing all categories below or adjust filter.`} 
                    hi={`"${selectedTestCategory}" के लिए कोई विशिष्ट श्रेणी नहीं मिली। नीचे सभी श्रेणियां देखें या फ़िल्टर समायोजित करें।`}
                />
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="font-headline text-accent"><BilingualText en="Why OSO Test Series?" hi="OSO टेस्ट सीरीज़ क्यों?" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p><BilingualText en="✓ AI-powered performance analysis" hi="✓ एआई-संचालित प्रदर्शन विश्लेषण" /></p>
            <p><BilingualText en="✓ Real exam simulation" hi="✓ वास्तविक परीक्षा सिमुलेशन" /></p>
            <p><BilingualText en="✓ Detailed solutions and explanations" hi="✓ विस्तृत समाधान और स्पष्टीकरण" /></p>
        </CardContent>
      </Card>
    </div>
  );
}

declare module "@radix-ui/react-select" {
  interface SelectValueProps {
    placeholder_en?: string;
    placeholder_hi?: string;
  }
}
