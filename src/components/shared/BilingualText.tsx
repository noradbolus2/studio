
import type { FC } from 'react';

interface BilingualTextProps {
  en: string;
  hi: string;
  hng?: string;
  lang?: 'en' | 'hi' | 'hng';
  className?: string;
  separator?: string; 
  hiClassName?: string;
}

export const BilingualText: FC<BilingualTextProps> = ({ en, hi, hng, lang, className, separator, hiClassName }) => {
  if (lang === 'hi') {
    return <span className={className}>{hi || en}</span>;
  }
  if (lang === 'hng') {
    // For Hinglish, use the specific 'hng' prop if provided, otherwise default to English.
    return <span className={className}>{hng || en}</span>;
  }
  
  // Default to English if lang is 'en' or not provided
  return <span className={className}>{en}</span>;
};
