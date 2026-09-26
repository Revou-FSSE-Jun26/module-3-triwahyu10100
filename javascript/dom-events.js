'use strict';

/**
 * RevoShop — Latihan DOM Manipulation & Event Handling (vanilla JS).
 *
 * Data produk berikut sengaja dibuat menyerupai bentuk response
 * `Product.to_dict()` di backend Flask (lihat backend/app/models/product.py),
 * supaya latihan ini terasa seperti "mini RevoShop" sungguhan walau
 * belum menyentuh API/backend yang sebenarnya.
 *
 * Konsep yang dipraktikkan di file ini:
 * - Deklarasi variabel dengan tipe data yang jelas (const/let, number, string, array, object).
 * - Memilih & mengubah elemen DOM (querySelector, textContent, classList).
 * - Membuat & menghapus elemen (createElement, append, remove).
 * - Menangani event: click, submit, input — termasuk preventDefault().
 * - Toggle class untuk state (dark mode, item selesai, dsb).
 */

/** @typedef {{ id: number, product_name: string, price: number, stock_quantity: number }} ProductLike */

/** @type {ProductLike[]} */
const CATALOG = [
  { id: 1, product_name: 'Wireless Bluetooth Headphones', price: 799000, stock_quantity: 50 },
  { id: 2, product_name: 'USB-C Fast Charger 65W', price: 249000, stock_quantity: 120 },
  { id: 3, product_name: 'Mechanical Keyboard RGB', price: 550000, stock_quantity: 35 },
  { id: 4, product_name: 'Cotton Crewneck T-Shirt', price: 89000, stock_quantity: 200 },
  { id: 5, product_name: 'Denim Jacket', price: 349000, stock_quantity: 0 },
  { id: 6, product_name: 'Non-Stick Frying Pan 28cm', price: 175000, stock_quantity: 80 },
];

/** State keranjang: Map<productId, quantity>. Dipilih Map supaya lookup O(1) saat +/-. */
const cartState = new Map();

// ---------- Helpers ----------

/** @param {number} value */
function formatRupiah(value) {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function getProductById(id) {
  return CATALOG.find((product) => product.id === id);
}

// ---------- Render: product picker ----------

function renderProductList() {
  const listEl = document.getElementById('product-list');
  listEl.innerHTML = ''; // reset sebelum render ulang

  CATALOG.forEach((product) => {
    const isOutOfStock = product.stock_quantity === 0;

    const item = document.createElement('li');
    item.className = 'product-list__item';
    item.classList.toggle('is-out-of-stock', isOutOfStock);

    const info = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'product-list__name';
    name.textContent = product.product_name;
    const meta = document.createElement('p');
    meta.className = 'product-list__meta';
    meta.textContent = `${formatRupiah(product.price)} · stok ${product.stock_quantity}`;
    info.append(name, meta);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn--primary btn--small';
    addBtn.textContent = isOutOfStock ? 'Stok habis' : 'Tambah';
    addBtn.disabled = isOutOfStock;
    addBtn.addEventListener('click', () => handleAddToCart(product.id));

    item.append(info, addBtn);
    listEl.appendChild(item);
  });
}

// ---------- Cart logic ----------

function handleAddToCart(productId) {
  const currentQty = cartState.get(productId) ?? 0;
  cartState.set(productId, currentQty + 1);
  renderCart();
}

function handleChangeQty(productId, delta) {
  const currentQty = cartState.get(productId) ?? 0;
  const nextQty = currentQty + delta;

  if (nextQty <= 0) {
    cartState.delete(productId);
  } else {
    cartState.set(productId, nextQty);
  }
  renderCart();
}

function handleRemoveFromCart(productId) {
  cartState.delete(productId);
  renderCart();
}

function handleClearCart() {
  cartState.clear();
  renderCart();
}

function renderCart() {
  const cartListEl = document.getElementById('cart-list');
  const emptyMessageEl = document.getElementById('empty-cart-message');
  const totalEl = document.getElementById('cart-total');

  cartListEl.innerHTML = '';

  const isEmpty = cartState.size === 0;
  emptyMessageEl.classList.toggle('is-hidden', !isEmpty);
  emptyMessageEl.style.display = isEmpty ? '' : 'none';

  let total = 0;

  cartState.forEach((qty, productId) => {
    const product = getProductById(productId);
    if (!product) return;

    const subtotal = product.price * qty;
    total += subtotal;

    const item = document.createElement('li');
    item.className = 'cart-list__item';

    const name = document.createElement('span');
    name.className = 'cart-list__name';
    name.textContent = `${product.product_name} (x${qty})`;

    const controls = document.createElement('div');
    controls.className = 'cart-list__qty-controls';

    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'qty-btn';
    minusBtn.setAttribute('aria-label', `Kurangi jumlah ${product.product_name}`);
    minusBtn.textContent = '−';
    minusBtn.addEventListener('click', () => handleChangeQty(productId, -1));

    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'qty-btn';
    plusBtn.setAttribute('aria-label', `Tambah jumlah ${product.product_name}`);
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', () => handleChangeQty(productId, 1));

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Hapus';
    removeBtn.addEventListener('click', () => handleRemoveFromCart(productId));

    controls.append(minusBtn, plusBtn, removeBtn);
    item.append(name, controls);
    cartListEl.appendChild(item);
  });

  totalEl.textContent = formatRupiah(total);
}

// ---------- Theme toggle (classList demo) ----------

function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    toggleBtn.textContent = isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap';
  });
}

// ---------- Notes (create/remove elements + submit event) ----------

function setupNoteForm() {
  const form = document.getElementById('note-form');
  const input = document.getElementById('note-input');
  const list = document.getElementById('note-list');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // mencegah reload halaman saat submit form

    const text = input.value.trim();
    if (text.length < 2) return;

    const item = document.createElement('li');
    item.className = 'note-list__item';

    const label = document.createElement('span');
    label.textContent = text;

    const actions = document.createElement('div');

    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'qty-btn';
    doneBtn.setAttribute('aria-label', 'Tandai selesai');
    doneBtn.textContent = '✓';
    doneBtn.addEventListener('click', () => {
      item.classList.toggle('is-done');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'remove-btn';
    deleteBtn.textContent = 'Hapus';
    deleteBtn.addEventListener('click', () => {
      item.remove(); // menghapus elemen dari DOM
    });

    actions.append(doneBtn, deleteBtn);
    item.append(label, actions);
    list.appendChild(item);

    input.value = '';
    input.focus();
  });
}

// ---------- Init ----------

function init() {
  renderProductList();
  renderCart();
  setupThemeToggle();
  setupNoteForm();

  document.getElementById('clear-cart-btn').addEventListener('click', handleClearCart);
}

document.addEventListener('DOMContentLoaded', init);
