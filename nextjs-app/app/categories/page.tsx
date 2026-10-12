import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { CategoriesList } from "./categories-list";
import type { Category } from "@/lib/types";

export const metadata: Metadata = { title: "Kategori — RevoShop" };

export default async function CategoriesPage() {
  const categories = await fetchFromApi<Category[]>("/categories");
  return <CategoriesList categories={categories} />;
}
