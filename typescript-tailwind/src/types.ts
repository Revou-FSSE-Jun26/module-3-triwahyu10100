/**
 * Tipe data domain untuk katalog produk RevoShop yang bertipe.
 *
 * Tipe-tipe ini mencerminkan bentuk JSON yang dikembalikan oleh method
 * `to_dict()` di backend Flask (lihat backend/app/models/*.py dan
 * backend/app/schemas.py), supaya latihan ini menjadi pendahulu yang
 * realistis untuk komponen React <ProductCard /> yang akan dibuat di
 * Checkpoint 2.
 */

/** Mencerminkan `Category.to_dict()` di backend/app/models/category.py. */
export interface Category {
  id: number;
  category_name: string;
  description: string | null;
}

/**
 * Union type yang memodelkan kemungkinan status stok sebuah produk.
 * Nilai ini diturunkan dari `stock_quantity` saat render (lihat
 * `getStockStatus` di catalog.ts), bukan disimpan langsung di data
 * produk — tapi inilah contoh baku "nilai dengan lebih dari satu
 * bentuk" yang diminta rubrik.
 */
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/** Mencerminkan `Product.to_dict()` di backend/app/models/product.py. */
export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  sku: string;
  /** Array URL gambar — sesuai dengan kolom JSON `images` di backend. */
  images: string[];
}

/** Produk yang dilengkapi dengan kategori yang sudah di-resolve — dipakai untuk render. */
export interface ProductWithCategory extends Product {
  category: Category;
}

/** Satu baris item di dalam keranjang belanja (hanya state di sisi client). */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Union type yang mendeskripsikan notifikasi UI sementara. Setiap
 * variant hanya membawa data yang relevan untuk variant itu ("lebih
 * dari satu bentuk/state" sesuai rubrik), dan pemanggil harus
 * mempersempit (narrow) berdasarkan `kind` sebelum mengakses field
 * khusus variant tersebut.
 */
export type CatalogNotification =
  | { kind: "added-to-cart"; productName: string; quantity: number }
  | { kind: "removed-from-cart"; productName: string }
  | { kind: "search-no-results"; query: string }
  | { kind: "cart-cleared" };

/** Alias untuk nilai mata uang dalam Rupiah (bilangan bulat, tanpa desimal di data demo ini). */
export type Rupiah = number;

/** Alias untuk strategi pengurutan yang disediakan UI katalog. */
export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";
