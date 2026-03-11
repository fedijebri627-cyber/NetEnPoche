import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import { CookieBanner } from '@/components/global/CookieBanner';
import { getConfiguredAppUrl } from '@/lib/app-url';
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

const appUrl = getConfiguredAppUrl();
const defaultTitle = 'NetEnPoche | Calculateur URSSAF auto-entrepreneur, TVA et impôt 2026';
const defaultDescription =
  'Calculez votre net micro-entrepreneur après URSSAF, TVA et impôt sur le revenu. NetEnPoche aide les freelances français à piloter leur activité en temps réel.';

export const metadata: Metadata = {
  title: {
    template: '%s | NetEnPoche',
    default: defaultTitle,
  },
  description: defaultDescription,
  applicationName: 'NetEnPoche',
  metadataBase: new URL(appUrl),
  keywords: [
    'NetEnPoche',
    'calculateur URSSAF',
    'net auto-entrepreneur',
    'TVA micro-entreprise',
    'impôt auto-entrepreneur',
  ],
  icons: {
    icon: '/brand/netenpoche-favicon-32.png',
    apple: '/brand/netenpoche-apple-touch.png',
    shortcut: '/brand/netenpoche-favicon-32.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: appUrl,
    siteName: 'NetEnPoche',
    images: [
      {
        url: '/brand/netenpoche-og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetEnPoche, calculateur URSSAF pour micro-entrepreneurs',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/brand/netenpoche-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'gvmIkCjUPyqOS58IJ_J12s-W05ZaZwy-tevTC2pCqhc',
  },
  category: 'finance',
  creator: 'NetEnPoche',
  publisher: 'NetEnPoche',
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
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="gvmIkCjUPyqOS58IJ_J12s-W05ZaZwy-tevTC2pCqhc" />
        <Script defer data-domain="netenpoche.fr" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

