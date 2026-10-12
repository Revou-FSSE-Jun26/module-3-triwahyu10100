This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Akun demo untuk halaman /orders

Halaman `/orders` memakai akun demo yang login otomatis di sisi server (lihat `lib/demo-auth.ts`). Sebelum halaman ini bisa dipakai secara lokal:

1. Jalankan backend Flask (`backend/`), lalu daftarkan akun demo lewat `POST /users` (field wajib: `first_name`, `last_name`, `email`, `password`, sesuai `UserRegisterSchema` di `backend/app/schemas.py`).
2. Isi `DEMO_USER_EMAIL` dan `DEMO_USER_PASSWORD` di `.env.local` dengan kredensial akun tersebut.

## Menjalankan backend + frontend sekaligus

Daripada membuka dua terminal manual (satu untuk `backend/`, satu untuk `nextjs-app/`), jalankan `./start-dev.ps1` dari root proyek (satu folder di atas `nextjs-app/`). Script ini membuka jendela PowerShell baru untuk backend Flask (port 5000), lalu menjalankan `npm run dev` di jendela saat ini untuk frontend (port 3000).
