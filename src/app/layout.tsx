
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans, Kalam, Caveat, Dancing_Script, Patrick_Hand, Gochi_Hand, Indie_Flower } from 'next/font/google';

// Configure all fonts using next/font
const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const kalam = Kalam({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-kalam',
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-caveat',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-dancing-script',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-patrick-hand',
});

const gochiHand = Gochi_Hand({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-gochi-hand',
});

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-indie-flower',
});

export const metadata: Metadata = {
  title: {
    default: "OSO App: Learn & Deliver",
    template: "%s | OSO App",
  },
  description: 'Your all-in-one app for learning, study tools, and instant stationery delivery for students in India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${kalam.variable} ${caveat.variable} ${dancingScript.variable} ${patrickHand.variable} ${gochiHand.variable} ${indieFlower.variable} light`}>
      <head>
        <style>
          {`
            :root {
              --primary: 225 87% 50%;
              --background: 0 0% 98%;
              --accent: 50 100% 50%;
            }
          `}
        </style>
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
