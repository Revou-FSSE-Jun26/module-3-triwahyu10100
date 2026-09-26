import { STOCK_STATUS_BADGE_CLASSES, STOCK_STATUS_LABEL, getStockStatus } from './catalog.js';
import { formatRupiah } from './format.js';
import type { CartItem, CatalogNotification, Category, Product } from './types.js';
import { describeNotification } from './catalog.js';

/**
 * DOM rendering helpers. Every function here is a small, reusable
 * "component" — same idea as the React <ProductCard /> this exercise
 * is a direct predecessor to (per the checkpoint brief), just built
 * with `document.createElement` instead of JSX.
 */

function required<T extends Element>(element: T | null, selector: string): T {
  if (!element) {
    throw new Error(`Expected element matching "${selector}" to exist in the DOM.`);
  }
  return element;
}

export function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  return required(root.querySelector<T>(selector), selector);
}

/** Renders one product card. Returns the element so callers can append/replace it. */
export function renderProductCard(
  product: Product,
  category: Category | undefined,
  onAddToCart: (product: Product) => void
): HTMLElement {
  const status = getStockStatus(product.stock_quantity);
  const isOutOfStock = status === 'out-of-stock';

  const card = document.createElement('article');
  card.className =
    'flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ' +
    'transition hover:-translate-y-0.5 hover:shadow-md';

  const image = document.createElement('img');
  image.src = product.images[0] ?? 'https://placehold.co/480x360?text=RevoShop';
  image.alt = product.product_name;
  image.loading = 'lazy';
  image.className = 'h-40 w-full object-cover sm:h-44';

  const body = document.createElement('div');
  body.className = 'flex flex-1 flex-col gap-2 p-4';

  const categoryLabel = document.createElement('p');
  categoryLabel.className = 'text-xs font-semibold uppercase tracking-wide text-indigo-600';
  categoryLabel.textContent = category?.category_name ?? 'Uncategorized';

  const name = document.createElement('h3');
  name.className = 'text-sm font-semibold text-slate-900 sm:text-base';
  name.textContent = product.product_name;

  const sku = document.createElement('p');
  sku.className = 'text-xs text-slate-400';
  sku.textContent = `SKU: ${product.sku}`;

  const footerRow = document.createElement('div');
  footerRow.className = 'mt-auto flex items-center justify-between gap-2 pt-2';

  const price = document.createElement('span');
  price.className = 'text-base font-bold text-slate-900';
  price.textContent = formatRupiah(product.price);

  const statusBadge = document.createElement('span');
  statusBadge.className = `rounded-full px-2 py-1 text-[11px] font-semibold ${STOCK_STATUS_BADGE_CLASSES[status]}`;
  statusBadge.textContent = STOCK_STATUS_LABEL[status];

  footerRow.append(price, statusBadge);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang';
  addButton.disabled = isOutOfStock;
  addButton.className = isOutOfStock
    ? 'mt-3 w-full cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400'
    : 'mt-3 w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white ' +
      'transition hover:bg-indigo-700 active:scale-[0.98]';

  addButton.addEventListener('click', () => onAddToCart(product));

  body.append(categoryLabel, name, sku, footerRow, addButton);
  card.append(image, body);

  return card;
}

export function renderProductGrid(
  container: HTMLElement,
  products: readonly Product[],
  categoriesById: ReadonlyMap<number, Category>,
  onAddToCart: (product: Product) => void
): void {
  container.innerHTML = '';

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'col-span-full py-10 text-center text-sm text-slate-500';
    empty.textContent = 'Tidak ada produk yang cocok dengan pencarian/filter kamu.';
    container.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    const card = renderProductCard(product, categoriesById.get(product.category_id), onAddToCart);
    container.appendChild(card);
  });
}

export function renderCategoryFilters(
  container: HTMLElement,
  categories: readonly Category[],
  activeCategoryId: number | null,
  onSelect: (categoryId: number | null) => void
): void {
  container.innerHTML = '';

  const options: Array<{ id: number | null; label: string }> = [
    { id: null, label: 'Semua' },
    ...categories.map((category) => ({ id: category.id, label: category.category_name })),
  ];

  options.forEach((option) => {
    const isActive = option.id === activeCategoryId;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option.label;
    button.className = isActive
      ? 'rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm'
      : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ' +
        'hover:border-indigo-300 hover:text-indigo-600 sm:text-sm';
    button.addEventListener('click', () => onSelect(option.id));
    container.appendChild(button);
  });
}

export function renderCart(container: HTMLElement, cart: readonly CartItem[], totalEl: HTMLElement, countBadge: HTMLElement, handlers: {
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}): void {
  container.innerHTML = '';

  if (cart.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-sm text-slate-500';
    empty.textContent = 'Keranjang masih kosong.';
    container.appendChild(empty);
  } else {
    cart.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2';

      const info = document.createElement('div');
      const name = document.createElement('p');
      name.className = 'text-sm font-semibold text-slate-800';
      name.textContent = item.product.product_name;
      const subtotal = document.createElement('p');
      subtotal.className = 'text-xs text-slate-500';
      subtotal.textContent = formatRupiah(item.product.price * item.quantity);
      info.append(name, subtotal);

      const controls = document.createElement('div');
      controls.className = 'flex items-center gap-1.5';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.textContent = '−';
      minusBtn.setAttribute('aria-label', `Kurangi ${item.product.product_name}`);
      minusBtn.className =
        'h-6 w-6 rounded-full border border-slate-300 text-sm font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600';
      minusBtn.addEventListener('click', () => handlers.onDecrement(item.product.id));

      const qty = document.createElement('span');
      qty.className = 'w-5 text-center text-sm font-semibold text-slate-800';
      qty.textContent = String(item.quantity);

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', `Tambah ${item.product.product_name}`);
      plusBtn.className =
        'h-6 w-6 rounded-full border border-slate-300 text-sm font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600';
      plusBtn.addEventListener('click', () => handlers.onIncrement(item.product.id));

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Hapus';
      removeBtn.className = 'ml-2 text-xs font-semibold text-rose-500 hover:text-rose-600';
      removeBtn.addEventListener('click', () => handlers.onRemove(item.product.id));

      controls.append(minusBtn, qty, plusBtn, removeBtn);
      row.append(info, controls);
      container.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  totalEl.textContent = formatRupiah(total);
  countBadge.textContent = String(count);
  countBadge.classList.toggle('invisible', count === 0);
}

/** Shows a transient toast built from a typed {@link CatalogNotification}. */
export function showNotificationToast(toastHost: HTMLElement, notification: CatalogNotification): void {
  const toast = document.createElement('div');
  toast.className =
    'pointer-events-auto w-full max-w-xs rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white ' +
    'shadow-lg transition-opacity duration-300';
  toast.textContent = describeNotification(notification);

  toastHost.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('opacity-0');
    window.setTimeout(() => toast.remove(), 300);
  }, 2200);
}
