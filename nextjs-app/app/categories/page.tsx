import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { fetchFallbackCategories } from "@/lib/fakestore-fallback";
import { FallbackNotice } from "@/components/FallbackNotice";
import { CategoriesList } from "./categories-list";
import type { Category } from "@/lib/types";

export const metadata: Metadata = { title: "Kategori — RevoShop" };

export default async function CategoriesPage() {
  let categories: Category[];
  let isFallback = false;
  try {
    categories = await fetchFromApi<Category[]>("/categories");
  } catch {
    // Flask API lokal tidak bisa dijangkau — pakai fallback SEMENTARA dari
    // fakestoreapi.com supaya halaman kategori tidak kosong total.
    categories = fetchFallbackCategories();
    isFallback = true;
  }
  return (
    <>
      {isFallback && <FallbackNotice />}
      <CategoriesList categories={categories} />
    </>
  );
}
