import { fetchFromApi } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product, PaginatedResponse } from "@/lib/types";

export default async function HomePage() {
  const { items } = await fetchFromApi<PaginatedResponse<Product>>(
    "/products?per_page=5",
  );
  return <ProductGrid products={items} />;
}
