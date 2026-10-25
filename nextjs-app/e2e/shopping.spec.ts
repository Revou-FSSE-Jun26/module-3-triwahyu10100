import { test, expect } from "@playwright/test";
import { registerCustomer } from "./helpers";

test("browse, cari produk, tambah ke keranjang, checkout", async ({ page }) => {
  await page.goto("/products");

  const productLink = page.locator('a[href^="/products/"]').first();
  await expect(productLink).toBeVisible();
  const productName = (await productLink.locator("h3").innerText()).trim();

  // SearchBar: mencari persis nama produk yang sudah ditemukan harus tetap
  // menampilkannya di hasil (debounce ~300ms, lalu router.push menambah
  // ?search=... ke URL).
  await page.getByLabel("Cari produk").fill(productName);
  await page.waitForURL(/search=/);
  await expect(page.getByRole("heading", { name: productName })).toBeVisible();

  // Buka halaman detail dari salah satu hasil pencarian.
  await page.locator('a[href^="/products/"]').first().click();
  await expect(page).toHaveURL(/\/products\/\d+$/);
  await expect(
    page.getByRole("heading", { name: productName, level: 1 }),
  ).toBeVisible();

  // Tambah ke keranjang bisa dilakukan sebagai pengunjung anonim — state
  // keranjang murni di CartProvider (client), belum menyentuh route yang
  // dilindungi middleware.ts.
  await page.getByRole("button", { name: "Tambah ke Keranjang" }).click();
  // Tunggu badge keranjang di header memperlihatkan 1 item sebelum pindah
  // halaman — tanpa ini, navigasi penuh (page.goto di registerCustomer di
  // bawah) bisa terjadi sebelum efek penulisan localStorage di
  // cart-provider.tsx sempat ter-commit, membuat keranjang tampak kosong
  // lagi setelah reload. Sengaja TIDAK menunggu teks tombol "Ditambahkan!"
  // — kalau sisa stok produk yang kebetulan terpilih pas-pasan (jadi 0
  // setelah ditambah 1), AddToCartButton langsung menampilkan "Stok di
  // keranjang sudah maksimum" alih-alih "Ditambahkan!" (lihat
  // components/AddToCartButton.tsx), sehingga badge header adalah sinyal
  // yang selalu benar terlepas dari kondisi stok itu.
  await expect(
    page.getByRole("link", { name: /Keranjang: 1 item/ }),
  ).toBeVisible();

  // Catatan (penyesuaian urutan dari rencana awal di design.md): /cart
  // adalah route yang dilindungi middleware.ts (LOGIN_REQUIRED_PREFIXES),
  // jadi tidak bisa dibuka sebagai pengunjung anonim — mengunjunginya di
  // titik ini akan redirect ke /login sebelum tabel keranjang sempat
  // dirender. registerCustomer() dipanggil DI SINI (sebelum goto("/cart"),
  // bukan sesudahnya) justru supaya alur tetap valid: isi keranjang
  // ditambahkan saat anonim (persisten lewat localStorage), lalu baru
  // register/login, baru /cart dibuka sebagai user yang sudah bersesi.
  await registerCustomer(page);

  await page.goto("/cart");
  const row = page.locator("tbody tr").filter({ hasText: productName });
  await expect(row).toBeVisible();
  const cells = row.locator("td");
  await expect(cells.nth(1)).toContainText("1"); // kuantitas
  const hargaSatuan = (await cells.nth(2).innerText()).trim();
  const subtotal = (await cells.nth(3).innerText()).trim();
  expect(subtotal).toBe(hargaSatuan); // kuantitas 1 -> subtotal == harga satuan

  await page.getByRole("link", { name: "Checkout" }).click();
  await expect(page).toHaveURL("/checkout");
  await page
    .getByLabel("Alamat Pengiriman")
    .fill("Jl. Testing No. 123, Jakarta");
  await page.getByRole("button", { name: "Buat Pesanan" }).click();

  await expect(page).toHaveURL("/orders");
  await page.goto("/cart");
  await expect(page.getByText("Keranjang Anda masih kosong.")).toBeVisible();
});
