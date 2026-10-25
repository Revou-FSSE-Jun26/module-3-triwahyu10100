"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/format";

export default function CartPage() {
  const { lines, totalPrice, increment, decrement, remove } = useCart();

  function handleRemove(productId: number) {
    remove(productId);
    toast.success("Produk dihapus dari keranjang.");
  }

  return (
    <div className="space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Keranjang Saya</h1>

      {lines.length === 0 ? (
        <div className="space-y-4 py-12 text-center">
          <p className="text-gray-500">Keranjang Anda masih kosong.</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Lanjut belanja
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="py-2">Produk</th>
                <th className="py-2">Jumlah</th>
                <th className="py-2">Harga Satuan</th>
                <th className="py-2">Subtotal</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lines.map((line) => (
                <tr key={line.product.id}>
                  <td className="py-3 font-medium">
                    {line.product.product_name}
                  </td>
                  <td className="py-3">
                    <div
                      className="flex items-center gap-2"
                      role="group"
                      aria-label="Jumlah produk">
                      <button
                        type="button"
                        onClick={() => decrement(line.product.id)}
                        aria-label="Kurangi jumlah"
                        className="h-8 w-8 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500">
                        −
                      </button>
                      <span aria-live="polite">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(line.product.id)}
                        disabled={line.quantity >= line.product.stock_quantity}
                        aria-label="Tambah jumlah"
                        className="h-8 w-8 rounded-full border disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500">
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3">{formatRupiah(line.product.price)}</td>
                  <td className="py-3 font-semibold">
                    {formatRupiah(line.product.price * line.quantity)}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => handleRemove(line.product.id)}
                      className="text-sm text-red-600 hover:text-red-700">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-lg font-semibold">
          Total: {formatRupiah(totalPrice)}
        </p>
        {lines.length === 0 ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Tambahkan produk ke keranjang sebelum checkout."
            className="cursor-not-allowed rounded bg-gray-200 px-4 py-2 text-gray-500">
            Checkout
          </button>
        ) : (
          <Link
            href="/checkout"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Checkout
          </Link>
        )}
      </div>
    </div>
  );
}
