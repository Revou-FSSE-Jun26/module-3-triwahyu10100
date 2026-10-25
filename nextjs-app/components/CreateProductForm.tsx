"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { Category, Product } from "@/lib/types";

export interface CreateProductFormProps {
  categories: Category[];
  onCreated: (product: Product) => void;
}

interface FormErrors {
  product_name?: string;
  category_id?: string;
  price?: string;
  stock_quantity?: string;
  sku?: string;
}

export function CreateProductForm({
  categories,
  onCreated,
}: CreateProductFormProps) {
  // `open` default `true` di konteks dashboard — form tambah produk
  // adalah aksi utama halaman ini, bukan panel sekunder seperti di
  // /products CP2.
  const [open, setOpen] = useState(true);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

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
      const response = await fetch("/api/products", {
        method: "POST",
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
        throw new Error(body?.error ?? "Gagal menyimpan produk.");
      onCreated(body as Product);
      toast.success(`Produk "${productName.trim()}" berhasil ditambahkan.`);
      setProductName("");
      setCategoryId("");
      setPrice("");
      setStockQuantity("");
      setSku("");
      setDescription("");
      setErrors({});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan produk.";
      toast.error(`Gagal: ${message}`);
      // Form SENGAJA tidak dikosongkan/ditutup di cabang gagal (mis. 409
      // SKU duplikat) — user bisa langsung memperbaiki field yang
      // bermasalah tanpa mengetik ulang semuanya.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-semibold text-blue-600 transition hover:text-blue-700">
        {open ? "▾" : "▸"} Tambah Produk Baru
      </button>
      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium text-gray-700">
              Nama Produk
            </label>
            <input
              id="product_name"
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
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" className="text-gray-500">
                Pilih kategori
              </option>
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
              htmlFor="price"
              className="block text-sm font-medium text-gray-700">
              Harga
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="contoh: 199000 (tanpa titik atau koma)"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock_quantity"
              className="block text-sm font-medium text-gray-700">
              Stok
            </label>
            <input
              id="stock_quantity"
              type="number"
              min="0"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.stock_quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stock_quantity}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              id="sku"
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
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Deskripsi (opsional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60">
            {submitting ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </form>
      )}
    </div>
  );
}
