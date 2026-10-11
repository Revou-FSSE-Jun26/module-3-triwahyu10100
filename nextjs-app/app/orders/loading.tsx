import { Skeleton } from "@/components/Skeleton";

export default function OrdersLoading() {
  return (
    <ul className="divide-y divide-gray-200 px-4 py-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
