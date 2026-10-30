import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchFromApi, ApiError } from "@/lib/api";
import { ProductDetail } from "./product-detail";
import type { Category, Product } from "@/lib/types";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await fetchFromApi<Product>(`/products/${params.id}`);
    return { title: `${product.product_name} — RevoShop` };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { title: "Produk Tidak Ditemukan — RevoShop" };
    }
    return { title: "RevoShop" }; // kegagalan non-404 (network/5xx) tidak diberi judul yang menyesatkan
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product;
  try {
    product = await fetchFromApi<Product>(`/products/${params.id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err; // ditangkap oleh app/products/[id]/error.tsx
  }

  let isApparel = false;
  try {
    const category = await fetchFromApi<Category>(
      `/categories/${product.category_id}`,
    );
    isApparel = category.category_name === "Apparel";
  } catch {
    // Kegagalan mengambil kategori tidak boleh membuat halaman produk gagal —
    // VariantPicker (dekoratif) cukup disembunyikan jika kategori tidak diketahui.
    isApparel = false;
  }

  return <ProductDetail product={product} isApparel={isApparel} />;
}
