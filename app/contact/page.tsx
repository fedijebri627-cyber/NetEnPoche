import type { Metadata } from 'next';
import Link from 'next/link';
import { NETENPOCHE_CONTACT_EMAIL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez NetEnPoche pour une question produit, support ou demande liée à votre compte.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            Contact
          </div>
          <h1 className="font-syne text-4xl font-black text-slate-900">Contacter NetEnPoche</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Une question sur le produit, un besoin d’assistance ou une demande liée à vos données personnelles ?
            Le plus simple est d’écrire à l’adresse ci-dessous.
          </p>
        </div>

        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-syne text-2xl font-bold text-slate-900">E-mail de contact</h2>
            <a
              href={`mailto:${NETENPOCHE_CONTACT_EMAIL}`}
              className="text-lg font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4"
            >
              {NETENPOCHE_CONTACT_EMAIL}
            </a>
            <p className="text-sm leading-7 text-slate-600">
              Pour le support, les demandes générales, les retours produit ou les questions liées à votre compte.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="font-syne text-2xl font-bold text-slate-900">Pages utiles</h2>
            <div className="flex flex-col gap-3 text-sm text-slate-700">
              <Link href="/cgu" className="underline decoration-slate-300 underline-offset-4">Consulter les CGU</Link>
              <Link href="/rgpd" className="underline decoration-slate-300 underline-offset-4">Consulter la politique RGPD</Link>
              <Link href="/" className="underline decoration-slate-300 underline-offset-4">Retour à l’accueil</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

