import Link from "next/link";
import { Navbar } from "./Navbar";
import { CartSummary } from "./CartSummary";
import { AuthStatus } from "./AuthStatus";
import { Container } from "./layout/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
      <Container
        size="md"
        className="flex flex-wrap items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="text-h3 font-bold text-foreground transition-colors motion-safe:duration-base hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm">
          RevoShop
        </Link>
        <Navbar />
        <div className="flex items-center gap-3">
          <CartSummary />
          <AuthStatus />
        </div>
      </Container>
    </header>
  );
}
