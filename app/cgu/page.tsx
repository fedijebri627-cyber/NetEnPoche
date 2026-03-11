import type { Metadata } from 'next';
import Link from 'next/link';
import { NETENPOCHE_CONTACT_EMAIL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'CGU',
  description: 'Conditions Générales d’Utilisation de NetEnPoche.',
};

const sections = [
  {
    title: '1. Objet',
    body:
      'Les présentes Conditions Générales d’Utilisation définissent les règles d’accès et d’usage du service NetEnPoche, accessible en ligne et destiné aux micro-entrepreneurs souhaitant piloter leur activité, leurs estimations URSSAF, TVA et impôt.',
  },
  {
    title: '2. Nature du service',
    body:
      'NetEnPoche fournit des outils de simulation, de visualisation et d’organisation financière. Les calculs proposés constituent une aide au pilotage et ne remplacent ni les obligations déclaratives officielles, ni un conseil juridique, fiscal ou comptable personnalisé.',
  },
  {
    title: '3. Accès au service',
    body:
      'L’accès à certaines fonctionnalités nécessite la création d’un compte. L’utilisateur s’engage à fournir des informations exactes et à conserver la confidentialité de ses identifiants.',
  },
  {
    title: '4. Abonnements et paiements',
    body:
      'Certaines fonctionnalités sont accessibles via un abonnement payant. Les paiements sont traités par un prestataire tiers sécurisé. L’utilisateur reste responsable de la vérification des conditions tarifaires affichées au moment de sa souscription.',
  },
  {
    title: '5. Responsabilité',
    body:
      'NetEnPoche met en œuvre des efforts raisonnables pour assurer la disponibilité et la fiabilité du service. Toutefois, aucune garantie absolue n’est donnée quant à l’absence d’erreur, d’interruption ou à l’adéquation parfaite du service à chaque situation individuelle.',
  },
  {
    title: '6. Contact',
    body:
      `Pour toute question relative à ces CGU, vous pouvez écrire à ${NETENPOCHE_CONTACT_EMAIL}.`,
  },
];

export default function CguPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-semibold text-slate-700">
            CGU
          </div>
          <h1 className="font-syne text-4xl font-black text-slate-900">Conditions Générales d’Utilisation</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Dernière mise à jour : 11 mars 2026. Ces conditions encadrent l’utilisation du service NetEnPoche.
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

