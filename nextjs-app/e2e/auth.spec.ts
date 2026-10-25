import { test, expect } from "@playwright/test";
import { login, logout, registerCustomer } from "./helpers";

// Keempat langkah di bawah SENGAJA ditulis sebagai satu test (bukan empat
// test terpisah) — Playwright Test memberi setiap test() sebuah browser
// context baru (cookies kosong), jadi sesi login dari satu langkah tidak
// akan terbawa ke test() lain. Register -> logout -> login ulang -> login
// gagal harus berbagi satu context yang sama supaya cookie sesi
// (revoshop_token/revoshop_role) tetap konsisten di seluruh alur.
test("register, logout, login ulang, dan login dengan password salah", async ({
  page,
}) => {
  // 1. Register akun baru -> redirect ke beranda, nama tampil di header.
  const { email, password } = await registerCustomer(page);
  await expect(page).toHaveURL("/");
  // exact: true supaya tidak bentrok dengan teks toast "Selamat datang
  // kembali, Budi." yang juga mengandung substring "Budi" — elemen nama
  // di AuthStatus hanya berisi "Budi" (first_name) persis, tanpa teks lain.
  await expect(page.getByText("Budi", { exact: true })).toBeVisible();

  // 2. Logout -> link "Masuk" kembali terlihat.
  await logout(page);
  await expect(page.getByRole("link", { name: "Masuk" })).toBeVisible();

  // 3. Login ulang dengan kredensial yang sama -> kembali ke beranda,
  // nama tampil lagi.
  await login(page, email, password);
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Budi", { exact: true })).toBeVisible();

  // 4. Kasus negatif: login dengan password salah -> pesan error tampil,
  // tetap di /login (tidak redirect).
  await login(page, email, "password-salah");
  // Pesan ini tampil DUA kali (toast react-hot-toast + <p> error inline di
  // LoginForm) — scope ke paragraf error inline saja supaya tidak kena
  // strict-mode violation getByText biasa.
  await expect(page.locator("p.text-red-600")).toHaveText(
    "Email atau password salah",
  );
  await expect(page).toHaveURL("/login");
});
