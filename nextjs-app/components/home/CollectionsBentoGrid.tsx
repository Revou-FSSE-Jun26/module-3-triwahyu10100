import Link from "next/link";
import type { Category } from "@/lib/types";

export interface CollectionsBentoGridProps {
  categories: Category[];
}

export function CollectionsBentoGrid({
  categories,
}: CollectionsBentoGridProps) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-h2 mb-8 text-foreground">Jelajahi Kategori</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            href="/categories"
            className={`group flex min-h-[140px] flex-col justify-end rounded-xl bg-surface p-5 shadow-sm transition-all motion-safe:duration-base motion-safe:ease-premium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
              i === 0 ? "sm:col-span-2 sm:row-span-2 min-h-[200px] sm:min-h-[300px]" : ""
            }`}>
            <span className="text-h3 text-foreground transition-colors motion-safe:duration-base group-hover:text-accent">
              {category.category_name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
