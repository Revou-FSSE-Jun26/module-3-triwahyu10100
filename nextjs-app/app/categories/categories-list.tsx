import Link from "next/link";
import { Card } from "@/components/Card";
import { Container } from "@/components/layout/Container";
import type { Category } from "@/lib/types";

export interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <Container>
        <p className="py-12 text-center text-body text-muted">
          Belum ada kategori.
        </p>
      </Container>
    );
  }
  return (
    <Container>
      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="transition-all motion-safe:duration-base hover:-translate-y-1 hover:shadow-md">
            <Link
              href={`/products?category_id=${category.id}`}
              className="block rounded-lg p-5 focus:outline-none focus:ring-2 focus:ring-accent">
              <h2 className="text-h3">{category.category_name}</h2>
              <p className="mt-1 text-caption text-muted">
                {category.description}
              </p>
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  );
}
