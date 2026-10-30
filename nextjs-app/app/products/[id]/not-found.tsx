import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function ProductNotFound() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h2 className="text-h2">Produk tidak ditemukan</h2>
        <p className="mt-2 text-body text-muted">
          Produk yang kamu cari mungkin sudah dihapus atau tidak pernah ada.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block text-accent underline-offset-2 hover:underline">
          Kembali ke daftar produk
        </Link>
      </div>
    </Container>
  );
}
