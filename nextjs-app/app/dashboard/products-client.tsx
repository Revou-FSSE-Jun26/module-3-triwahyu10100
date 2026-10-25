"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreateProductForm } from "@/components/CreateProductForm";
import { EditProductForm } from "@/components/EditProductForm";
import { formatRupiah } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

export interface DashboardProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function DashboardProductsClient({
  initialProducts,
  categories,
}: DashboardProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);

  function categoryName(categoryId: number): string {
    return (
      categories.find((c) => c.id === categoryId)?.category_name ??
      "Tidak diketahui"
    );
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Hapus produk "${product.product_name}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(body?.error ?? "Gagal menghapus produk.");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(`Produk "${product.product_name}" berhasil dihapus.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus produk.";
      toast.error(`Gagal: ${message}`);
      // Produk SENGAJA tidak dihapus dari state lokal di cabang ini — ini
      // mencakup kasus 409 "linked to one or more active orders": tabel
      // harus tetap menunjukkan produk itu ada, bukan tampak hilang lalu
      // muncul lagi setelah refresh.
    }
  }

  return (
    <div className="space-y-6">
      <CreateProductForm
        categories={categories}
        onCreated={(product) => setProducts((prev) => [product, ...prev])}
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Nama Produk</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) =>
                editingId === product.id ? (
                  <tr key={product.id}>
                    <td colSpan={6} className="px-4 py-3">
                      <EditProductForm
                        product={product}
                        categories={categories}
                        onUpdated={(updated) => {
                          setProducts((prev) =>
                            prev.map((p) => (p.id === updated.id ? updated : p)),
                          );
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={product.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{product.product_name}</td>
                    <td className="px-4 py-3">
                      {categoryName(product.category_id)}
                    </td>
                    <td className="px-4 py-3">{formatRupiah(product.price)}</td>
                    <td className="px-4 py-3">{product.stock_quantity}</td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(product.id)}
                          className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 transition hover:bg-gray-50">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
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
