import type { Metadata } from 'next';
import {
  buildSeoLandingMetadata,
  getSeoLandingPageOrThrow,
  SeoLandingPageView,
} from '@/components/landing/SeoLandingPage';

const page = getSeoLandingPageOrThrow('calcul-urssaf');

export const metadata: Metadata = buildSeoLandingMetadata(page);

export default function Page() {
  return <SeoLandingPageView page={page} />;
}