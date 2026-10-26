import { test, expect } from "@playwright/test";
import { registerCustomer, logout } from "./helpers";

// Regresi untuk bug: keranjang (localStorage "revoshop_cart", global per
// browser, bukan per-akun) tidak dikosongkan saat logout, jadi akun B yang
// login setelah akun A logout mewarisi isi keranjang akun A alih-alih
// mulai dari kosong. Fix: handleLogout() di components/AuthStatus.tsx
// memanggil useCart().clear() tepat di samping useAuth().logout().
test("keranjang akun A tidak terbawa ke akun B setelah logout", async ({
  page,
}) => {
  // Akun A: tambah 1 produk ke keranjang. Disaring dulu lewat kotak
  // pencarian (sama seperti shopping.spec.ts) supaya hanya satu hasil
  // yang cocok -- menghindari strict-mode violation dari banyaknya
  // produk/tombol "Tambah ke Keranjang" yang identik di daftar penuh.
  await page.goto("/products");
  const productLink = page.locator('a[href^="/products/"]').first();
  await expect(productLink).toBeVisible();
  const productName = (await productLink.locator("h3").innerText()).trim();

  await page.getByLabel("Cari produk").fill(productName);
  await page.waitForURL(/search=/);
  await page.locator('a[href^="/products/"]').first().click();
  await expect(page).toHaveURL(/\/products\/\d+$/);
  await page.getByRole("button", { name: "Tambah ke Keranjang" }).click();
  await expect(
    page.getByRole("link", { name: /Keranjang: 1 item/ }),
  ).toBeVisible();

  await registerCustomer(page); // akun A, keranjang anonim ikut terbawa (perilaku yang diharapkan: sama orang)
  await expect(
    page.getByRole("link", { name: /Keranjang: 1 item/ }),
  ).toBeVisible();

  // Logout dari akun A.
  await logout(page);
  await expect(page.getByRole("link", { name: "Masuk" })).toBeVisible();

  // Akun B (akun baru, berbeda) login/register di browser yang sama -->
  // badge keranjang harus 0 item, bukan mewarisi 1 item milik akun A.
  await registerCustomer(page);
  await expect(
    page.getByRole("link", { name: /Keranjang: 0 item/ }),
  ).toBeVisible();
});
