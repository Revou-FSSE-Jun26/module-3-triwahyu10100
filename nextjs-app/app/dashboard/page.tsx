import type { Metadata } from "next";
import { fetchFromApi } from "@/lib/api";
import { DashboardProductsClient } from "./products-client";
import type { Product, Category, PaginatedResponse } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard Produk — RevoShop" };

export default async function DashboardProductsPage() {
  const { items: products } = await fetchFromApi<PaginatedResponse<Product>>(
    "/products?per_page=100",
  );
  const categories = await fetchFromApi<Category[]>("/categories");
  return (
    <DashboardProductsClient
      initialProducts={products}
      categories={categories}
    />
  );
}
