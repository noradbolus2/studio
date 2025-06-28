
import type { FC } from 'react';

interface BilingualTextProps {
  en: string;
  hi: string;
  lang?: 'en' | 'hi' | 'hng'; // Hinglish added
  className?: string;
  separator?: string; 
  hiClassName?: string;
}

export const BilingualText: FC<BilingualTextProps> = ({ en, hi, lang, className, separator, hiClassName }) => {
  if (lang === 'hi') {
    return <span className={className}>{hi}</span>;
  }
  if (lang === 'hng') {
    // This is a simple implementation. In a real app, you might have a dedicated Hinglish string.
    // For now, it defaults to showing English as it's the most common base in Hinglish.
    return <span className={className}>{en}</span>;
  }
  
  // Default to English if lang is 'en' or not provided
  return <span className={className}>{en}</span>;
};
