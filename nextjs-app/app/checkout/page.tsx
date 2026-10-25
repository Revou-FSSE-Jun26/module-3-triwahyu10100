"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/format";

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
    <div className="grid gap-8 px-4 py-8 sm:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div>
          <label
            htmlFor="shipping_address"
            className="block text-sm font-medium text-gray-700">
            Alamat Pengiriman
          </label>
          <textarea
            id="shipping_address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Memproses..." : "Buat Pesanan"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Ringkasan Pesanan</h2>
        <ul className="divide-y divide-gray-200">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="flex items-center justify-between py-2">
              <span>
                {line.product.product_name} × {line.quantity}
              </span>
              <span className="font-medium">
                {formatRupiah(line.product.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">{formatRupiah(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
