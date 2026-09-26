/**
 * Domain types for the RevoShop typed product catalog.
 *
 * These mirror the JSON shapes returned by the Flask backend's
 * `to_dict()` methods (see backend/app/models/*.py and
 * backend/app/schemas.py) so this exercise is a realistic predecessor
 * to the React <ProductCard /> component built in Checkpoint 2.
 */

/** Mirrors `Category.to_dict()` in backend/app/models/category.py. */
export interface Category {
  id: number;
  category_name: string;
  description: string | null;
}

/**
 * Union type modeling the possible stock states of a product.
 * This is derived from `stock_quantity` at render time (see
 * `getStockStatus` in catalog.ts) rather than stored directly on the
 * product, but it is the canonical "value with more than one shape"
 * required by the rubric.
 */
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/** Mirrors `Product.to_dict()` in backend/app/models/product.py. */
export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  sku: string;
  /** Array of image URLs — matches the JSON column `images` on the backend. */
  images: string[];
}

/** A product enriched with its resolved category — used for rendering. */
export interface ProductWithCategory extends Product {
  category: Category;
}

/** One line item inside the shopping cart (client-side state only). */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Union type describing a transient UI notification. Each variant
 * carries only the data relevant to that variant ("more than one
 * shape/state" per the rubric), and callers must narrow on `kind`
 * before accessing variant-specific fields.
 */
export type CatalogNotification =
  | { kind: 'added-to-cart'; productName: string; quantity: number }
  | { kind: 'removed-from-cart'; productName: string }
  | { kind: 'search-no-results'; query: string }
  | { kind: 'cart-cleared' };

/** Alias for currency values expressed in IDR (whole rupiah, no decimals in the demo data). */
export type Rupiah = number;

/** Alias for the sort strategies exposed by the catalog UI. */
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
