import type { Metadata } from 'next';
import {
  buildSeoLandingMetadata,
  getSeoLandingPageOrThrow,
  SeoLandingPageView,
} from '@/components/landing/SeoLandingPage';

const page = getSeoLandingPageOrThrow('versement-liberatoire-auto-entrepreneur');

export const metadata: Metadata = buildSeoLandingMetadata(page);

export default function Page() {
  return <SeoLandingPageView page={page} />;
}
