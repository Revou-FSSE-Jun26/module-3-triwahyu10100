"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  ReactNode,
} from "react";
import type { Product } from "@/lib/types";

const CART_STORAGE_KEY = "revoshop_cart";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "increment"; productId: number }
  | { type: "decrement"; productId: number }
  | { type: "remove"; productId: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find(
        (l) => l.product.id === action.product.id,
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === action.product.id
              ? { ...l, quantity: l.quantity + action.quantity }
              : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { product: action.product, quantity: action.quantity },
        ],
      };
    }
    case "increment":
      return {
        lines: state.lines.map((l) =>
          l.product.id === action.productId
            ? { ...l, quantity: l.quantity + 1 }
            : l,
        ),
      };
    case "decrement":
      return {
        lines: state.lines
          .map((l) =>
            l.product.id === action.productId
              ? { ...l, quantity: l.quantity - 1 }
              : l,
          )
          .filter((l) => l.quantity > 0),
      };
    case "remove":
      return {
        lines: state.lines.filter((l) => l.product.id !== action.productId),
      };
    case "clear":
      return { lines: [] };
    case "hydrate":
      return { lines: action.lines };
    default:
      return state;
  }
}

export interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  totalPrice: number;
  addToCart: (product: Product, quantity: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  getRemainingStock: (product: Product) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Efek 1 — hanya jalan sekali, sesudah mount. Tidak pernah dijalankan
  // selama render awal/inisialisasi useReducer, supaya HTML yang
  // dikirim server (selalu "keranjang kosong", karena server tidak
  // punya akses localStorage) tidak pernah berbeda dari apa yang React
  // render pertama kali di client — jadi tidak ada peringatan hydration
  // mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", lines: JSON.parse(raw) as CartLine[] });
      }
    } catch {
      // localStorage tidak tersedia atau datanya korup — mulai dari
      // keranjang kosong, jangan sampai melempar error ke seluruh app.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Efek 2 — menulis setiap kali isi keranjang berubah, TAPI baru aktif
  // setelah efek 1 selesai (isHydrated=true). Tanpa guard ini, pada
  // commit mount pertama efek ini akan menimpa localStorage dengan
  // array kosong sesaat sebelum dispatch(hydrate) di atas benar-benar
  // diterapkan.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage penuh / mode privat (mis. Safari) — abaikan, keranjang
      // tetap berfungsi normal di memori untuk sesi ini.
    }
  }, [state.lines, isHydrated]);

  const itemCount = useMemo(
    () => state.lines.reduce((n, l) => n + l.quantity, 0),
    [state.lines],
  );
  const totalPrice = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [state.lines],
  );
  const value: CartContextValue = {
    lines: state.lines,
    itemCount,
    totalPrice,
    addToCart: (product, quantity) =>
      dispatch({ type: "add", product, quantity }),
    increment: (productId) => dispatch({ type: "increment", productId }),
    decrement: (productId) => dispatch({ type: "decrement", productId }),
    remove: (productId) => dispatch({ type: "remove", productId }),
    clear: () => dispatch({ type: "clear" }),
    getRemainingStock: (product) => {
      const line = state.lines.find((l) => l.product.id === product.id);
      const inCart = line?.quantity ?? 0;
      return Math.max(product.stock_quantity - inCart, 0);
    },
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
