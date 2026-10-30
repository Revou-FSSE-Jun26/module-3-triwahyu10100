"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const BASE_NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/categories", label: "Kategori" },
  { href: "/orders", label: "Pesanan Saya" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const navLinks =
    user?.role === "admin"
      ? [...BASE_NAV_LINKS, { href: "/dashboard", label: "Dashboard Admin" }]
      : BASE_NAV_LINKS;

  return (
    <nav
      aria-label="Navigasi utama"
      className="flex flex-wrap gap-x-5 gap-y-1 text-body">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-sm transition-colors motion-safe:duration-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
              isActive
                ? "font-semibold text-accent underline"
                : "text-muted hover:text-accent"
            }`}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
