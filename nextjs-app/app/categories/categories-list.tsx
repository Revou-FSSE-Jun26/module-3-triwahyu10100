import Link from "next/link";
import { Card } from "@/components/Card";
import type { Category } from "@/lib/types";

export interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">Belum ada kategori.</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="transition hover:-translate-y-1 hover:shadow-md">
          <Link
            href={`/products?category_id=${category.id}`}
            className="block p-4">
            <h2 className="text-lg font-semibold">{category.category_name}</h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </Link>
        </Card>
      ))}
    </div>
  );
}
