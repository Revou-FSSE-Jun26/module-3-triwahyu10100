"use client";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";

export interface AddProductFormProps {
  categories: Category[];
  onCreate: (product: Product) => void;
}

interface FormErrors {
  product_name?: string;
  category_id?: string;
  price?: string;
  stock_quantity?: string;
  sku?: string;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function AddProductForm({ categories, onCreate }: AddProductFormProps) {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: -Date.now(), // selalu negatif, tidak akan pernah bertabrakan dengan id asli dari backend (selalu positif)
      category_id: Number(categoryId),
      product_name: productName.trim(),
      slug: slugify(productName),
      description: description.trim() || null,
      price: Number(price),
      stock_quantity: Number(stockQuantity),
      sku: sku.trim(),
      images: [],
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    onCreate(newProduct);
    setProductName("");
    setCategoryId("");
    setPrice("");
    setStockQuantity("");
    setSku("");
    setDescription("");
    setErrors({});
    setOpen(false);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-semibold text-blue-600 transition hover:text-blue-700">
        {open ? "▾" : "▸"} Tambah Produk (Demo)
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
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            Simpan Produk
          </button>
        </form>
      )}
    </div>
  );
}
