"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";

export interface EditCategoryFormProps {
  category: Category;
  onUpdated: (category: Category) => void;
  onCancel: () => void;
}

interface FormErrors {
  category_name?: string;
}

export function EditCategoryForm({
  category,
  onUpdated,
  onCancel,
}: EditCategoryFormProps) {
  const [categoryName, setCategoryName] = useState(category.category_name);
  const [description, setDescription] = useState(category.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!categoryName.trim()) next.category_name = "Nama kategori wajib diisi.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName.trim(),
          description: description.trim() || null,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(body?.error ?? "Gagal menyimpan perubahan kategori.");
      onUpdated(body as Category);
      toast.success(`Kategori "${categoryName.trim()}" berhasil diperbarui.`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan perubahan kategori.";
      toast.error(`Gagal: ${message}`);
      // onCancel SENGAJA tidak dipanggil di cabang gagal, sama seperti
      // EditProductForm — baris tetap dalam mode edit.
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
          htmlFor="category_name"
          className="block text-sm font-medium text-gray-700">
          Nama Kategori
        </label>
        <input
          id="category_name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.category_name && (
          <p className="mt-1 text-sm text-red-600">{errors.category_name}</p>
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
