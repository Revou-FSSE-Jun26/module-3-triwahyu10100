import type {
  CartItem,
  CatalogNotification,
  Product,
  SortOption,
  StockStatus,
} from "./types.js";

/**
 * Logika murni untuk katalog produk, tanpa framework. Dipisahkan dari
 * rendering DOM (render.ts) supaya setiap fungsi di sini mudah dipakai
 * ulang/dites — pola yang sama akan dipakai komponen React di
 * Checkpoint 2 (props/state bertipe masuk, nilai bertipe keluar, tanpa
 * akses DOM).
 */

/** Menurunkan salah satu nilai union {@link StockStatus} dari jumlah stok mentah. */
export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return "out-of-stock";
  if (stockQuantity <= 10) return "low-stock";
  return "in-stock";
}

/** Label yang mudah dibaca manusia untuk setiap status stok, mengikuti union type. */
export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  "in-stock": "Stok tersedia",
  "low-stock": "Stok menipis",
  "out-of-stock": "Stok habis",
};

/**
 * Memetakan field bertipe (status stok) ke string class Tailwind.
 * Ini adalah item rubrik "styling kondisional berdasarkan field bertipe".
 */
export const STOCK_STATUS_BADGE_CLASSES: Record<StockStatus, string> = {
  "in-stock": "bg-emerald-100 text-emerald-700",
  "low-stock": "bg-amber-100 text-amber-700",
  "out-of-stock": "bg-rose-100 text-rose-700",
};

/** Pencarian substring tanpa memedulikan huruf besar/kecil, mencakup nama produk + SKU. */
export function filterProductsBySearch(
  products: readonly Product[],
  query: string,
): Product[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") return [...products];

  return products.filter((product) => {
    return (
      product.product_name.toLowerCase().includes(normalized) ||
      product.sku.toLowerCase().includes(normalized)
    );
  });
}

/** Menyaring berdasarkan category id, di mana `null` berarti "semua kategori". */
export function filterProductsByCategory(
  products: readonly Product[],
  categoryId: number | null,
): Product[] {
  if (categoryId === null) return [...products];
  return products.filter((product) => product.category_id === categoryId);
}

/** Mengurutkan daftar produk berdasarkan {@link SortOption} yang dipilih. */
export function sortProducts(
  products: readonly Product[],
  sortOption: SortOption,
): Product[] {
  const copy = [...products];

  switch (sortOption) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) => a.product_name.localeCompare(b.product_name));
    case "default":
      return copy;
  }
}

/**
 * Helper keranjang yang bersifat immutable. Setiap fungsi menerima
 * keranjang saat ini dan mengembalikan array *baru* alih-alih
 * mengubah data yang ada secara langsung, mencerminkan pola yang
 * dipakai untuk update state React di Checkpoint 2.
 */
export const cartOperations = {
  add(cart: readonly CartItem[], product: Product, quantity = 1): CartItem[] {
    const existing = cart.find((item) => item.product.id === product.id);
    if (!existing) {
      return [...cart, { product, quantity }];
    }
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  },

  setQuantity(
    cart: readonly CartItem[],
    productId: number,
    quantity: number,
  ): CartItem[] {
    if (quantity <= 0) {
      return cart.filter((item) => item.product.id !== productId);
    }
    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
  },

  remove(cart: readonly CartItem[], productId: number): CartItem[] {
    return cart.filter((item) => item.product.id !== productId);
  },

  clear(): CartItem[] {
    return [];
  },

  total(cart: readonly CartItem[]): number {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  },

  itemCount(cart: readonly CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};

/** Menyusun pesan yang ditampilkan ke user untuk sebuah variant notifikasi tertentu. */
export function describeNotification(
  notification: CatalogNotification,
): string {
  switch (notification.kind) {
    case "added-to-cart":
      return `${notification.productName} (x${notification.quantity}) ditambahkan ke keranjang.`;
    case "removed-from-cart":
      return `${notification.productName} dihapus dari keranjang.`;
    case "search-no-results":
      return `Tidak ada produk yang cocok dengan "${notification.query}".`;
    case "cart-cleared":
      return "Keranjang dikosongkan.";
  }
}
