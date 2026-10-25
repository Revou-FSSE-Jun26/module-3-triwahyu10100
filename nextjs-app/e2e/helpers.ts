import type { Page } from "@playwright/test";

export function uniqueEmail(prefix: string): string {
  // Tambahan suffix acak (bukan hanya Date.now()) karena beberapa file spec
  // bisa dijalankan Playwright di worker paralel berbeda pada saat yang
  // hampir bersamaan — dua panggilan uniqueEmail() di dua worker berbeda
  // bisa saja jatuh di milidetik yang identik dan menghasilkan email
  // duplikat (409) tanpa ini.
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}+${Date.now()}-${randomSuffix}@example.com`;
}

export interface CustomerCredentials {
  email: string;
  password: string;
}

export async function registerCustomer(
  page: Page,
): Promise<CustomerCredentials> {
  const email = uniqueEmail("e2e-customer");
  const password = "password123";
  await page.goto("/register");
  await page.getByLabel("Nama Depan").fill("Budi");
  await page.getByLabel("Nama Belakang").fill("Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Daftar" }).click();
  // RegisterForm memanggil POST /api/auth/register (buat akun) lalu POST
  // /api/auth/login (auto-login) secara asinkron SETELAH klik ini selesai
  // di-dispatch — klik Playwright hanya menunggu event-nya terpicu, bukan
  // kedua fetch itu rampung. Tanpa menunggu navigasi keluar dari
  // /register di sini, pemanggil yang langsung melakukan page.goto() lain
  // bisa membatalkan fetch auto-login yang masih berjalan, membuat akun
  // tetap tercipta tapi sesi (cookie) tidak pernah benar-benar terpasang.
  await page.waitForURL((url) => url.pathname !== "/register");
  return { email, password };
}

export async function login(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Keluar" }).click();
}
