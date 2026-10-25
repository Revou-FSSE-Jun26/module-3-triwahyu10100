import { test, expect } from "@playwright/test";
import { login } from "./helpers";
import { formatRupiah } from "../lib/format";

test.beforeAll(() => {
  if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
    throw new Error(
      "E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD belum diisi di nextjs-app/.env.test — " +
        "lihat README untuk langkah provisioning akun admin secara manual.",
    );
  }
});

test("login admin, CRUD produk di dashboard", async ({ page }) => {
  await login(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expect(page).toHaveURL("/dashboard");

  const unique = Date.now();
  const productName = `E2E Product ${unique}`;
  const sku = `E2E-${unique}`;

  // Pada titik ini hanya CreateProductForm yang ada di halaman (belum ada
  // baris yang diedit), jadi page.getByLabel(...) tanpa scoping tambahan
  // tetap unik.
  await page.getByLabel("Nama Produk").fill(productName);
  await page.getByLabel("Kategori").selectOption({ index: 1 });
  await page.getByLabel("Harga", { exact: true }).fill("50000");
  await page.getByLabel("Stok").fill("10");
  await page.getByLabel("SKU").fill(sku);
  await page.getByRole("button", { name: "Simpan Produk" }).click();

  const row = page.locator("tbody tr").filter({ hasText: productName });
  await expect(row).toBeVisible();

  // Edit harga. Setelah tombol "Edit" diklik, baris itu digantikan
  // EditProductForm inline — CreateProductForm tetap ada di atas tabel,
  // jadi field diedit harus di-scope ke <tr> yang memuat tombol "Simpan
  // Perubahan" supaya tidak ambigu dengan field nama yang sama di
  // CreateProductForm.
  await row.getByRole("button", { name: "Edit" }).click();
  const editRow = page.locator("tr").filter({
    has: page.getByRole("button", { name: "Simpan Perubahan" }),
  });
  await editRow.getByLabel("Harga", { exact: true }).fill("75000");
  await editRow.getByRole("button", { name: "Simpan Perubahan" }).click();

  const updatedRow = page.locator("tbody tr").filter({ hasText: productName });
  await expect(updatedRow).toContainText(formatRupiah(75000));

  // Hapus produk. handleDelete memakai window.confirm — pasang listener
  // auto-accept SEBELUM mengklik tombol "Hapus".
  page.on("dialog", (dialog) => dialog.accept());
  await updatedRow.getByRole("button", { name: "Hapus" }).click();
  await expect(
    page.locator("tbody tr").filter({ hasText: productName }),
  ).toHaveCount(0);

  // Catatan: assertion 409 deletion-guard ("Cannot delete product: it is
  // linked to one or more active orders") SENGAJA tidak ditulis sebagai
  // assertion keras di sini — seed data produk yang pasti terhubung ke
  // order aktif tidak terjamin konsisten antar-run lokal (tergantung
  // urutan test lain yang sudah membuat/menghapus order sebelum test ini
  // berjalan), persis seperti diizinkan brief ("if seed data can't
  // reliably guarantee this across runs, skip that specific assertion and
  // note why in a code comment"). Jalur 409 itu sendiri sudah diverifikasi
  // manual lewat curl saat FEAT-003 (lihat findings FEAT-003.json).
});
