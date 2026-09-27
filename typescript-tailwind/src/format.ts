import type { Rupiah } from "./types.js";

/** Memformat angka menjadi Rupiah, contoh: 799000 -> "Rp 799.000". */
export function formatRupiah(amount: Rupiah): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
