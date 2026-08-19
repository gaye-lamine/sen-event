/**
 * @file formatters.ts
 * @description Fonctions utilitaires de formatage des nombres, devises et numéros de téléphone.
 */

/**
 * Formate un montant en devise locale (ex: "10 000 F" ou "25 000 FCFA").
 * @param amount - Montant numérique à formater
 * @param currency - Symbole ou code de la devise (par défaut 'F')
 * @returns Chaîne formatée avec séparateurs de milliers
 */
export const formatPrice = (amount: number, currency = 'F'): string => {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return `${formatted} ${currency}`.trim();
};

/**
 * Formate un nombre standard avec séparateurs de milliers (ex: "2 480").
 * @param value - Nombre à formater
 * @returns Chaîne formatée
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

/**
 * Formate une note avec une décimale et virgule française (ex: "4,8").
 * @param rating - Note numérique
 * @returns Chaîne formatée
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1).replace('.', ',');
};
