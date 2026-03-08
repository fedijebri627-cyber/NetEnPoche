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
  title: {
    template: '%s — NetEnPoche',
    default: 'NetEnPoche — Calculateur URSSAF, TVA et Impôts',
  },
  description: "Calculez votre net en poche après URSSAF, TVA et impôts en temps réel. Gratuit pour les micro-entrepreneurs français.",
  metadataBase: new URL('https://netenpoche.fr'),
  icons: {
    icon: '/brand/netenpoche-favicon-32.png',
    apple: '/brand/netenpoche-apple-touch.png',
    shortcut: '/brand/netenpoche-favicon-32.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'NetEnPoche — Calculateur URSSAF, TVA et Impôts',
    description: 'Calculez votre net en poche après URSSAF, TVA et impôts en temps réel. Gratuit pour les micro-entrepreneurs français.',
    url: 'https://netenpoche.fr',
    siteName: 'NetEnPoche',
    images: [
      {
        url: '/brand/netenpoche-og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NetEnPoche — Combien vous gardez vraiment ?',
    description: 'Calculateur URSSAF, TVA et impôts pour auto-entrepreneurs français.',
    images: ['/brand/netenpoche-og-image.png'],
  },
  other: {
    'theme-color': '#0b1730',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'NetEnPoche',
  },
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
