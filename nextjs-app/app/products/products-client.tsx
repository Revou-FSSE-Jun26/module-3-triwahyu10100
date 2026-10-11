"use client";
import { useState, useEffect } from "react";
import { AddProductForm } from "@/components/AddProductForm";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product, Category } from "@/lib/types";

export interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  useEffect(() => setProducts(initialProducts), [initialProducts]); // sinkron ulang saat server mengirim data baru (search/filter berubah)

  return (
    <>
      <AddProductForm
        categories={categories}
        onCreate={(product) => setProducts((prev) => [product, ...prev])}
      />
      <ProductGrid products={products} />
    </>
  );
}
