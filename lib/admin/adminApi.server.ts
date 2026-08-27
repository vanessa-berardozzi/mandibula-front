import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://mandibula-back.onrender.com";

export type AdminFetchResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; data: null };

/**
 * Appel serveur vers le backend en relayant le cookie de session de la requête courante.
 */
export async function fetchAdmin<T>(path: string): Promise<AdminFetchResult<T>> {
  const cookieHeader = (await cookies()).toString();

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, status: res.status, data: null };
    }

    return { ok: true, status: res.status, data: (await res.json()) as T };
  } catch (error) {
    console.error(`[Admin API] ${path}`, error);
    return { ok: false, status: 502, data: null };
  }
}
