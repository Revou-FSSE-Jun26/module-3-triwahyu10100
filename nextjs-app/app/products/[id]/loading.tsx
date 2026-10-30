import { Skeleton } from "@/components/Skeleton";
import { Container } from "@/components/layout/Container";

export default function ProductDetailLoading() {
  return (
    <Container>
      <div className="grid gap-8 py-10 sm:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-40 rounded" />
        </div>
      </div>
    </Container>
  );
}
