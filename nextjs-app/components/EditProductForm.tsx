"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { Category, Product } from "@/lib/types";

export interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onUpdated: (product: Product) => void;
  onCancel: () => void;
}

interface FormErrors {
  product_name?: string;
  category_id?: string;
  price?: string;
  stock_quantity?: string;
  sku?: string;
}

export function EditProductForm({
  product,
  categories,
  onUpdated,
  onCancel,
}: EditProductFormProps) {
  const [productName, setProductName] = useState(product.product_name);
  const [categoryId, setCategoryId] = useState(String(product.category_id));
  const [price, setPrice] = useState(String(product.price));
  const [stockQuantity, setStockQuantity] = useState(
    String(product.stock_quantity),
  );
  const [sku, setSku] = useState(product.sku);
  const [description, setDescription] = useState(product.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Prefiks id per-produk (bukan id statis seperti "price") karena
  // CreateProductForm SELALU ikut terender di atas tabel yang sama — id
  // statis akan bentrok (duplikat id di DOM, merusak asosiasi
  // label[for]) begitu baris mana pun masuk mode edit.
  const fieldId = (field: string) => `edit-product-${product.id}-${field}`;

  // Aturan validasi identik dengan CreateProductForm — lihat komentar di sana.
  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!productName.trim()) next.product_name = "Nama produk wajib diisi.";
    const categoryIdNum = Number(categoryId);
    if (!categories.some((c) => c.id === categoryIdNum))
      next.category_id = "Pilih kategori produk.";
    if (!(Number(price) > 0)) next.price = "Harga harus lebih besar dari 0.";
    if (
      stockQuantity.trim() === "" ||
      !(Number.isInteger(Number(stockQuantity)) && Number(stockQuantity) >= 0)
    )
      next.stock_quantity = "Stok wajib diisi dan tidak boleh kurang dari 0.";
    if (!sku.trim()) next.sku = "SKU wajib diisi.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName.trim(),
          category_id: Number(categoryId),
          price: Number(price),
          stock_quantity: Number(stockQuantity),
          sku: sku.trim(),
          description: description.trim() || null,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(body?.error ?? "Gagal menyimpan perubahan produk.");
      onUpdated(body as Product);
      toast.success(`Produk "${productName.trim()}" berhasil diperbarui.`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan perubahan produk.";
      toast.error(`Gagal: ${message}`);
      // onCancel SENGAJA tidak dipanggil di cabang gagal — baris tetap
      // dalam mode edit supaya user bisa langsung memperbaiki & submit
      // ulang.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded border border-blue-200 bg-blue-50 p-4">
      <div>
        <label
          htmlFor={fieldId("product_name")}
          className="block text-sm font-medium text-gray-700">
          Nama Produk
        </label>
        <input
          id={fieldId("product_name")}
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.product_name && (
          <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={fieldId("category_id")}
          className="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          id={fieldId("category_id")}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={fieldId("price")}
          className="block text-sm font-medium text-gray-700">
          Harga
        </label>
        <input
          id={fieldId("price")}
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={fieldId("stock_quantity")}
          className="block text-sm font-medium text-gray-700">
          Stok
        </label>
        <input
          id={fieldId("stock_quantity")}
          type="number"
          min="0"
          step="1"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.stock_quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={fieldId("sku")}
          className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          id={fieldId("sku")}
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.sku && (
          <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={fieldId("description")}
          className="block text-sm font-medium text-gray-700">
          Deskripsi (opsional)
        </label>
        <textarea
          id={fieldId("description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50">
          Batal
        </button>
      </div>
    </form>
  );
}
