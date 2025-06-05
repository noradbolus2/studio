import { BottomNav } from '@/components/core/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20 md:pb-0"> {/* Padding bottom for the nav bar on mobile */}
        <div className="container mx-auto max-w-3xl px-4 py-8"> {/* Constrain width for mobile-like view */}
            {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
