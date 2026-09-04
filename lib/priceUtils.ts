/**
 * Utilitaires robustes pour gérer les prix
 * Évite les NaN et les erreurs de conversion
 */

/**
 * Convertit n'importe quelle valeur en nombre de prix valide
 * @param value - La valeur à convertir (number, string, undefined, etc.)
 * @param fallback - Valeur par défaut si conversion échoue (défaut: 0)
 * @returns Nombre positif sûr ou fallback
 */
export function toPrice(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }
  return fallback;
}

/**
 * Formate un prix en euros (ex: "12.99")
 * @param value - Le prix à formater
 * @param decimals - Nombre de décimales (défaut: 2)
 * @returns Chaîne formatée
 */
export function formatPrice(value: unknown, decimals: number = 2): string {
  const price = toPrice(value);
  return price.toFixed(decimals);
}

/**
 * Affiche un prix avec devise (ex: "12.99 €")
 * @param value - Le prix à afficher
 * @param currency - Devise (défaut: "€")
 * @param decimals - Nombre de décimales (défaut: 2)
 * @returns Chaîne formatée
 */
export function displayPrice(value: unknown, currency: string = '€', decimals: number = 2): string {
  return `${formatPrice(value, decimals)} ${currency}`;
}

/**
 * Calcule un subtotal à partir d'une liste d'articles
 * @param items - Tableau avec {price, quantity}
 * @returns Subtotal arrondi à 2 décimales
 */
export function calculateSubtotal(items: Array<{ price?: unknown; quantity: number }>): number {
  const sum = items.reduce((acc, item) => {
    const price = toPrice(item.price);
    return acc + price * item.quantity;
  }, 0);
  // Arrondir à 2 décimales pour éviter les erreurs de précision flottante
  return Math.round(sum * 100) / 100;
}

/**
 * Calcule le prix total pour un article
 * @param price - Prix unitaire
 * @param quantity - Quantité
 * @returns Total arrondi
 */
export function calculateTotal(price: unknown, quantity: number): number {
  const p = toPrice(price);
  const total = p * quantity;
  return Math.round(total * 100) / 100;
}

/**
 * Valide qu'une valeur est un prix valide (positif et fini)
 */
export function isValidPrice(value: unknown): boolean {
  const price = toPrice(value);
  return price > 0 && Number.isFinite(price);
}
