"use client";

export default function HomeError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted">
        Tidak bisa memuat produk pilihan — coba lagi.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors motion-safe:duration-base hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
        Coba Lagi
      </button>
    </div>
  );
}
