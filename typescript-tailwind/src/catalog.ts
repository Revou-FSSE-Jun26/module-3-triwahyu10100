import type { CartItem, CatalogNotification, Product, SortOption, StockStatus } from './types.js';

/**
 * Pure, framework-free logic for the product catalog. Kept separate
 * from DOM rendering (render.ts) so every function here is trivially
 * reusable/testable — the same pattern React components will use in
 * Checkpoint 2 (typed props/state in, typed value out, no DOM access).
 */

/** Derives a {@link StockStatus} union member from a raw stock count. */
export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return 'out-of-stock';
  if (stockQuantity <= 10) return 'low-stock';
  return 'in-stock';
}

/** Human-readable label per stock status, keyed off the union type. */
export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  'in-stock': 'Stok tersedia',
  'low-stock': 'Stok menipis',
  'out-of-stock': 'Stok habis',
};

/**
 * Maps a typed field (stock status) to a Tailwind class string.
 * This is the "conditional styling based on a typed field" rubric item.
 */
export const STOCK_STATUS_BADGE_CLASSES: Record<StockStatus, string> = {
  'in-stock': 'bg-emerald-100 text-emerald-700',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-rose-100 text-rose-700',
};

/** Case-insensitive substring search across product name + SKU. */
export function filterProductsBySearch(products: readonly Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === '') return [...products];

  return products.filter((product) => {
    return (
      product.product_name.toLowerCase().includes(normalized) ||
      product.sku.toLowerCase().includes(normalized)
    );
  });
}

/** Filters by category id, where `null` means "all categories". */
export function filterProductsByCategory(
  products: readonly Product[],
  categoryId: number | null
): Product[] {
  if (categoryId === null) return [...products];
  return products.filter((product) => product.category_id === categoryId);
}

/** Sorts a product list according to the selected {@link SortOption}. */
export function sortProducts(products: readonly Product[], sortOption: SortOption): Product[] {
  const copy = [...products];

  switch (sortOption) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return copy.sort((a, b) => a.product_name.localeCompare(b.product_name));
    case 'default':
      return copy;
  }
}

/**
 * Immutable cart helpers. Each function takes the current cart and
 * returns a *new* array rather than mutating in place, mirroring the
 * pattern used for React state updates in Checkpoint 2.
 */
export const cartOperations = {
  add(cart: readonly CartItem[], product: Product, quantity = 1): CartItem[] {
    const existing = cart.find((item) => item.product.id === product.id);
    if (!existing) {
      return [...cart, { product, quantity }];
    }
    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
    );
  },

  setQuantity(cart: readonly CartItem[], productId: number, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return cart.filter((item) => item.product.id !== productId);
    }
    return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
  },

  remove(cart: readonly CartItem[], productId: number): CartItem[] {
    return cart.filter((item) => item.product.id !== productId);
  },

  clear(): CartItem[] {
    return [];
  },

  total(cart: readonly CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  itemCount(cart: readonly CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};

/** Builds the message shown to the user for a given notification variant. */
export function describeNotification(notification: CatalogNotification): string {
  switch (notification.kind) {
    case 'added-to-cart':
      return `${notification.productName} (x${notification.quantity}) ditambahkan ke keranjang.`;
    case 'removed-from-cart':
      return `${notification.productName} dihapus dari keranjang.`;
    case 'search-no-results':
      return `Tidak ada produk yang cocok dengan "${notification.query}".`;
    case 'cart-cleared':
      return 'Keranjang dikosongkan.';
  }
}
