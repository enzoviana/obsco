import nodemailer from "nodemailer";

// Configuration du transporteur email
// En développement, on peut utiliser Ethereal (faux SMTP pour tester)
// En production, configurez vos variables d'environnement SMTP

const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && process.env.SMTP_HOST) {
    // Configuration SMTP réelle pour la production
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true pour le port 465, false pour les autres
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // En développement : log les emails dans la console au lieu de les envoyer
    console.log("⚠️  Mode développement : les emails seront affichés dans la console");
    return null;
  }
};

const transporter = createTransporter();

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(options: EmailOptions) {
  const from = process.env.SMTP_FROM || "noreply@datafuse.app";

  if (!transporter) {
    // Mode développement : afficher l'email dans la console
    console.log("\n📧 ===== EMAIL (DEV MODE) =====");
    console.log(`De: ${from}`);
    console.log(`À: ${options.to}`);
    console.log(`Sujet: ${options.subject}`);
    console.log(`\n${options.text || "Voir HTML"}`);
    console.log("================================\n");
    return { success: true, messageId: "dev-mode-" + Date.now() };
  }

  try {
    const info = await transporter.sendMail({
      from: `"DATAFUSE" <${from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("✅ Email envoyé:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email:", error);
    throw new Error("Échec de l'envoi de l'email");
  }
}

export function generateWelcomeEmail(pharmacyName: string, email: string, temporaryPassword: string) {
  const loginUrl = process.env.FRONTEND_URL || "https://obsco.vercel.app";

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur OBSCO</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .header { background-color: #2b4665; color: #ffffff; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; background: #ffffff; }
        .credentials { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; margin: 24px 0; }
        .credential-row { margin: 12px 0; font-size: 15px; }
        .label { font-weight: 600; color: #4b5563; display: inline-block; width: 180px; }
        .value { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; background: #eaedf1; padding: 4px 8px; border-radius: 4px; color: #111827; font-size: 14px; }
        .btn-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background-color: #3b5a7f; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(43, 70, 101, 0.2); }
        .warning { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 4px 4px 0; font-size: 14px; color: #78350f; }
        .features { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
        .features-list { padding-left: 20px; color: #4b5563; }
        .features-list li { margin-bottom: 8px; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding: 0 20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">OBSCO</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Solution de gestion officinale</p>
          </div>
          <div class="content">
            <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 600;">Configuration de votre espace officine</h2>
            <p style="color: #4b5563;">Bonjour,</p>
            <p style="color: #4b5563;">Votre compte d'accès pour l'officine <strong>${pharmacyName}</strong> a été initialisé avec succès sur la plateforme OBSCO.</p>

            <div class="credentials">
              <h3 style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: 15px; font-weight: 600;">Vos identifiants de connexion</h3>
              <div class="credential-row">
                <span class="label">Identifiant (Email) :</span>
                <span class="value">${email}</span>
              </div>
              <div class="credential-row">
                <span class="label">Mot de passe provisoire :</span>
                <span class="value">${temporaryPassword}</span>
              </div>
            </div>

            <div class="warning">
              <strong>Mesure de sécurité :</strong> Par mesure de confidentialité réglementaire, vous serez invité à modifier ce mot de passe temporaire dès votre première connexion.
            </div>

            <div class="btn-container">
              <a href="${loginUrl}/login" class="button" target="_blank">Accéder à l'espace OBSCO</a>
            </div>

            <div class="features">
              <h4 style="color: #111827; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Pour rappel, votre suite OBSCO inclut :</h4>
              <ul class="features-list">
                <li>Gestion centralisée des stocks et inventaires officinaux</li>
                <li>Suivi analytique des ventes, marges et indicateurs clés</li>
                <li>Optimisation des commandes fournisseurs et groupements (grossistes/répartiteurs)</li>
                <li>Outils de conformité et tableaux de bord en temps réel</li>
              </ul>
            </div>

            <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">Notre support technique reste à votre entière disposition pour vous accompagner dans la prise en main de l'outil.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 OBSCO · Plateforme de Gestion de Pharmacie<br>Cet email est automatisé, merci de ne pas y répondre directement.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
OBSCO — Solution de gestion officinale

Bonjour,

Votre compte d'accès pour l'officine ${pharmacyName} a été initialisé avec succès sur la plateforme OBSCO.

Vos identifiants de connexion :
- Identifiant : ${email}
- Mot de passe provisoire : ${temporaryPassword}

Mesure de sécurité : Vous serez invité à modifier ce mot de passe temporaire dès votre première connexion.

Accéder à l'espace OBSCO : ${loginUrl}/login

© 2026 OBSCO
  `.trim();

  return { html, text };
}

export function generatePasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.FRONTEND_URL || "https://obsco.vercel.app"}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de mot de passe - OBSCO</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .header { background-color: #1f2937; color: #ffffff; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; background: #ffffff; }
        .btn-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background-color: #3b5a7f; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding: 0 20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700;">OBSCO</h1>
          </div>
          <div class="content">
            <h2 style="color: #111827; margin-top: 0; font-size: 18px; font-weight: 600;">Demande de réinitialisation de mot de passe</h2>
            <p style="color: #4b5563;">Bonjour,</p>
            <p style="color: #4b5563;">Nous avons reçu une demande de réinitialisation de mot de passe pour le compte associé à l'adresse <strong>${email}</strong>.</p>
            <p style="color: #4b5563;">Pour configurer un nouveau mot de passe, veuillez cliquer sur le lien sécurisé ci-dessous :</p>
            
            <div class="btn-container">
              <a href="${resetUrl}" class="button" target="_blank">Réinitialiser mon mot de passe</a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px;"><em>Ce lien de sécurité est à usage unique et expirera automatiquement dans 24 heures.</em></p>
            <p style="color: #6b7280; font-size: 13px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 16px;">Si vous n'êtes pas à l'origine de cette demande, aucune action n'est requise. Votre mot de passe actuel reste inchangé et parfaitement sécurisé.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 OBSCO · Secrétariat et support technique</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
OBSCO — Réinitialisation de votre mot de passe

Bonjour,

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte OBSCO.

Veuillez utiliser le lien ci-dessous pour configurer un nouveau mot de passe (valable pendant 24h) :
${resetUrl}

Si vous n'avez pas demandé cette modification, vous pouvez ignorer cet email en toute sécurité.

© 2026 OBSCO
  `.trim();

  return { html, text };
}
 