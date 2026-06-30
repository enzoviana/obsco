import crypto from "crypto";

/**
 * Génère un mot de passe aléatoire sécurisé
 * Format: 3 mots + 2 chiffres + 1 caractère spécial (ex: "Secure-Pass-Word-42!")
 */
export function generateTemporaryPassword(): string {
  const adjectives = ["Secure", "Strong", "Safe", "Quick", "Smart", "Bright", "Fast", "Clear", "Pure", "True"];
  const nouns = ["Key", "Pass", "Code", "Door", "Lock", "Gate", "Path", "Way", "Link", "Word"];
  const specials = ["!", "@", "#", "$", "%", "^", "&", "*"];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const word = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  const special = specials[Math.floor(Math.random() * specials.length)];

  return `${adj}-${noun}-${word}-${num}${special}`;
}

/**
 * Génère un token de réinitialisation de mot de passe
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Vérifie la force d'un mot de passe
 * Retourne true si le mot de passe est assez fort
 */
export function isPasswordStrong(password: string): boolean {
  // Au moins 8 caractères
  if (password.length < 8) return false;

  // Au moins une majuscule, une minuscule, un chiffre
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
}
