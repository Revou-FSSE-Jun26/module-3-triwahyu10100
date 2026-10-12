import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { ProductsClient } from "./products-client";
import type { Product, Category, PaginatedResponse } from "@/lib/types";

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

  const response = await fetchFromApi<PaginatedResponse<Product>>(
    `/products?${query.toString()}`,
  );
  const items = response.items;

  const categories = await fetchFromApi<Category[]>("/categories");

  return <ProductsClient initialProducts={items} categories={categories} />;
}
