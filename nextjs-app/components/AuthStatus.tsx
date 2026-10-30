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
      <div className="flex items-center gap-3 text-caption">
        <Link
          href="/login"
          className="rounded-sm text-muted transition-colors motion-safe:duration-base hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-accent px-3 py-1.5 text-accent-foreground transition-colors motion-safe:duration-base hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
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
    <div className="flex items-center gap-3 text-caption">
      <Link
        href="/account"
        className="rounded-sm text-muted transition-colors motion-safe:duration-base hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
        Hai,{" "}
        <span className="font-semibold text-foreground">{user.first_name}</span>
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-border px-3 py-1.5 text-foreground transition-colors motion-safe:duration-base hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
        Keluar
      </button>
    </div>
  );
}
