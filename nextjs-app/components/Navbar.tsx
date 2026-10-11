"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/categories", label: "Kategori" },
  { href: "/orders", label: "Pesanan Saya" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="flex gap-4">
      {NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "font-semibold text-blue-600 underline"
                : "text-gray-600 hover:text-blue-600"
            }>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
