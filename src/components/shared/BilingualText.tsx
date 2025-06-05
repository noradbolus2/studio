
import type { FC } from 'react';

interface BilingualTextProps {
  en: string;
  hi: string;
  lang?: 'en' | 'hi'; // New optional prop
  className?: string;
  separator?: string;
  hiClassName?: string;
}

export const BilingualText: FC<BilingualTextProps> = ({ en, hi, lang, className, separator = " / ", hiClassName = "text-sm text-muted-foreground opacity-80" }) => {
  if (lang === 'en') {
    return <span className={className}>{en}</span>;
  }
  if (lang === 'hi') {
    return <span className={className}>{hi}</span>;
  }
  // Default behavior: show both if lang prop is not 'en' or 'hi'
  return (
    <span className={className}>
      {en}
      <span className={hiClassName}>
        {separator}{hi}
      </span>
    </span>
  );
};
