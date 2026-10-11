import { fetchFromApi } from "@/lib/api";
import { fetchFallbackProducts } from "@/lib/fakestore-fallback";
import { FallbackNotice } from "@/components/FallbackNotice";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product, PaginatedResponse } from "@/lib/types";

export default async function HomePage() {
  let items: Product[];
  let isFallback = false;
  try {
    const response = await fetchFromApi<PaginatedResponse<Product>>(
      "/products?per_page=5",
    );
    items = response.items;
  } catch {
    // Flask API lokal tidak bisa dijangkau — pakai fallback SEMENTARA dari
    // fakestoreapi.com supaya katalog tidak kosong total saat development.
    items = await fetchFallbackProducts({ per_page: 5 });
    isFallback = true;
  }
  return (
    <section className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Produk Pilihan</h1>
      {isFallback && <FallbackNotice />}
      <ProductGrid products={items} />
    </section>
  );
}
