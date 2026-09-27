import { CATEGORIES, PRODUCTS } from "./data.js";
import {
  cartOperations,
  filterProductsByCategory,
  filterProductsBySearch,
  sortProducts,
} from "./catalog.js";
import {
  queryRequired,
  renderCart,
  renderCategoryFilters,
  renderProductGrid,
  showNotificationToast,
} from "./render.js";
import type {
  CartItem,
  CatalogNotification,
  Category,
  Product,
  SortOption,
} from "./types.js";

/**
 * Entry point: menyambungkan data bertipe + logika murni (catalog.ts)
 * ke rendering DOM (render.ts). Modul ini memegang satu-satunya sumber
 * kebenaran (single source of truth) untuk UI state, mirip seperti
 * state pada komponen React di Checkpoint 2 — bedanya di sini
 * perubahan state diterapkan dengan memanggil ulang fungsi render
 * secara manual.
 */

interface CatalogState {
  searchQuery: string;
  activeCategoryId: number | null;
  sortOption: SortOption;
  cart: CartItem[];
}

const categoriesById: ReadonlyMap<number, Category> = new Map(
  CATEGORIES.map((category) => [category.id, category]),
);

const state: CatalogState = {
  searchQuery: "",
  activeCategoryId: null,
  sortOption: "default",
  cart: [],
};

function getVisibleProducts(): Product[] {
  const byCategory = filterProductsByCategory(PRODUCTS, state.activeCategoryId);
  const bySearch = filterProductsBySearch(byCategory, state.searchQuery);
  return sortProducts(bySearch, state.sortOption);
}

function notify(notification: CatalogNotification): void {
  showNotificationToast(toastHost, notification);
}

function renderAll(): void {
  const visibleProducts = getVisibleProducts();

  renderProductGrid(
    productGrid,
    visibleProducts,
    categoriesById,
    handleAddToCart,
  );
  renderCategoryFilters(
    categoryFilters,
    CATEGORIES,
    state.activeCategoryId,
    handleSelectCategory,
  );
  renderCart(cartList, state.cart, cartTotalEl, cartCountBadge, {
    onIncrement: (productId) => handleChangeQuantity(productId, 1),
    onDecrement: (productId) => handleChangeQuantity(productId, -1),
    onRemove: handleRemoveFromCart,
  });

  resultCount.textContent = `${visibleProducts.length} produk ditemukan`;

  if (visibleProducts.length === 0 && state.searchQuery.trim() !== "") {
    notify({ kind: "search-no-results", query: state.searchQuery.trim() });
  }
}

function handleAddToCart(product: Product): void {
  state.cart = cartOperations.add(state.cart, product, 1);
  notify({
    kind: "added-to-cart",
    productName: product.product_name,
    quantity: 1,
  });
  renderAll();
}

function handleChangeQuantity(productId: number, delta: number): void {
  const current = state.cart.find((item) => item.product.id === productId);
  if (!current) return;

  const nextQuantity = current.quantity + delta;
  state.cart = cartOperations.setQuantity(state.cart, productId, nextQuantity);

  if (nextQuantity <= 0) {
    notify({
      kind: "removed-from-cart",
      productName: current.product.product_name,
    });
  }
  renderAll();
}

function handleRemoveFromCart(productId: number): void {
  const current = state.cart.find((item) => item.product.id === productId);
  state.cart = cartOperations.remove(state.cart, productId);
  if (current) {
    notify({
      kind: "removed-from-cart",
      productName: current.product.product_name,
    });
  }
  renderAll();
}

function handleClearCart(): void {
  if (state.cart.length === 0) return;
  state.cart = cartOperations.clear();
  notify({ kind: "cart-cleared" });
  renderAll();
}

function handleSelectCategory(categoryId: number | null): void {
  state.activeCategoryId = categoryId;
  renderAll();
}

function handleSearchInput(rawQuery: string): void {
  state.searchQuery = rawQuery;
  renderAll();
}

function handleSortChange(sortOption: SortOption): void {
  state.sortOption = sortOption;
  renderAll();
}

// ---------- Penyambungan DOM ----------

const root = document.body;
const productGrid = queryRequired<HTMLElement>(root, "#product-grid");
const categoryFilters = queryRequired<HTMLElement>(root, "#category-filters");
const searchInput = queryRequired<HTMLInputElement>(root, "#search-input");
const sortSelect = queryRequired<HTMLSelectElement>(root, "#sort-select");
const resultCount = queryRequired<HTMLElement>(root, "#result-count");
const cartList = queryRequired<HTMLElement>(root, "#cart-list");
const cartTotalEl = queryRequired<HTMLElement>(root, "#cart-total");
const cartCountBadge = queryRequired<HTMLElement>(root, "#cart-count-badge");
const clearCartButton = queryRequired<HTMLButtonElement>(
  root,
  "#clear-cart-btn",
);
const toastHost = queryRequired<HTMLElement>(root, "#toast-host");

searchInput.addEventListener("input", (event) => {
  const target = event.currentTarget as HTMLInputElement;
  handleSearchInput(target.value);
});

sortSelect.addEventListener("change", (event) => {
  const target = event.currentTarget as HTMLSelectElement;
  handleSortChange(target.value as SortOption);
});

clearCartButton.addEventListener("click", handleClearCart);

renderAll();
