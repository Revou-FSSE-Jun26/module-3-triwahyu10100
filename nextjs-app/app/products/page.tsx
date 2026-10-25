import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product, PaginatedResponse } from "@/lib/types";

export const metadata: Metadata = { title: "Produk — RevoShop" };

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const search = firstValue(searchParams.search);
  const categoryId = firstValue(searchParams.category_id);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (categoryId) query.set("category_id", categoryId);
  query.set("per_page", "100"); // lihat "Out of Scope" — tidak ada UI paginasi di checkpoint ini

  const { items } = await fetchFromApi<PaginatedResponse<Product>>(
    `/products?${query.toString()}`,
  );

  return <ProductGrid products={items} />;
}
