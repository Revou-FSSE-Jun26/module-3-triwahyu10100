# Folder Screenshot

Simpan hasil screenshot di folder ini dengan nama file **persis**
seperti di bawah, supaya link gambar di `README.md` (root proyek)
otomatis muncul tanpa perlu diedit lagi.

| Nama file di sini | Halaman yang di-screenshot | Cara ambil |
|---|---|---|
| `html-css-desktop.png` | `html-css/index.html` | Buka di browser, lebar window ≥ 1024px (desktop biasa) |
| `html-css-mobile.png` | `html-css/index.html` | DevTools (F12) → toggle device toolbar (Ctrl+Shift+M) → pilih ukuran HP, misal iPhone SE / 375px |
| `javascript-dom-events.png` | `javascript/dom-events.html` | Tambahkan 2-3 produk ke keranjang dulu, lalu screenshot supaya terlihat isi keranjang & total |
| `javascript-array-methods.png` | `javascript/array-methods.html` | Screenshot kondisi default (semua statistik + tabel order terlihat) |
| `typescript-tailwind-desktop.png` | `typescript-tailwind/index.html` | Ketik sesuatu di kotak pencarian dulu (misal "keyboard") supaya terlihat live search sedang memfilter, lalu screenshot |
| `typescript-tailwind-mobile.png` | `typescript-tailwind/index.html` | Sama seperti di atas, tapi dengan device toolbar aktif (mobile width) |

## Cara Ambil Screenshot (Windows)

1. Buka halaman `.html` yang mau di-screenshot di browser (Chrome/Edge).
2. Untuk versi desktop: langsung screenshot window browser.
3. Untuk versi mobile: tekan `F12` untuk buka DevTools, lalu
   `Ctrl+Shift+M` untuk toggle "device toolbar", pilih ukuran device
   (misal "iPhone SE"), baru screenshot.
4. Screenshot dengan `Win + Shift + S` (Snipping Tool), pilih area,
   lalu paste ke Paint atau langsung save dari clipboard ke folder ini
   dengan nama sesuai tabel di atas.

Setelah semua file ada di folder ini, jalankan dari root proyek:

```powershell
git add screenshots
git commit -m "Add screenshots for html-css, javascript, and typescript-tailwind pages"
```
