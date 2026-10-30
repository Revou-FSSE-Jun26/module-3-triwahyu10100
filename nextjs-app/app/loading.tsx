import { Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <section className="mx-auto w-full max-w-container-md px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-border p-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
