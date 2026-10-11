// Fallback SEMENTARA ke fakestoreapi.com, dipakai HANYA ketika Flask API lokal
// (backend/) tidak bisa dijangkau (misalnya belum dijalankan). Flask API tetap
// menjadi sumber data utama dan satu-satunya untuk checkpoint ini -- fallback
// ini murni supaya tampilan katalog tidak kosong total saat sedang development
// tanpa backend aktif, DAN DATANYA BUKAN DATA REVOSHOP YANG SESUNGGUHNYA.
import type { Product, Category } from './types';

const FAKESTORE_BASE_URL = 'https://fakestoreapi.com';

// id negatif supaya tidak pernah bertabrakan dengan id asli dari Flask (selalu positif).
const FALLBACK_CATEGORY_IDS: Record<string, number> = {
  electronics: -1,
  jewelery: -2,
  "men's clothing": -3,
  "women's clothing": -4,
};

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}

function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
}

function mapFakeStoreProduct(p: FakeStoreProduct): Product {
  const now = new Date().toISOString();
  return {
    id: -p.id,
    category_id: FALLBACK_CATEGORY_IDS[p.category] ?? -99,
    product_name: p.title,
    slug: slugify(p.title),
    description: p.description,
    price: p.price,
    stock_quantity: p.rating?.count ?? 10, // fakestoreapi tidak punya stok asli, dipakai sebagai perkiraan kasar
    sku: `FALLBACK-${p.id}`,
    images: p.image ? [p.image] : [],
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

export async function fetchFallbackProducts(params?: {
  search?: string;
  category_id?: number;
  per_page?: number;
}): Promise<Product[]> {
  const response = await fetch(`${FAKESTORE_BASE_URL}/products`, { cache: 'no-store' });
  if (!response.ok) throw new Error('fakestoreapi.com juga tidak dapat diakses');
  const raw: FakeStoreProduct[] = await response.json();
  let products = raw.map(mapFakeStoreProduct);
  if (params?.search) {
    const term = params.search.toLowerCase();
    products = products.filter((p) => p.product_name.toLowerCase().includes(term));
  }
  if (params?.category_id != null) {
    products = products.filter((p) => p.category_id === params.category_id);
  }
  if (params?.per_page) {
    products = products.slice(0, params.per_page);
  }
  return products;
}

export function fetchFallbackCategories(): Category[] {
  const now = new Date().toISOString();
  return Object.entries(FALLBACK_CATEGORY_IDS).map(([name, id]) => ({
    id,
    category_name: name,
    description: null,
    created_at: now,
  }));
}
