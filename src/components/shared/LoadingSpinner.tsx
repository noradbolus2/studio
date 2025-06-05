import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-primary', className)}
    />
  );
}

// For Brain Scan specific loading animation
export function BrainLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse-subtle">
        <path d="M12 2a10 10 0 0 0-6.8 17.2c.4.2.7.4.9.7.4.4.8.8 1.3 1.1A10 10 0 0 0 12 22a10 10 0 0 0 7.6-3.9c.4-.4.9-.7 1.3-1.1.2-.3.5-.5.9-.7A10 10 0 0 0 12 2Z"/><path d="M12 12a2.5 2.5 0 0 0-2.5 2.5V17a2.5 2.5 0 0 0 5 0v-2.5A2.5 2.5 0 0 0 12 12Z"/><path d="M20 8.5c.5-.5.5-1 0-1.5A7.48 7.48 0 0 0 12 4a7.48 7.48 0 0 0-8 4.5c-.5.5-.5 1 0 1.5"/><path d="M4.5 12A7.48 7.48 0 0 0 12 20a7.48 7.48 0 0 0 7.5-8"/>
      </svg>
      <p className="text-muted-foreground animate-pulse">Scanning your brain waves...</p>
      <p className="text-xs text-muted-foreground animate-pulse">Generating your Brain Fitness Report...</p>
    </div>
  );
}

// For Pocket School specific loading animation
export function PocketSchoolLoadingAnimation() {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse-subtle">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <p className="text-muted-foreground animate-pulse">Loading lessons for offline use...</p>
        <p className="text-xs text-muted-foreground animate-pulse">OSO Pocket School™ is preparing your content.</p>
      </div>
    );
  }
