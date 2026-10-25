import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { DashboardCategoriesClient } from "./categories-client";
import type { Category } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard Kategori — RevoShop" };

export default async function DashboardCategoriesPage() {
  const categories = await fetchFromApi<Category[]>("/categories");
  return <DashboardCategoriesClient initialCategories={categories} />;
}
