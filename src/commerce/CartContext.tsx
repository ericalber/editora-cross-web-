"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { products } from "@/data/products";

const STORAGE_KEY = "cross_cart_v1";
const MAX_QTY = 99;

export type CartItem = {
  idLivro: string;
  slug: string;
  titulo: string;
  capa: string;
  unitPrice: number;
  precoOriginal: number;
  desconto?: number;
  categoria: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  coupon?: string | null;
};

type CartAction =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD_ITEM"; payload: { item: CartItem; qty: number } }
  | { type: "REMOVE_ITEM"; payload: { idLivro: string } }
  | { type: "SET_QTY"; payload: { idLivro: string; qty: number } }
  | { type: "CLEAR_CART" };

export type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  coupon?: string | null;
  isHydrated: boolean;
  addItem: (slug: string, qty?: number) => void;
  removeItem: (idLivro: string) => void;
  setQty: (idLivro: string, qty: number) => void;
  clearCart: () => void;
};

const initialState: CartState = {
  items: [],
  coupon: null,
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload;
    }
    case "ADD_ITEM": {
      const { item, qty } = action.payload;
      const existing = state.items.find((cartItem) => cartItem.idLivro === item.idLivro);
      if (existing) {
        const updatedItems = state.items.map((cartItem) =>
          cartItem.idLivro === item.idLivro
            ? {
                ...cartItem,
                qty: clampQty(cartItem.qty + qty),
              }
            : cartItem,
        );
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { ...item, qty: clampQty(qty) }],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((cartItem) => cartItem.idLivro !== action.payload.idLivro),
      };
    }
    case "SET_QTY": {
      const { idLivro, qty } = action.payload;
      const nextQty = clampQty(qty);
      if (nextQty <= 0) {
        return {
          ...state,
          items: state.items.filter((cartItem) => cartItem.idLivro !== idLivro),
        };
      }
      return {
        ...state,
        items: state.items.map((cartItem) =>
          cartItem.idLivro === idLivro
            ? {
                ...cartItem,
                qty: nextQty,
              }
            : cartItem,
        ),
      };
    }
    case "CLEAR_CART": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

function clampQty(value: number) {
  if (Number.isNaN(value)) {
    return 1;
  }
  return Math.max(0, Math.min(MAX_QTY, Math.floor(value)));
}

function mapProductToCartItem(product: Product): CartItem {
  const finalPrice = product.desconto
    ? product.preco * (1 - product.desconto / 100)
    : product.preco;
  return {
    idLivro: product.id,
    slug: product.slug,
    titulo: product.titulo,
    capa: product.capa,
    unitPrice: Number(finalPrice.toFixed(2)),
    precoOriginal: product.preco,
    desconto: product.desconto,
    categoria: product.categoria,
    qty: 1,
  };
}

function validatePersistedState(raw: unknown): CartState {
  if (!raw || typeof raw !== "object") {
    return initialState;
  }
  const payload = raw as Partial<CartState>;
  if (!Array.isArray(payload.items)) {
    return initialState;
  }
  const validItems = payload.items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const product = products.find((productItem) => productItem.id === (item as CartItem).idLivro);
      if (!product) {
        return null;
      }
      const mapped = mapProductToCartItem(product);
      const qty = clampQty((item as CartItem).qty ?? 1);
      return qty > 0 ? { ...mapped, qty } : null;
    })
    .filter(Boolean) as CartItem[];

  return {
    items: validItems,
    coupon: payload.coupon ?? null,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) {
      return;
    }
    initialised.current = true;
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = validatePersistedState(parsed);
        dispatch({ type: "HYDRATE", payload: validated });
      }
    } catch (error) {
      console.warn("Falha ao hidratar carrinho", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    const serialisableState: CartState = {
      items: state.items,
      coupon: state.coupon ?? null,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisableState));
  }, [state, isHydrated]);

  const subtotal = useMemo(
    () => state.items.reduce((total, item) => total + item.unitPrice * item.qty, 0),
    [state.items],
  );

  const totalItems = useMemo(
    () => state.items.reduce((total, item) => total + item.qty, 0),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      subtotal,
      totalItems,
      coupon: state.coupon ?? null,
      isHydrated,
      addItem: (slug: string, qty = 1) => {
        const product = products.find((productItem) => productItem.slug === slug);
        if (!product) {
          console.warn(`Produto com slug ${slug} não encontrado.`);
          return;
        }
        const mapped = mapProductToCartItem(product);
        dispatch({ type: "ADD_ITEM", payload: { item: mapped, qty } });
      },
      removeItem: (idLivro: string) => dispatch({ type: "REMOVE_ITEM", payload: { idLivro } }),
      setQty: (idLivro: string, qty: number) => dispatch({ type: "SET_QTY", payload: { idLivro, qty } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [state.items, state.coupon, subtotal, totalItems, isHydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
