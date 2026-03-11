import type { Metadata } from 'next';
import { buildSeoCalculatorMetadata, SeoCalculatorPageView } from '@/components/landing/SeoCalculatorPage';
import { getSeoCalculatorPageOrThrow } from '@/lib/seo-calculator-pages';

const page = getSeoCalculatorPageOrThrow('freelance-vs-salarie');

export const metadata: Metadata = buildSeoCalculatorMetadata(page);

export default function Page() {
  return <SeoCalculatorPageView page={page} />;
}
