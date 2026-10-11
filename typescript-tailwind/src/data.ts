import type { Category, Product } from "./types.js";

/**
 * Data seed disalin (dan dipangkas) dari
 * backend/1_checkpoint_revoshop_sql/seed.sql supaya katalog bertipe
 * ini menampilkan data yang sama persis dengan yang akan dikembalikan
 * API RevoShop yang sebenarnya, begitu UI ini disambungkan ke Flask
 * di Checkpoint 2.
 */

export const CATEGORIES: readonly Category[] = [
  {
    id: 1,
    category_name: "Electronics",
    description: "Gadgets, computers, and electronic accessories",
  },
  {
    id: 2,
    category_name: "Apparel",
    description: "Clothing and fashion items for all ages",
  },
  {
    id: 3,
    category_name: "Home & Kitchen",
    description: "Furniture, appliances, and kitchenware",
  },
  {
    id: 4,
    category_name: "Books",
    description: "Fiction, non-fiction, and educational books",
  },
  {
    id: 5,
    category_name: "Sports",
    description: "Fitness equipment and sports accessories",
  },
];

export const PRODUCTS: readonly Product[] = [
  {
    id: 1,
    category_id: 1,
    product_name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "Over-ear headphones with active noise cancellation",
    price: 799000,
    stock_quantity: 50,
    sku: "ELEC-HEAD-001",
    images: [],
  },
  {
    id: 2,
    category_id: 1,
    product_name: "USB-C Fast Charger 65W",
    slug: "usb-c-fast-charger-65w",
    description: "GaN fast charger compatible with laptops and phones",
    price: 249000,
    stock_quantity: 120,
    sku: "ELEC-CHRG-002",
    images: [],
  },
  {
    id: 3,
    category_id: 1,
    product_name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    description: "Tactile switches with per-key RGB lighting",
    price: 550000,
    stock_quantity: 8,
    sku: "ELEC-KEYB-003",
    images: [],
  },
  {
    id: 4,
    category_id: 2,
    product_name: "Cotton Crewneck T-Shirt",
    slug: "cotton-crewneck-t-shirt",
    description: "Unisex 100% cotton t-shirt, various colors",
    price: 89000,
    stock_quantity: 200,
    sku: "APRL-TSHT-001",
    images: [],
  },
  {
    id: 5,
    category_id: 2,
    product_name: "Denim Jacket",
    slug: "denim-jacket",
    description: "Classic fit denim jacket for men and women",
    price: 349000,
    stock_quantity: 0,
    sku: "APRL-JCKT-002",
    images: [],
  },
  {
    id: 6,
    category_id: 3,
    product_name: "Non-Stick Frying Pan 28cm",
    slug: "non-stick-frying-pan-28cm",
    description: "Durable non-stick frying pan with ergonomic handle",
    price: 175000,
    stock_quantity: 80,
    sku: "HOME-PAN-001",
    images: [],
  },
  {
    id: 7,
    category_id: 3,
    product_name: "Electric Kettle 1.7L",
    slug: "electric-kettle-1-7l",
    description: "Stainless steel electric kettle with auto shut-off",
    price: 210000,
    stock_quantity: 45,
    sku: "HOME-KETL-002",
    images: [],
  },
  {
    id: 8,
    category_id: 4,
    product_name: "Atomic Habits (Paperback)",
    slug: "atomic-habits-paperback",
    description: "Bestselling book on building good habits",
    price: 120000,
    stock_quantity: 100,
    sku: "BOOK-ATHB-001",
    images: [],
  },
  {
    id: 9,
    category_id: 4,
    product_name: "The Pragmatic Programmer",
    slug: "the-pragmatic-programmer",
    description: "Classic software engineering reference book",
    price: 275000,
    stock_quantity: 6,
    sku: "BOOK-PPRG-002",
    images: [],
  },
  {
    id: 10,
    category_id: 5,
    product_name: "Yoga Mat Premium",
    slug: "yoga-mat-premium",
    description: "Non-slip 6mm yoga mat with carry strap",
    price: 165000,
    stock_quantity: 70,
    sku: "SPRT-YOGA-001",
    images: [],
  },
];

export function findCategoryById(categoryId: number): Category | undefined {
  return CATEGORIES.find((category) => category.id === categoryId);
}
