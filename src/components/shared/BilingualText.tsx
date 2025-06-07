
import type { FC } from 'react';

interface BilingualTextProps {
  en: string;
  hi: string;
  lang?: 'en' | 'hi'; // Optional prop to force a language
  className?: string;
  // separator and hiClassName are no longer used by default but kept for potential specific overrides if lang prop is not used.
  separator?: string; 
  hiClassName?: string;
}

export const BilingualText: FC<BilingualTextProps> = ({ en, hi, lang, className }) => {
  if (lang === 'hi') {
    return <span className={className}>{hi}</span>;
  }
  // Default to English if lang is 'en' or lang is not provided
  return <span className={className}>{en}</span>;
};

