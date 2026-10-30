import { fetchFromApi } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import { Hero } from "@/components/home/Hero";
import { CollectionsBentoGrid } from "@/components/home/CollectionsBentoGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { FadeInSection } from "@/components/home/FadeInSection";
import { Section } from "@/components/layout/Section";
import type { Product, Category, PaginatedResponse } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RevoShop — Belanja Online Lebih Jernih",
  description:
    "Produk pilihan RevoShop, tampilan baru yang lebih rapi dan fokus pada produk.",
};

export default async function HomePage() {
  const { items } = await fetchFromApi<PaginatedResponse<Product>>(
    "/products?per_page=5",
  );

  let categories: Category[] = [];
  try {
    categories = await fetchFromApi<Category[]>("/categories");
  } catch {
    categories = []; // non-fatal, CollectionsBentoGrid omits itself when empty
  }

  return (
    <>
      <Hero />
      <Section size="md">
        <h2 className="text-h2 mb-8 text-foreground">Produk Pilihan</h2>
        <ProductGrid products={items} />
      </Section>
      {categories.length > 0 && (
        <FadeInSection>
          <Section size="md">
            <CollectionsBentoGrid categories={categories} />
          </Section>
        </FadeInSection>
      )}
      <FadeInSection>
        <Newsletter />
      </FadeInSection>
    </>
  );
}
