"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!email.trim() || !password) {
      setServerError("Email dan password wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      // Toast di sini SENGAJA ada (jawaban temuan review #2 — tabel toast
      // di bagian "Toast" sudah disamakan dengan kode ini, bukan sebaliknya):
      // redirect lewat router.push() tidak selalu terasa instan secara
      // visual (masih ada satu frame render lama sebelum navigasi App
      // Router rampung), jadi toast memberi konfirmasi langsung di titik
      // yang sama.
      toast.success(`Selamat datang kembali, ${user.first_name}.`);
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      // Jawaban temuan review #5: jangan samakan SEMUA jenis kegagalan jadi
      // "Email atau password salah" — itu hanya benar untuk 401 (perilaku
      // generik backend yang memang disengaja, lihat login() di
      // backend/app/routes/user_routes.py: pesan yang sama untuk user tidak
      // ada/password salah/akun soft-deleted, demi tidak membocorkan info).
      // Kegagalan lain (400 body kosong dari proxy, 502 "Tidak dapat
      // terhubung ke server..." saat Flask down) punya pesan sendiri dari
      // AuthContext.login yang HARUS ditampilkan apa adanya — menimpanya
      // dengan "Email atau password salah" akan membuat user mengira
      // password-nya salah padahal servernya yang sedang bermasalah.
      const BACKEND_GENERIC_MESSAGE = "Invalid email or password";
      const message =
        err instanceof Error && err.message !== BACKEND_GENERIC_MESSAGE
          ? err.message
          : "Email atau password salah";
      setServerError(message);
      toast.error(message);
      // Sengaja TIDAK redirect — user tetap di /login, field password
      // dikosongkan ulang supaya tidak mengundang percobaan berulang dengan
      // nilai yang sama persis tanpa disadari.
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
        {submitting ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
