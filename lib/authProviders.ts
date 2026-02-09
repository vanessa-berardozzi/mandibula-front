// Fichier utilitaire pour la logique d'auth vers les différents providers
// Pour l'instant, c'est juste une structure, la logique sera branchée plus tard

export type AuthProvider = "google" | "discord" | "facebook";

export function loginWithProvider(provider: AuthProvider) {
  // Ici, on branchera la logique d'auth réelle (redirection OAuth, etc.)
  // Pour l'instant, on laisse en dur
  // eslint-disable-next-line no-console
  console.log(`Login avec le provider : ${provider}`);
}
