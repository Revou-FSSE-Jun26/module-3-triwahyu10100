import { Skeleton } from "@/components/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-gray-200 p-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
