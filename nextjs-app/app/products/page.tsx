import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import {
  fetchFallbackProducts,
  fetchFallbackCategories,
} from "@/lib/fakestore-fallback";
import { FallbackNotice } from "@/components/FallbackNotice";
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

  let items: Product[];
  let isFallback = false;
  try {
    const response = await fetchFromApi<PaginatedResponse<Product>>(
      `/products?${query.toString()}`,
    );
    items = response.items;
  } catch {
    // Flask API lokal tidak bisa dijangkau — pakai fallback SEMENTARA dari
    // fakestoreapi.com, dengan parameter search/category_id yang sama.
    items = await fetchFallbackProducts({
      search,
      category_id: categoryId ? Number(categoryId) : undefined,
    });
    isFallback = true;
  }

  let categories: Category[];
  try {
    categories = await fetchFromApi<Category[]>("/categories");
  } catch {
    // Sama seperti di layout: kegagalan mengambil kategori tidak boleh membuat
    // seluruh halaman /products gagal. validate() di AddProductForm sudah
    // menolak submit saat tidak ada kategori valid untuk dipilih.
    categories = isFallback ? fetchFallbackCategories() : [];
  }

  return (
    <>
      {isFallback && <FallbackNotice />}
      <ProductsClient initialProducts={items} categories={categories} />
    </>
  );
}
