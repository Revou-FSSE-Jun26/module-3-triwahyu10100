export function FallbackNotice() {
  return (
    <div role="status" className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong>Mode cadangan aktif:</strong> API Flask RevoShop tidak dapat dijangkau, jadi halaman ini
      menampilkan data sementara dari{' '}
      <a href="https://fakestoreapi.com" className="underline" target="_blank" rel="noreferrer">
        fakestoreapi.com
      </a>{' '}
      sekadar contoh tampilan -- bukan data produk RevoShop yang sesungguhnya. Jalankan backend Flask
      lokal (lihat README) untuk melihat data asli.
    </div>
  );
}
