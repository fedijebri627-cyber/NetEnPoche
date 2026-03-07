import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Example utility function
export async function sendWelcomeEmail(toEmail: string) {
    try {
        const data = await resend.emails.send({
            from: 'NetEnPoche <bonjour@netenpoche.fr>',
            to: [toEmail],
            subject: 'Bienvenue sur NetEnPoche !',
            html: `
        <div>
          <h1>Bienvenue chez NetEnPoche !</h1>
          <p>Votre compte a bien été créé. Vous pouvez dès à présent réaliser vos premières simulations URSSAF et estimer votre Impôt sur le Revenu.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#6366f1;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px;">Accéder à mon tableau de bord</a>
        </div>
      `
        });
        return data;
    } catch (error) {
        console.error('Failed to send Resend email:', error)
        return null;
    }
}
