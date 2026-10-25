This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

Storefront RevoShop — Checkpoint 3. Melanjutkan katalog read-only dari
Checkpoint 2 dengan menambahkan autentikasi nyata (register/login/
logout berbasis JWT Flask + cookie sesi), keranjang belanja yang
persisten di `localStorage`, alur checkout nyata ke `POST /orders`,
dashboard admin dengan CRUD produk & kategori, dan suite E2E
Playwright yang menguji seluruh alur itu terhadap backend Flask nyata.

## Fitur yang diimplementasikan

- **Autentikasi**: `/register`, `/login`, logout (tombol "Keluar" di
  header) — sesi disimpan di cookie `revoshop_token` (httpOnly, berisi
  JWT asli dari Flask) dan `revoshop_role` (non-httpOnly, dipakai
  `middleware.ts` untuk redirect cepat, bukan untuk otorisasi
  sesungguhnya).
- **Keranjang persisten**: isi keranjang (`/cart`) tetap ada setelah
  reload browser (disimpan di `localStorage`), dengan kontrol
  tambah/kurang/hapus per baris.
- **Checkout nyata**: `/checkout` mengirim pesanan sesungguhnya ke
  `POST /orders` lewat proxy `app/api/orders/route.ts`, lalu redirect
  ke `/orders`.
- **Dashboard admin** (`/dashboard/**`, hanya untuk akun berperan
  `admin`): CRUD produk (`/dashboard`), CRUD kategori
  (`/dashboard/categories`), dan daftar pesanan milik akun admin yang
  login (`/dashboard/orders`).
- **Toast notifikasi** (`react-hot-toast`) untuk setiap aksi
  login/register/checkout/CRUD admin.
- **Suite E2E Playwright** (`nextjs-app/e2e/**`) mencakup alur auth,
  belanja + checkout, dan CRUD admin.

## Teknologi yang dipakai

Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS
3, `react-hot-toast` (toast notifikasi), `jose` (verifikasi signature
JWT di `lib/require-admin.ts`), `next/navigation` (routing/redirect
client-side), `localStorage` (persistensi keranjang & tampilan nama
user), `NEXT_PUBLIC_API_BASE_URL` (URL dasar backend Flask), dan
`@playwright/test` + `dotenv` (suite E2E, hanya devDependency).

## Cara menjalankan secara lokal

Butuh Node.js ≥ 18 dan backend Flask (`backend/`) berjalan di
`localhost:5000` dengan Postgres lokal aktif.

```powershell
cd nextjs-app
npm install
npm run dev
```

Buat `.env.local` di `nextjs-app/` (gunakan `.env.example` sebagai
acuan):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
JWT_SECRET_KEY=dev-jwt-secret-key-change-in-production
```

`JWT_SECRET_KEY` **harus** sama persis dengan `JWT_SECRET_KEY` di
`backend/.env` — dipakai `lib/require-admin.ts` untuk memverifikasi
signature JWT sebelum mengizinkan mutasi produk/kategori lewat
dashboard admin. Server-only, tidak pernah dikirim ke browser.
(Checkpoint 2 memakai `DEMO_USER_EMAIL`/`DEMO_USER_PASSWORD` untuk
halaman `/orders` — kedua variabel itu sudah tidak dipakai lagi sejak
Checkpoint 3 menggantinya dengan sesi login asli.)

Daripada menjalankan backend Flask dan frontend Next.js secara manual
di dua terminal berbeda, jalankan `./start-dev.ps1` dari root proyek
(satu folder di atas `nextjs-app/`) — script ini membuka jendela
PowerShell baru untuk backend Flask (port 5000), lalu menjalankan
`npm run dev` di jendela saat ini untuk frontend (port 3000).

## Menjalankan suite Playwright

Suite E2E (`e2e/auth.spec.ts`, `e2e/shopping.spec.ts`,
`e2e/admin.spec.ts`) menguji aplikasi yang benar-benar berjalan
terhadap backend Flask nyata — bukan mock. Langkah lengkap dari nol:

1. Jalankan backend Flask + Postgres, lalu frontend Next.js (misalnya
   lewat `./start-dev.ps1` dari root proyek, atau jalankan
   `backend/.venv/Scripts/python.exe backend/run.py` dan
   `npm run dev` di `nextjs-app/` secara manual di dua terminal).
2. **Provisioning akun admin (manual, wajib sebelum menjalankan
   `admin.spec.ts`)** — tidak ada API yang bisa membuat akun admin:
   1. Daftarkan satu akun lewat UI `/register` (atau `POST /users` ke
      Flask), catat email dan password-nya.
   2. Jalankan langsung ke Postgres lokal (psql atau klien lain):
      ```sql
      UPDATE users SET role = 'admin' WHERE email = '<email akun itu>';
      ```
   3. Isi `nextjs-app/.env.test` (baru, gitignored) dengan kredensial
      akun tersebut:
      ```
      E2E_ADMIN_EMAIL=<email akun itu>
      E2E_ADMIN_PASSWORD=<password akun itu>
      ```
3. Unduh browser Playwright sekali saja per environment:
   ```powershell
   npx playwright install
   ```
4. Jalankan suite:
   ```powershell
   npx playwright test
   ```
   (atau `npm run test:e2e`, alias yang sama). `playwright.config.ts`
   mencoba menjalankan `npm run dev` sendiri dengan
   `reuseExistingServer: true` kalau belum ada server di port 3000 —
   backend Flask **tidak** diorkestrasi dari sini, harus sudah
   berjalan secara manual sebelum test dimulai.
5. Setelah selesai, hentikan proses backend/frontend yang kamu
   jalankan manual di langkah 1 (`Ctrl+C` di masing-masing terminal).

## Screenshot

Screenshot disimpan di folder [`../screenshots/`](../screenshots/)
(folder yang sama dipakai checkpoint-checkpoint lain di repo ini).
Setelah file-file berikut benar-benar ada, tampilkan di sini:

1. Beranda:
   ![Beranda](../screenshots/nextjs-app-beranda.png)
2. Daftar produk (`/products`):
   ![Daftar Produk](../screenshots/nextjs-app-produk.png)
3. Detail produk (`/products/[id]`):
   ![Detail Produk](../screenshots/nextjs-app-detail-produk.png)
4. Daftar kategori (`/categories`):
   ![Daftar Kategori](../screenshots/nextjs-app-kategori.png)
5. Halaman register (`/register`):
   ![Register](../screenshots/nextjs-app-register.png)
6. Halaman login (`/login`):
   ![Login](../screenshots/nextjs-app-login.png)
7. Dashboard admin (`/dashboard`):
   ![Dashboard Admin](../screenshots/nextjs-app-dashboard-admin.png)

> Catatan: gambar di atas hanya akan muncul setelah file screenshot
> benar-benar ada di folder `screenshots/` dengan nama yang sesuai.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
