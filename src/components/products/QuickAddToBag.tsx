"use client";

import { useState } from "react";

type QuickAddToBagProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
};

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

const CART_KEY = "aura-cart-v1";

export default function QuickAddToBag({ product }: QuickAddToBagProps) {
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function addToBag() {
    if (outOfStock) return;

    try {
      const stored = localStorage.getItem(CART_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) {
        setMessage("Unable to read your bag. Please try again.");
        return;
      }

      const cart = parsed as CartItem[];
      const existing = cart.find((item) => item.productId === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          setMessage(`Only ${product.stock} available.`);
          return;
        }

        existing.quantity += 1;
        existing.stock = product.stock;
      } else {
        cart.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          stock: product.stock,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      setAdded(true);
      setMessage("Added to your bag.");
    } catch {
      setMessage("Unable to update your bag. Please try again.");
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={addToBag}
        disabled={outOfStock}
        className={`w-full inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-sm border px-4 py-2 text-xs font-semibold tracking-wider uppercase shadow-sm transition-all duration-300 sm:min-h-9 disabled:cursor-not-allowed disabled:opacity-50 ${
          added
            ? "border-emerald-600 bg-emerald-700 text-white shadow-emerald-900/20 scale-[1.02]"
            : "border-[#3A1A1B] bg-[#3A1A1B] text-[#FFF9F0] hover:border-[#D4B77E] hover:bg-[#200B0C] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {outOfStock ? (
          "Out of Stock"
        ) : added ? (
          <>
            <span className="text-sm">✓</span>
            <span>Added to Bag</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5 text-[#D4B77E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span>Add to Bag</span>
          </>
        )}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-1 text-xs text-[#806D60]"
        >
          {message}
        </p>
      )}
    </div>
  );
}
