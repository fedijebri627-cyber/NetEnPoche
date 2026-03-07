import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import { CookieBanner } from '@/components/global/CookieBanner';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NetEnPoche - L'assistant financier des auto-entrepreneurs",
  description: "Calculez vos cotisations URSSAF et votre impôt sur le revenu en un clic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <Script defer data-domain="netenpoche.fr" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
      <body className={`font-sans antialiased text-slate-900 bg-slate-50`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
