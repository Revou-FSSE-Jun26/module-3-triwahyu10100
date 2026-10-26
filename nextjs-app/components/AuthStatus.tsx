"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function AuthStatus() {
  const { user, isLoading, logout } = useAuth();
  const { clear } = useCart();
  const router = useRouter();

  // Hindari kedipan "Masuk/Daftar" sesaat sebelum localStorage selesai
  // dibaca pada render pertama di client.
  if (isLoading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/login" className="text-gray-600 hover:text-blue-600">
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
          Daftar
        </Link>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    // Keranjang milik akun yang baru logout tidak boleh dibawa ke akun
    // berikutnya yang login di browser yang sama (revoshop_cart tersimpan
    // global, bukan per-akun) — bersihkan di sini, tepat di samping
    // panggilan logout(), supaya keduanya selalu terjadi bersamaan.
    clear();
    toast.success("Anda berhasil keluar.");
    router.push("/");
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-700">
        Hai, <span className="font-semibold">{user.first_name}</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">
        Keluar
      </button>
    </div>
  );
}
