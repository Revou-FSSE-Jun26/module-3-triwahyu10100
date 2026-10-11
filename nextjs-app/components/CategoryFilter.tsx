"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import type { Category } from "@/lib/types";

export interface CategoryFilterProps {
  categories: Category[] | null;
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (categories === null) {
    return (
      <div className="flex items-center gap-2">
        <select
          disabled
          aria-label="Filter kategori (tidak tersedia)"
          className="rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500">
          <option>Kategori tidak tersedia</option>
        </select>
        <p className="text-sm text-gray-600">Gagal memuat kategori.</p>
      </div>
    );
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set("category_id", e.target.value);
    else params.delete("category_id");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Filter kategori</span>
      <select
        defaultValue={searchParams.get("category_id") ?? ""}
        onChange={handleChange}
        aria-label="Filter kategori"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Semua Kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.category_name}
          </option>
        ))}
      </select>
    </label>
  );
}
