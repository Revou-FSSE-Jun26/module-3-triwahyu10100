import Link from "next/link";
import type { ReactNode } from "react";

const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Produk" },
  { href: "/dashboard/categories", label: "Kategori" },
  { href: "/dashboard/orders", label: "Pesanan" },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 pb-6">
      <nav
        aria-label="Navigasi dashboard admin"
        className="flex gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3">
        {DASHBOARD_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-blue-600">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-6 px-4">{children}</div>
    </div>
  );
}
