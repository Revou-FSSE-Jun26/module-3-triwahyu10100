import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold">Produk tidak ditemukan</h2>
      <p className="mt-2 text-gray-600">
        Produk yang kamu cari mungkin sudah dihapus atau tidak pernah ada.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-block text-blue-600 underline">
        Kembali ke daftar produk
      </Link>
    </div>
  );
}
