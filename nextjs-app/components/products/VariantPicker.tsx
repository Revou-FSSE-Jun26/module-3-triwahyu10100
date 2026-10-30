"use client";
import { useState } from "react";

const DECORATIVE_VARIANTS = ["S", "M", "L", "XL"] as const;

/**
 * Placeholder DEKORATIF murni — tidak terhubung ke harga, stok, cart
 * payload, atau panggilan backend apapun. Model `Product` di Flask
 * (backend/app/models.py) tidak punya konsep varian sama sekali
 * (hanya category_id/price/stock_quantity/sku/images), jadi komponen
 * ini sengaja hanya mengubah state visual lokalnya sendiri. Jangan
 * dihubungkan ke AddToCartButton atau state cart apapun.
 */
export function VariantPicker() {
  const [selected, setSelected] = useState<string>(DECORATIVE_VARIANTS[0]);

  return (
    <div role="group" aria-label="Varian (tampilan saja)" className="space-y-2">
      <p className="text-caption text-muted">Ukuran</p>
      <div className="flex gap-2">
        {DECORATIVE_VARIANTS.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setSelected(variant)}
            aria-pressed={selected === variant}
            className={`h-9 w-9 rounded-md border text-caption font-medium transition-colors motion-safe:duration-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
              selected === variant
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground hover:bg-surface"
            }`}>
            {variant}
          </button>
        ))}
      </div>
    </div>
  );
}
