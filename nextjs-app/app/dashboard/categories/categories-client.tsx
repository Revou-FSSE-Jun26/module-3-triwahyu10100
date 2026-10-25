"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreateCategoryForm } from "@/components/CreateCategoryForm";
import { EditCategoryForm } from "@/components/EditCategoryForm";
import type { Category } from "@/lib/types";

export interface DashboardCategoriesClientProps {
  initialCategories: Category[];
}

export function DashboardCategoriesClient({
  initialCategories,
}: DashboardCategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Hapus kategori "${category.category_name}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(body?.error ?? "Gagal menghapus kategori.");
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      toast.success(`Kategori "${category.category_name}" berhasil dihapus.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus kategori.";
      toast.error(`Gagal: ${message}`);
      // Kategori SENGAJA tidak dihapus dari state lokal di cabang ini — ini
      // mencakup kasus 409 "it still has products linked to it": tabel
      // harus tetap menunjukkan kategori itu ada, bukan tampak hilang lalu
      // muncul lagi setelah refresh.
    }
  }

  return (
    <div className="space-y-6">
      <CreateCategoryForm
        onCreated={(category) => setCategories((prev) => [category, ...prev])}
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Nama Kategori</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  Belum ada kategori.
                </td>
              </tr>
            ) : (
              categories.map((category) =>
                editingId === category.id ? (
                  <tr key={category.id}>
                    <td colSpan={3} className="px-4 py-3">
                      <EditCategoryForm
                        category={category}
                        onUpdated={(updated) => {
                          setCategories((prev) =>
                            prev.map((c) => (c.id === updated.id ? updated : c)),
                          );
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={category.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{category.category_name}</td>
                    <td className="px-4 py-3">{category.description ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(category.id)}
                          className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 transition hover:bg-gray-50">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="rounded border border-red-300 px-3 py-1.5 text-red-600 transition hover:bg-red-50">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
