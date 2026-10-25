import Link from "next/link";
import { Navbar } from "./Navbar";
import { CartSummary } from "./CartSummary";
import { AuthStatus } from "./AuthStatus";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600">
        RevoShop
      </Link>
      <Navbar />
      <div className="flex items-center gap-3">
        <CartSummary />
        <AuthStatus />
      </div>
    </header>
  );
}
