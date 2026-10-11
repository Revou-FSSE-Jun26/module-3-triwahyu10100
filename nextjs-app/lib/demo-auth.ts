/**
 * Modul server-only: login ke backend dengan akun demo dan mengambil
 * daftar pesanan. JANGAN diimpor dari komponen 'use client'.
 *
 * Sebelum /orders bisa dipakai secara lokal, daftarkan akun demo lewat
 * POST /users ke API Flask yang sedang berjalan, lalu isi
 * DEMO_USER_EMAIL / DEMO_USER_PASSWORD di .env.local dengan kredensial
 * akun tersebut.
 */
import { fetchFromApi, ApiError } from "./api";
import type { Order, PaginatedResponse } from "./types";

interface CachedToken {
  token: string;
  expiresAt: number; // epoch ms
}

let cached: CachedToken | null = null;

// Marjin aman: anggap token kedaluwarsa 60 detik lebih awal dari klaim JWT.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;
// Harus sinkron dengan JWT_ACCESS_TOKEN_EXPIRES di backend/config.py (1 jam).
const ASSUMED_TOKEN_LIFETIME_MS = 60 * 60 * 1000;

async function login(): Promise<string> {
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "DEMO_USER_EMAIL / DEMO_USER_PASSWORD belum diatur — isi file .env.local.",
    );
  }
  const { access_token } = await fetchFromApi<{
    access_token: string;
    user: unknown;
  }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return access_token;
}

async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  const token = await login();
  cached = {
    token,
    expiresAt: Date.now() + ASSUMED_TOKEN_LIFETIME_MS - EXPIRY_SAFETY_MARGIN_MS,
  };
  return cached.token;
}

function invalidateToken(): void {
  cached = null;
}

/**
 * Mengambil daftar pesanan memakai token demo. Jika token yang
 * di-cache sudah ditolak backend (401 — kemungkinan kedaluwarsa),
 * token dihapus dari cache dan login dicoba ulang sekali sebelum
 * menyerah.
 */
export async function fetchOrdersWithDemoAuth(): Promise<Order[]> {
  const token = await getToken();
  try {
    const { items } = await fetchFromApi<PaginatedResponse<Order>>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return items;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      invalidateToken();
      const freshToken = await getToken(); // login ulang; melempar error jika gagal
      const { items } = await fetchFromApi<PaginatedResponse<Order>>(
        "/orders",
        {
          headers: { Authorization: `Bearer ${freshToken}` },
        },
      );
      return items;
    }
    throw err; // network error atau kegagalan lain — ditangkap oleh app/orders/error.tsx
  }
}
