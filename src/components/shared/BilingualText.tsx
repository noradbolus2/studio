import type { FC } from 'react';

interface BilingualTextProps {
  en: string;
  hi: string;
  className?: string;
  separator?: string;
  hiClassName?: string;
}

export const BilingualText: FC<BilingualTextProps> = ({ en, hi, className, separator = " / ", hiClassName = "text-sm text-muted-foreground opacity-80" }) => {
  return (
    <span className={className}>
      {en}
      <span className={hiClassName}>
        {separator}{hi}
      </span>
    </span>
  );
};
