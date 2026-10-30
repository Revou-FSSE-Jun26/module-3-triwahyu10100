"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/format";
import { Container } from "@/components/layout/Container";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalPrice, clear } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Bug ditemukan lewat e2e/shopping.spec.ts (FEAT-005): clear() di akhir
  // handleSubmit yang sukses membuat lines.length jadi 0 PADA KOMPONEN INI
  // juga (belum ter-unmount), yang memicu ulang efek di bawah dan
  // router.replace("/cart") — balapan dengan router.push("/orders") yang
  // dipanggil tepat setelah clear(), kadang membuat pengguna malah
  // terdampar di /cart setelah checkout justru berhasil. Ref ini dipakai
  // untuk membedakan "keranjang kosong karena baru checkout" dari
  // "keranjang kosong karena diakses langsung tanpa isi".
  const orderPlacedRef = useRef(false);

  // Checkout tanpa item tidak punya arti dan backend juga akan
  // menolaknya ("items must be a non-empty list") — dicegat di client
  // sebelum sempat mengirim request yang pasti gagal.
  useEffect(() => {
    if (lines.length === 0 && !orderPlacedRef.current) {
      router.replace("/cart");
    }
  }, [lines.length, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError("Alamat pengiriman wajib diisi.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_address: shippingAddress.trim(),
          items: lines.map((line) => ({
            product_id: line.product.id,
            quantity: line.quantity,
          })),
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error ?? "Checkout gagal, coba lagi.");
      }
      orderPlacedRef.current = true; // lihat komentar di deklarasi ref di atas
      clear(); // useCart().clear() — hanya dipanggil SETELAH respons sukses
      toast.success("Pesanan berhasil dibuat.");
      router.push("/orders");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Checkout gagal, coba lagi.";
      setError(message);
      toast.error(`Gagal: ${message}`);
      // Keranjang SENGAJA tidak disentuh di sini — kegagalan (401 sesi
      // habis, 400 stok kurang, dkk.) tidak boleh menghilangkan isi
      // keranjang user.
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    // Sedang menunggu redirect dari useEffect di atas selesai —
    // hindari merender form checkout sesaat untuk keranjang kosong.
    return null;
  }

  return (
    <Container>
      <div className="grid gap-10 py-10 sm:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <h1 className="text-h1">Checkout</h1>
          <div>
            <label
              htmlFor="shipping_address"
              className="block text-caption font-medium text-foreground">
              Alamat Pengiriman
            </label>
            <textarea
              id="shipping_address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted transition-colors motion-safe:duration-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-caption text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors motion-safe:duration-base hover:bg-accent/90 disabled:opacity-60">
            {submitting ? "Memproses..." : "Buat Pesanan"}
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="text-h2">Ringkasan Pesanan</h2>
          <ul className="divide-y divide-border">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-center justify-between py-2 text-body">
                <span>
                  {line.product.product_name} × {line.quantity}
                </span>
                <span className="font-medium">
                  {formatRupiah(line.product.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="text-h3">{formatRupiah(totalPrice)}</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
