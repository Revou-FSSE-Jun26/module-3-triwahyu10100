import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function extractErrorMessage(
  body: unknown,
  path: string,
  status: number,
): string {
  const rawError = (body as { error?: unknown } | null)?.error;
  if (typeof rawError === "string") return rawError;
  if (rawError && typeof rawError === "object") {
    return Object.values(rawError as Record<string, unknown>)
      .flat()
      .join(" ");
  }
  return `Permintaan ke ${path} gagal (${status})`;
}

export async function fetchFromApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      // Beberapa provider hosting backend (Cloudflare "Browser
      // Integrity Check" di Helipod, misalnya) menolak request tanpa
      // User-Agent dengan 403. fetch() Node.js di server Vercel tidak
      // mengirim User-Agent secara default, jadi diisi manual di sini.
      "User-Agent": "RevoShopNextjsApp/1.0",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      extractErrorMessage(body, path, response.status),
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

/**
 * Menerjemahkan error dari fetchFromApi() menjadi NextResponse JSON
 * yang bisa langsung di-return dari sebuah Route Handler. Status dan
 * pesan dari ApiError (yang berarti Flask yang menjawab, apapun
 * bentuknya) diteruskan apa adanya — termasuk pesan 409 deletion-guard
 * yang harus tetap verbatim. Error yang BUKAN ApiError (network put
 * down, Flask tidak bisa dihubungi sama sekali) dianggap kegagalan
 * infrastruktur, dicatat ke console.error, dan direspons 502 generik.
 */
export function apiErrorToResponse(
  err: unknown,
  fallbackMessage = "Tidak dapat terhubung ke server. Coba lagi nanti.",
): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("[apiErrorToResponse] kegagalan tak terduga:", err);
  return NextResponse.json({ error: fallbackMessage }, { status: 502 });
}
