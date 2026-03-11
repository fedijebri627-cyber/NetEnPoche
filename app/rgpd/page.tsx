import type { Metadata } from 'next';
import Link from 'next/link';
import { NETENPOCHE_CONTACT_EMAIL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'RGPD',
  description: 'Politique de confidentialité et traitement des données personnelles de NetEnPoche.',
};

const sections = [
  {
    title: '1. Données collectées',
    body:
      'NetEnPoche peut traiter les données que vous fournissez lors de la création du compte, de l’utilisation du produit ou de la souscription à une offre payante : adresse e-mail, informations de profil, données de simulation, informations de facturation et préférences liées à votre activité.',
  },
  {
    title: '2. Finalités',
    body:
      'Ces données sont utilisées pour fournir le service, personnaliser les calculs, gérer les abonnements, envoyer les alertes demandées et répondre à vos demandes de support.',
  },
  {
    title: '3. Base légale',
    body:
      'Le traitement repose selon les cas sur l’exécution du service demandé, le respect d’obligations légales, ou votre consentement lorsque vous choisissez de recevoir certaines communications.',
  },
  {
    title: '4. Durée de conservation',
    body:
      'Les données sont conservées pendant la durée nécessaire au fonctionnement du service, puis archivées ou supprimées selon les exigences légales et techniques applicables.',
  },
  {
    title: '5. Vos droits',
    body:
      'Conformément au RGPD, vous pouvez demander l’accès, la rectification, la suppression, la limitation ou la portabilité de vos données personnelles, ainsi que vous opposer à certains traitements lorsqu’ils sont fondés sur l’intérêt légitime.',
  },
  {
    title: '6. Contact RGPD',
    body:
      `Pour toute demande relative à vos données personnelles, vous pouvez écrire à ${NETENPOCHE_CONTACT_EMAIL}.`,
  },
];

export default function RgpdPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-semibold text-slate-700">
            RGPD
          </div>
          <h1 className="font-syne text-4xl font-black text-slate-900">Politique de confidentialité</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Dernière mise à jour : 11 mars 2026. Cette page résume la manière dont NetEnPoche traite les données
            personnelles liées au service.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="font-syne text-2xl font-bold text-slate-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <Link href="/" className="inline-flex text-sm font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

