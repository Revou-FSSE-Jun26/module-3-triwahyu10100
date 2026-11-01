# RevoShop — Frontend (Checkpoint 1-3)

Proyek frontend RevoShop, dari latihan fundamental sampai aplikasi
e-commerce lengkap. `html-css/`, `javascript/`, dan `typescript-tailwind/`
adalah latihan fundamental Checkpoint 1 (HTML semantik, CSS Grid/
Flexbox + responsive, vanilla JavaScript, TypeScript + Tailwind CSS) —
semua data contohnya sengaja dibuat menyerupai bentuk response API
backend RevoShop (`backend/app/models/*.py`, lihat `backend/README.md`),
supaya latihan ini terasa seperti pemanasan langsung untuk RevoShop
yang sesungguhnya. `nextjs-app/` adalah RevoShop yang sesungguhnya itu —
storefront Next.js lengkap (Checkpoint 2-3) yang benar-benar terhubung
ke backend Flask tersebut, lihat sectionnya di bawah untuk detail dan
link demo live.

## Struktur Folder

```
html-css/            -> Halaman profil semantik + form kontak (HTML5 + CSS Grid/Flexbox, responsive)
javascript/           -> Latihan DOM manipulation/events & array methods (forEach/map/filter/reduce)
typescript-tailwind/  -> Proyek TypeScript + Tailwind CSS: katalog produk bertipe, live search, keranjang interaktif
nextjs-app/            -> Storefront RevoShop Next.js 14 App Router + TypeScript + Tailwind (Checkpoint 2-3: auth, cart/checkout, dashboard admin, E2E Playwright), mengonsumsi API Flask
backend/               -> Flask + PostgreSQL API RevoShop (checkpoint sebelumnya, tidak diubah di checkpoint ini)
```

### `html-css/`

Halaman profil toko RevoShop (`index.html` + `styles.css`), dibangun
dengan elemen HTML5 semantik (`header`, `main`, `section`, `footer`),
form kontak dengan label & tipe input yang sesuai (email, tel, select,
radio, checkbox), layout `profile-hero` dengan CSS Grid dua kolom di
layar besar, dan breakpoint responsive di `640px` (tablet) &
`900px` (desktop).

**Cara menjalankan:** buka `html-css/index.html` langsung di browser
(double-click, atau klik kanan → "Open with Live Server" jika memakai
ekstensi VS Code/Kiro).

### `javascript/`

Dua halaman latihan vanilla JS yang saling terhubung lewat link
navigasi:

- `dom-events.html` + `dom-events.js` — mini keranjang belanja RevoShop:
  memilih/mengubah elemen DOM, toggle class (dark mode, tandai catatan
  selesai), membuat & menghapus elemen (catatan, item keranjang), serta
  event handling (`click`, `submit` dengan `preventDefault()`).
- `array-methods.html` + `array-methods.js` — mengolah data order
  RevoShop dengan `forEach`, `map`, `filter`, dan `reduce` untuk
  menghasilkan statistik, daftar order bernilai tinggi, dan tabel yang
  bisa difilter per status.

Kedua halaman berbagi `shared.css`.

**Cara menjalankan:** buka `javascript/dom-events.html` atau
`javascript/array-methods.html` langsung di browser. Tidak butuh build
step — file `.js` di-load langsung lewat tag `<script>`.

### `typescript-tailwind/`

Katalog produk RevoShop yang ditulis dalam TypeScript dan distyling
sepenuhnya dengan Tailwind CSS (utility-first, tanpa CSS custom).

- `src/types.ts` — `interface Product`, `interface Category`, union
  types (`StockStatus`, `CatalogNotification` sebagai discriminated
  union, `SortOption`).
- `src/data.ts` — array produk & kategori bertipe, disalin dari
  `backend/1_checkpoint_revoshop_sql/seed.sql`.
- `src/catalog.ts` — logika murni (filter, sort, operasi keranjang)
  yang reusable & tidak bergantung pada DOM.
- `src/render.ts` — fungsi render DOM (product card, grid, filter
  kategori, keranjang, toast notifikasi), memetakan field bertipe
  (`StockStatus`) ke class Tailwind kondisional.
- `src/main.ts` — entry point yang menyatukan state, event listener
  (live search, filter kategori, sort, tambah/kurang/hapus item
  keranjang).
- `index.html` — layout mobile-first (grid 1 kolom di HP, `sm:` 2
  kolom, `lg:` grid produk + panel keranjang sticky di sebelah kanan).

**Cara menjalankan (butuh Node.js ≥ 18):**

```powershell
cd typescript-tailwind
npm install
npm run build      # menjalankan tsc lalu tailwindcss CLI
```

Setelah build selesai, buka `typescript-tailwind/index.html` langsung
di browser (atau lewat Live Server). Untuk mode watch saat development:

```powershell
npm run watch:ts    # terminal 1
npm run watch:css   # terminal 2
```

`tsc` dikonfigurasi lewat `tsconfig.json` (strict mode aktif —
`strict`, `noImplicitAny`, `noUnusedLocals`, dst). Tailwind CSS 4
dijalankan lewat `@tailwindcss/cli`, mengambil `styles/input.css`
(`@import "tailwindcss";`) dan otomatis memindai class yang dipakai di
`index.html` serta `dist/*.js` hasil kompilasi TypeScript.

### `backend/`

Backend Flask + PostgreSQL dari checkpoint sebelumnya (lihat
`backend/README.md` untuk detail lengkap). Tidak disentuh pada
checkpoint frontend fundamentals ini — hanya dijadikan referensi bentuk
data (`Product`, `Category`, `Order`) untuk ketiga folder di atas.

### `nextjs-app/`

**🔗 Live Demo:** [module-3-triwahyu10100.vercel.app](https://module-3-triwahyu10100.vercel.app/)
— demo ini terhubung ke backend Flask yang sudah di-deploy (bukan
`localhost`), jadi fitur yang butuh akun demo/admin mengikuti data yang
memang ada di database production, bukan database lokal milikmu.

Storefront RevoShop, dibangun dengan Next.js 14 (App Router) +
TypeScript + Tailwind CSS, mengonsumsi API Flask di `backend/` secara
langsung (bukan menduplikasi data contoh seperti di
`typescript-tailwind/`). Checkpoint 2 membangun fondasi katalog
read-only; **Checkpoint 3** menambahkan autentikasi (register/login/
logout berbasis JWT + cookie sesi), keranjang yang persisten di
`localStorage`, alur checkout nyata ke `POST /orders`, dashboard admin
dengan CRUD produk & kategori, serta suite E2E Playwright yang
mencakup seluruh alur itu. Di atas semua itu, tampilan storefront
sudah di-redesign penuh terinspirasi gaya premium-minimal tema
Shopify Horizon (referensi gaya saja — tidak ada kode/aset/logo
Shopify yang disalin; seluruh komponen ditulis ulang dari nol).

Hasil akhirnya, RevoShop bukan lagi sekadar latihan katalog read-only,
melainkan aplikasi e-commerce frontend yang cukup lengkap: autentikasi,
keranjang + checkout nyata, dashboard admin CRUD produk/kategori,
halaman akun pelanggan, dan tampilan yang sudah direstyle — semuanya
terhubung penuh ke Flask API Module 2.

Konsep yang dilatih:

- **Server Components** untuk fetch data server-to-server (produk,
  kategori, order) — backend Flask tidak mengaktifkan CORS, jadi semua
  fetch katalog/order dilakukan dari komponen server, bukan dari
  browser.
- **Client Components** untuk interaktivitas di browser: state
  keranjang (`CartProvider` + `useReducer`, persisten via
  `localStorage`), search box dengan debounce, filter kategori,
  penghitung kuantitas, dan highlight link nav aktif lewat
  `usePathname()`.
- **Route Handler sebagai proxy same-origin** (`app/api/**`) — satu-
  satunya jalur bagi Client Component untuk melakukan mutasi
  (POST/PUT/DELETE) ke Flask, karena backend tidak mengaktifkan CORS.
- **Cookie sesi** (`revoshop_token` httpOnly berisi JWT asli,
  `revoshop_role` non-httpOnly untuk UX) dan **middleware route
  protection** (`middleware.ts`) yang melindungi `/cart`, `/checkout`,
  `/orders`, `/account`, dan `/dashboard/**`.
- **Halaman Akun** (`/account`) — pelanggan yang login bisa melihat
  profilnya (email, role, tanggal dibuat — read-only) dan mengedit
  `username`, `phone`, `address` lewat proxy `PUT /api/users/[id]`
  yang meneruskan `Authorization: Bearer <token>` ke Flask.
- **Dashboard admin**: CRUD penuh untuk produk dan kategori, termasuk
  guard penghapusan (Flask membalas `409` kalau produk/kategori masih
  dipakai order lain — pesan error-nya diteruskan apa adanya ke UI),
  plus halaman overview pesanan yang menampilkan catatan bahwa
  `GET /orders` di backend memang dibatasi ke identitas JWT pemanggil
  (tidak ada endpoint admin untuk melihat order akun lain).
- **Toast notification** (`react-hot-toast`) untuk feedback aksi
  (login, checkout, CRUD admin).
- **Redesign visual bergaya Horizon**: design token di `globals.css`
  (warna, type scale, spacing 4/8px, radius, shadow, transition),
  komponen block-based (`Hero`, grid koleksi kategori/`BentoGrid`,
  `ProductCard` dengan hover state), skeleton loading
  (`loading.tsx`), serta `error.tsx`/`not-found.tsx` yang ramah
  pengguna. Semua elemen interaktif baru punya focus ring yang
  terlihat, dan animasi fade-in menghormati
  `prefers-reduced-motion`.
- **E2E testing dengan Playwright** (`nextjs-app/e2e/**`) — mencakup
  auth, belanja/checkout, CRUD admin, dan isolasi keranjang antar
  akun, dijalankan terhadap backend Flask nyata.
- **Routing App Router**: beranda, `/products`, `/products/[id]`,
  `/categories`, `/orders`, `/account`, `/register`, `/login`,
  `/cart`, `/checkout`, dan `/dashboard/**` (admin), masing-masing
  dengan `loading.tsx`/`error.tsx` sendiri bila relevan.
- **Styling dengan Tailwind CSS**, konsisten dengan pendekatan
  utility-first yang sama dipakai di `typescript-tailwind/`.

**Cara menjalankan (butuh Node.js ≥ 18, backend Flask harus berjalan
di `localhost:5000`):**

```powershell
cd nextjs-app
npm install
npm run dev
```

Buat `.env.local` di `nextjs-app/` (gunakan `.env.example` sebagai
acuan) dengan variabel berikut:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
JWT_SECRET_KEY=dev-jwt-secret-key-change-in-production
```

`JWT_SECRET_KEY` **harus** sama persis dengan `JWT_SECRET_KEY` di
`backend/.env` — dipakai `lib/require-admin.ts` untuk memverifikasi
signature JWT secara kriptografis sebelum mengizinkan mutasi produk/
kategori lewat dashboard admin. Server-only, tidak pernah dikirim ke
browser. (Checkpoint 2 memakai `DEMO_USER_EMAIL`/`DEMO_USER_PASSWORD`
untuk halaman `/orders` — kedua variabel itu sudah tidak dipakai lagi
sejak Checkpoint 3 menggantinya dengan sesi login asli. Variabel
`E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` dipakai khusus untuk suite
Playwright, lihat di bawah.)

Belum ada endpoint untuk mendaftarkan akun admin — buat sendiri lewat
SQL manual: daftar akun biasa dulu lewat `/register`, lalu jalankan
`UPDATE users SET role = 'admin' WHERE email = '<email akun itu>';`
langsung ke Postgres (lihat langkah lengkap di
`nextjs-app/README.md`).

Daripada menjalankan backend Flask dan frontend Next.js secara manual
di dua terminal berbeda, jalankan `./start-dev.ps1` dari root proyek —
script ini otomatis membuka jendela PowerShell baru untuk backend
Flask (port 5000), lalu menjalankan `npm run dev` untuk frontend
(port 3000) di jendela yang sama.

**Cara menjalankan test:** `npx playwright test` dari `nextjs-app/`.
Syaratnya: backend Flask + Postgres harus sudah berjalan lebih dulu,
dan `nextjs-app/.env.test` sudah diisi kredensial akun admin
(`E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`) hasil provisioning manual di
atas. Langkah lengkap (termasuk cara provisioning admin untuk
kebutuhan test) ada di bagian "Menjalankan suite Playwright" di
`nextjs-app/README.md`.

## Commit History

Riwayat commit disusun bertahap per topik: HTML/CSS, lalu JavaScript
(DOM/events dan array methods), lalu TypeScript + Tailwind — sesuai
urutan pengerjaan checkpoint ini.

## Screenshot

Screenshot disimpan di folder [`screenshots/`](screenshots/) — lihat
`screenshots/README.md` untuk daftar nama file yang diharapkan dan cara
mengambilnya. Setelah file-file itu ada, tampilkan di sini:

1. `html-css/index.html` pada lebar desktop (≥ 1024px):
   ![HTML/CSS — Desktop](screenshots/html-css-desktop.png)
2. `html-css/index.html` pada lebar mobile (≤ 480px):
   ![HTML/CSS — Mobile](screenshots/html-css-mobile.png)
3. `javascript/dom-events.html` — mini keranjang belanja:
   ![JavaScript — DOM & Events](screenshots/javascript-dom-events.png)
   ![JavaScript — DOM & Events (catatan)](screenshots/javascript-dom-events-2.png)
4. `javascript/array-methods.html` — statistik & tabel order:
   ![JavaScript — Array Methods](screenshots/javascript-array-methods.png)
5. `typescript-tailwind/index.html` dengan live search aktif (desktop):
   ![TypeScript + Tailwind — Desktop](screenshots/typescript-tailwind-desktop.png)
6. `typescript-tailwind/index.html` pada lebar mobile:
   ![TypeScript + Tailwind — Mobile](screenshots/typescript-tailwind-mobile.png)
7. `nextjs-app/` — Beranda:
   ![Next.js — Beranda](screenshots/nextjs-app-beranda.png)
8. `nextjs-app/` — Daftar produk (`/products`):
   ![Next.js — Daftar Produk](screenshots/nextjs-app-produk.png)
9. `nextjs-app/` — Detail produk (`/products/[id]`):
   ![Next.js — Detail Produk](screenshots/nextjs-app-detail-produk.png)
10. `nextjs-app/` — Daftar kategori (`/categories`):
    ![Next.js — Daftar Kategori](screenshots/nextjs-app-kategori.png)
11. `nextjs-app/` — Keranjang (`/cart`):
    ![Next.js — Keranjang](screenshots/nextjs-app-keranjang.png)
12. `nextjs-app/` — Checkout (`/checkout`):
    ![Next.js — Checkout](screenshots/nextjs-app-checkout.png)
13. `nextjs-app/` — Login/Register:
    ![Next.js — Login](screenshots/nextjs-app-login.png)
    ![Next.js — Register](screenshots/nextjs-app-register.png)
14. `nextjs-app/` — Dashboard admin (`/dashboard`):
    ![Next.js — Dashboard Admin](screenshots/nextjs-app-dashboard-admin.png)
15. `nextjs-app/` — Halaman akun (`/account`):
    ![Next.js — Halaman Akun](screenshots/nextjs-app-account.png)

> Catatan: gambar di atas hanya akan muncul setelah file screenshot
> benar-benar ada di folder `screenshots/` dengan nama yang sesuai.
