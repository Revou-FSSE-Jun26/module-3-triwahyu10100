"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Container } from "@/components/layout/Container";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast("Fitur pendaftaran newsletter akan segera hadir.");
  }

  return (
    <section className="band-ink">
      <Container size="sm" className="py-16 text-center">
        <h2 className="text-h2">Tetap Terhubung</h2>
        <p className="text-body mt-3 text-ink-foreground/80">
          Daftarkan email Anda untuk info produk dan penawaran terbaru dari
          RevoShop.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Alamat email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-ink-foreground/20 bg-transparent px-4 py-3 text-body text-ink-foreground placeholder:text-ink-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-3 text-body font-medium text-accent-foreground transition-colors motion-safe:duration-base hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink">
            Daftar
          </button>
        </form>
      </Container>
    </section>
  );
}
