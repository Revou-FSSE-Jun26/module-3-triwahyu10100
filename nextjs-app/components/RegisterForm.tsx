"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!firstName.trim()) next.first_name = "Nama depan wajib diisi.";
    if (!lastName.trim()) next.last_name = "Nama belakang wajib diisi.";
    if (!EMAIL_PATTERN.test(email.trim()))
      next.email = "Format email tidak valid.";
    if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    }
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const { autoLoginFailed } = await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      });
      if (autoLoginFailed) {
        toast.success("Registrasi berhasil. Silakan masuk secara manual.");
        router.push("/login");
      } else {
        toast.success("Registrasi berhasil! Selamat datang di RevoShop.");
        router.push("/"); // registrasi mandiri selalu role=customer -> selalu ke "/"
      }
    } catch (err) {
      // "Gagal: " di depan karena pesan ini (409 email/username duplikat,
      // 400 validasi Marshmallow) adalah teks backend yang diteruskan
      // verbatim — konsisten dengan baris checkout/produk/kategori di
      // tabel toast (bukan LoginForm, yang pesannya adalah terjemahan
      // statis, bukan verbatim — lihat catatan di bagian Toast).
      const message =
        err instanceof Error ? err.message : "Registrasi gagal, coba lagi.";
      setServerError(message);
      toast.error(`Gagal: ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="first_name"
          className="block text-sm font-medium text-gray-700">
          Nama Depan
        </label>
        <input
          id="first_name"
          type="text"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="last_name"
          className="block text-sm font-medium text-gray-700">
          Nama Belakang
        </label>
        <input
          id="last_name"
          type="text"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
        )}
      </div>

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
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
        {submitting ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
