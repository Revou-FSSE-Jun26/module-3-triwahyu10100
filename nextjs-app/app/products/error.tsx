"use client";

export default function ProductsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-gray-700">
        Tidak bisa memuat daftar produk — coba lagi.
      </p>
      <button
        onClick={reset}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Coba Lagi
      </button>
    </div>
  );
}
