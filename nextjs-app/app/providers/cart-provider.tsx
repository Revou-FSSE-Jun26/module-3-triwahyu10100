"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import type { Product } from "@/lib/types";

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
  | { type: "clear" };

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
