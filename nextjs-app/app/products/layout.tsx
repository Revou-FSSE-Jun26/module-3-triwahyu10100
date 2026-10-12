import type { ReactNode } from "react";
import { fetchFromApi } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import type { Category } from "@/lib/types";

export default async function ProductsLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (process.env.NODE_ENV === "development") {
    console.log("[app/products/layout] render");
  }

  let categories: Category[] | null;
  try {
    categories = await fetchFromApi<Category[]>("/categories");
  } catch {
    // Kegagalan mengambil kategori tidak boleh membuat seluruh halaman /products
    // gagal — CategoryFilter akan menampilkan notifikasi singkat dan <select> nonaktif.
    categories = null;
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <CategoryFilter categories={categories} />
      </div>
      <div className="space-y-6 px-4">{children}</div>
    </div>
  );
}
