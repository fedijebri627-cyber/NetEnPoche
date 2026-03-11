import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend/client';
import { NETENPOCHE_CONTACT_EMAIL } from '@/lib/contact';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const destination = process.env.LANDING_CONTACT_EMAIL || NETENPOCHE_CONTACT_EMAIL;

    await Promise.allSettled([
      resend.emails.send({
        from: 'NetEnPoche <admin@netenpoche.fr>',
        to: [destination],
        subject: 'Nouvelle inscription liste prioritaire NetEnPoche',
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Nouvelle inscription landing</h2>
            <p><strong>Email :</strong> ${email}</p>
            <p>Cette personne a demandé à recevoir les prochaines nouveautés NetEnPoche depuis la landing page.</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'NetEnPoche <admin@netenpoche.fr>',
        to: [email],
        subject: 'Vous êtes bien sur la liste prioritaire NetEnPoche',
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Merci pour votre intérêt</h2>
            <p>Vous recevrez uniquement les prochaines mises à jour utiles : nouveaux guides, nouvelles fonctions et ouvertures importantes.</p>
            <p>En attendant, vous pouvez déjà créer votre compte sur <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.netenpoche.fr'}/auth/register">NetEnPoche</a>.</p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Waitlist signup failed', error);
    return NextResponse.json({ error: 'Impossible de vous inscrire pour le moment.' }, { status: 500 });
  }
}


