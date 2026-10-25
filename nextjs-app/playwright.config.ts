import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "@playwright/test";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false, // auth.spec.ts membuat akun baru yang dipakai lagi di test berikutnya dalam file yang sama — urutan harus terjaga
  // Dipaksa satu worker (bukan hanya fullyParallel: false, yang cuma
  // menjamin urutan DI DALAM satu file) — backend Flask dev server dan
  // `npm run dev`/`next start` lokal yang sama dipakai bersama oleh
  // ketiga file spec; menjalankannya di beberapa worker sekaligus
  // menimbulkan kontensi (SSR + fetch bersamaan) yang terbukti membuat
  // test flaky secara nyata saat dicoba paralel (login/registrasi
  // kadang tidak sempat redirect dalam batas waktu default).
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    // Backend Flask (dan Postgres) TIDAK dijalankan dari sini — harus
    // sudah berjalan secara manual (./start-dev.ps1 atau `python run.py`
    // di backend/) sebelum `npx playwright test` dijalankan. Orkestrasi
    // proses Python lintas-platform dari webServer Playwright dianggap
    // tidak sepadan kompleksitasnya untuk checkpoint ini.
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
