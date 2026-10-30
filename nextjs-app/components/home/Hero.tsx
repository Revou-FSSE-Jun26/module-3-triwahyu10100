import Link from "next/link";
import { Container } from "@/components/layout/Container";

export interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function Hero({
  headline = "Belanja lebih mudah, tampilan lebih jernih.",
  subheadline = "Produk pilihan, harga transparan, langsung dari katalog RevoShop.",
  ctaHref = "/products",
  ctaLabel = "Lihat Semua Produk",
}: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-surface to-background">
      <Container size="lg" className="py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-h1 sm:text-display text-balance text-foreground">
            {headline}
          </h1>
          <p className="text-body-lg mt-4 text-muted">{subheadline}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-6 py-3 text-body font-medium text-accent-foreground transition-colors motion-safe:duration-base motion-safe:ease-premium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
            {ctaLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}
