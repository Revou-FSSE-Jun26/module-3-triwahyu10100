"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { COOKIE_MAX_AGE_SECONDS } from "@/lib/auth-cookies";
import type { User } from "@/lib/types";

const AUTH_STORAGE_KEY = "revoshop_user";

/** Bentuk nilai yang disimpan ke localStorage — DisplayUser + kapan ia
 * dianggap tidak valid lagi, selaras umur cookie sesi. */
interface StoredAuth {
  user: DisplayUser;
  expiresAt: number; // epoch ms, Date.now() + COOKIE_MAX_AGE_SECONDS * 1000
}

// Diekspor (jawaban temuan review #4) karena ini juga tipe sesungguhnya
// dari AuthContextValue.user — field lain milik User (email, phone,
// address, created_at, deleted_at) TIDAK PERNAH benar-benar tersedia
// setelah reload halaman (tidak pernah disimpan ke localStorage), jadi
// tidak boleh ada kode yang memperlakukan context.user sebagai User
// penuh.
export type DisplayUser = Pick<
  User,
  "id" | "username" | "first_name" | "last_name" | "role"
>;

export interface RegisterFields {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
  address?: string;
}

interface AuthContextValue {
  // DisplayUser, BUKAN User — state context ini hanya pernah diisi dari
  // toDisplayUser(...) (lihat persist() di bawah) atau dari localStorage
  // yang memang cuma menyimpan subset field itu. login()/register()
  // TETAP me-resolve ke User penuh untuk pemanggil langsungnya (lihat
  // signature masing-masing di bawah) — hanya nilai yang disimpan ke
  // state global context ini yang direduksi.
  user: DisplayUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    fields: RegisterFields,
  ) => Promise<{ user: User; autoLoginFailed: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toDisplayUser(user: User): DisplayUser {
  return {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
}

async function parseJsonResponse(response: Response) {
  return response.json().catch(() => null);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // DisplayUser (bukan User) — jawaban temuan review #4. `as User` di
  // draf pertama dokumen ini membungkam TypeScript tanpa membuat
  // datanya benar: field seperti email/phone/address memang tidak
  // pernah ada setelah reload, jadi tipe state ini sekarang jujur
  // mengikuti bentuk data yang sesungguhnya tersimpan.
  const [user, setUser] = useState<DisplayUser | null>(null);
  // true sampai localStorage selesai dibaca pada mount pertama — dipakai
  // AuthStatus untuk menghindari kedipan "Masuk/Daftar" sebelum sesi yang
  // tersimpan sempat terbaca.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredAuth;
        // Jawaban temuan iterasi 2 #2: hanya percaya data tersimpan kalau
        // belum lewat expiresAt-nya. Kalau sudah lewat (cookie sesi pasti
        // sudah dihapus browser juga, karena expiresAt dihitung dari
        // COOKIE_MAX_AGE_SECONDS yang sama), treat seperti belum login
        // sama sekali — jangan tampilkan status login yang sudah basi.
        if (stored.expiresAt > Date.now()) {
          setUser(stored.user);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      // Data tersimpan korup/localStorage tidak tersedia — anggap belum login.
    } finally {
      setIsLoading(false);
    }
  }, []);

  function persist(nextUser: User | null) {
    // Parameter tetap User penuh (nilai asli dari respons login/register),
    // tapi yang disetel ke state context dan localStorage SELALU direduksi
    // dulu lewat toDisplayUser() — konsisten dengan tipe DisplayUser di atas.
    setUser(nextUser ? toDisplayUser(nextUser) : null);
    try {
      if (nextUser) {
        const stored: StoredAuth = {
          user: toDisplayUser(nextUser),
          expiresAt: Date.now() + COOKIE_MAX_AGE_SECONDS * 1000,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Storage penuh / mode privat — state React tetap valid untuk sesi render ini,
      // hanya tidak akan bertahan setelah reload penuh.
    }
  }

  async function login(email: string, password: string): Promise<User> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(body?.error ?? "Email atau password salah");
    }
    persist(body.user as User);
    return body.user as User;
  }

  async function register(fields: RegisterFields) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const body = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(body?.error ?? "Registrasi gagal, coba lagi.");
    }
    if (!body.autoLoginFailed) {
      persist(body.user as User);
    }
    return {
      user: body.user as User,
      autoLoginFailed: Boolean(body.autoLoginFailed),
    };
  }

  async function logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {
      // Kalau pun gagal (jaringan putus dsb), tetap bersihkan state lokal
      // di bawah — tidak ada cookie httpOnly yang bisa dihapus manual dari
      // sini, tapi membiarkan UI tetap "login" padahal user sudah menekan
      // tombol keluar adalah pengalaman yang lebih buruk daripada cookie
      // yang nyangkut sampai kedaluwarsa alami (maksimal 1 jam).
    });
    persist(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
