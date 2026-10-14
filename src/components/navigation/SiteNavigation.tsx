"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

const CART_KEY = "aura-cart-v1";
const WISHLIST_KEY = "aura-wishlist-v1";

type CartItem = {
  quantity: number;
};

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "necklaces", label: "Necklaces" },
  { value: "earrings", label: "Earrings" },
  { value: "bangles", label: "Bangles & Bracelets" },
  { value: "rings", label: "Rings" },
  { value: "bridal-sets", label: "Bridal Sets" },
  { value: "pendants", label: "Pendants" },
  { value: "mangalsutra", label: "Mangalsutra" },
];

const navCategories = [
  { href: "/products?category=necklaces", label: "NECKLACES" },
  { href: "/products?category=earrings", label: "EARRINGS" },
  { href: "/products?category=bangles", label: "BANGLES & BRACELETS" },
  { href: "/products?category=rings", label: "RINGS" },
  { href: "/products?category=bridal-sets", label: "BRIDAL SETS" },
  { href: "/products?category=pendants", label: "PENDANTS" },
  { href: "/products?category=mangalsutra", label: "MANGALSUTRA" },
  { href: "/categories", label: "COLLECTIONS" },
  { href: "/products?featured=true", label: "NEW ARRIVALS" },
];

function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return 0;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((total: number, value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "quantity" in value &&
        typeof (value as CartItem).quantity === "number" &&
        Number.isFinite((value as CartItem).quantity) &&
        (value as CartItem).quantity > 0
      ) {
        return total + Math.floor((value as CartItem).quantity);
      }

      return total;
    }, 0);
  } catch {
    return 0;
  }
}

function readWishlistCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return 0;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function SiteNavigation({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const syncCounts = useCallback(() => {
    setCartCount(readCartCount());
    setWishlistCount(readWishlistCount());
  }, []);

  useEffect(() => {
    syncCounts();

    const handleCartUpdated = () => syncCounts();
    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [syncCounts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("search", query);
    }
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    const targetUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";

    setMobileMenuOpen(false);
    router.push(targetUrl);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. TOP ANNOUNCEMENT TICKER BAR */}
      <div className="relative overflow-hidden bg-[#2D1415] text-[#F5EBDD] border-b border-[#D4B77E]/20 text-[11px] sm:text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 sm:py-2.5">
          <div className="flex items-center gap-2 overflow-hidden text-center tracking-wide">
            {/* Delivery truck icon */}
            <svg
              className="h-4 w-4 shrink-0 text-[#E6A122] animate-float-gentle"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h1.162a3.75 3.75 0 0 1 7.176 0h2.324a3.75 3.75 0 0 1 7.176 0H21a1.5 1.5 0 0 0 1.5-1.5V9.75a1.5 1.5 0 0 0-.44-1.06l-2.69-2.69A1.5 1.5 0 0 0 18.31 5.5H15V6.375C15 5.339 14.16 4.5 13.125 4.5h-9.75ZM6 17.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm12 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
            </svg>

            <span className="truncate">
              Free shipping on orders above{" "}
              <span className="font-bold text-[#E6A122]">₹999</span> in India —{" "}
              <strong className="font-semibold text-white tracking-wider">
                WE SHIP WORLDWIDE
              </strong>
              <span className="hidden md:inline text-[#F5EBDD]/90">
                {" "}( USA • UK • UAE • Australia • Europe • And anywhere around the globe! )
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN MIDDLE HEADER BAR */}
      <div className="border-b border-[#3A1A1B]/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:gap-8 lg:px-10">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
            title="Aura of Shree Jewellery"
          >
            {/* Circular Logo Emblem */}
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4B77E] via-[#F5EBDD] to-[#967344] p-[1.5px] shadow-sm transition-transform duration-300 group-hover:scale-110">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#3A1A1B] text-[#D4B77E]">
                <span className="font-serif text-sm sm:text-base font-bold tracking-tight">
                  AS
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1 leading-tight">
                <span className="font-serif text-lg font-bold tracking-[0.08em] text-[#3A1A1B] sm:text-2xl">
                  AURA <span className="font-light">OF SHREE</span>
                </span>
                <span className="inline-block text-[11px] text-[#D4B77E] animate-sparkle-rotate">✨</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.38em] text-[#967344] uppercase">
                JEWELLERY STORE
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop / Tablet) */}
          <div className="hidden flex-1 max-w-2xl lg:block">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center rounded-full border border-[#3A1A1B]/20 bg-[#FAF7F2] p-1 shadow-xs transition-all duration-300 focus-within:border-[#3A1A1B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#D4B77E]/30 focus-within:shadow-md"
            >
              {/* Category Selector Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-transparent py-1.5 pl-4 pr-7 text-xs font-semibold text-[#3A1A1B] cursor-pointer focus:outline-none"
                  aria-label="Select product category"
                >
                  {categoryOptions.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="bg-white text-gray-800"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#3A1A1B]/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Vertical Divider */}
              <div className="h-5 w-[1px] bg-[#3A1A1B]/20 shrink-0" />

              {/* Input Field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for necklaces, rings, earrings, bangles..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#2B2020] placeholder-[#806D60]/70 focus:outline-none"
              />

              {/* Clear Query Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-1 rounded-full p-1 text-[#806D60] hover:text-[#3A1A1B]"
                  title="Clear input"
                  aria-label="Clear search input"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Circular Search Action Button */}
              <button
                type="submit"
                aria-label="Submit search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3A1A1B] text-[#FFF9F0] shadow-sm transition-transform duration-200 hover:bg-[#54292A] hover:scale-105 active:scale-95"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Action Icons (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Divider on desktop */}
            <div className="hidden h-7 w-[1px] bg-[#3A1A1B]/15 lg:block" />

            {/* ACCOUNT BUTTON & DROPDOWN */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex items-center gap-1.5 py-1 text-xs font-bold tracking-wider text-[#3A1A1B] transition hover:text-[#967344]"
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden sm:inline">ACCOUNT</span>
                <svg
                  className={`h-3 w-3 text-[#3A1A1B]/70 transition-transform duration-200 ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#3A1A1B]/15 bg-white p-2 shadow-xl z-50">
                  {isLoggedIn ? (
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/products?featured=true"
                        onClick={() => setAccountMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-[#3A1A1B] hover:bg-[#FAF7F2] transition"
                      >
                        💎 Featured Showcase
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setAccountMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-[#3A1A1B] hover:bg-[#FAF7F2] transition"
                      >
                        🛍️ My Shopping Bag ({cartCount})
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setAccountMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-[#3A1A1B] hover:bg-[#FAF7F2] transition"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                      <div className="my-1 border-t border-[#3A1A1B]/10" />
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          void signOut({ callbackUrl: "/" });
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 p-1">
                      <Link
                        href="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full rounded-lg bg-[#3A1A1B] px-3 py-2 text-center text-xs font-bold text-[#FFF9F0] hover:bg-[#54292A] transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full rounded-lg border border-[#3A1A1B]/20 px-3 py-2 text-center text-xs font-semibold text-[#3A1A1B] hover:bg-[#FAF7F2] transition"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WISHLIST BUTTON */}
            <Link
              href="/products?featured=true"
              className="flex items-center gap-1.5 py-1 text-xs font-bold tracking-wider text-[#3A1A1B] transition hover:text-[#967344]"
              title="View Wishlist"
            >
              <div className="relative">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E6A122] px-1 text-[9px] font-bold text-[#3A1A1B]">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">WISHLIST</span>
            </Link>

            {/* CART BUTTON WITH LIVE COUNT */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 py-1 text-xs font-bold tracking-wider text-[#3A1A1B] transition hover:text-[#967344]"
              title={`Shopping Bag (${cartCount} items)`}
            >
              <div className="relative">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 2.4-7.25H5.106m2.394 7.25L5.106 5.272M7.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E6A122] px-1 text-[9px] font-bold text-[#3A1A1B] shadow-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">CART</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#3A1A1B]/20 text-[#3A1A1B] lg:hidden hover:bg-[#FAF7F2]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (visible on screens < lg) */}
        <div className="border-t border-[#3A1A1B]/10 px-4 py-2 lg:hidden bg-[#FAF7F2]">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-full border border-[#3A1A1B]/20 bg-white p-1 shadow-xs"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent py-1 pl-3 pr-5 text-xs font-semibold text-[#3A1A1B] focus:outline-none"
              aria-label="Select category"
            >
              <option value="all">All</option>
              {categoryOptions.slice(1).map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="h-4 w-[1px] bg-[#3A1A1B]/20 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full bg-transparent px-2.5 py-1 text-xs text-[#2B2020] placeholder-[#806D60]/70 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3A1A1B] text-[#FFF9F0]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION / CATEGORY BAR */}
      <div className="border-b border-[#3A1A1B]/10 bg-[#FAF7F2]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6 lg:gap-6 lg:px-10">
          {/* Prominent SHOP pill button */}
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-2 rounded-md bg-[#3A1A1B] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFF9F0] shadow-xs transition-all duration-300 hover:bg-[#54292A] hover:scale-105 hover:shadow-md active:scale-95"
          >
            <svg
              className="h-3.5 w-3.5 text-[#D4B77E]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 4.5h6v6H3v-6Zm12 0h6v6h-6v-6ZM3 13.5h6v6H3v-6Zm12 0h6v6h-6v-6Z" />
            </svg>
            <span>SHOP</span>
          </Link>

          {/* Horizontal scrollable category links */}
          <nav
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            aria-label="Jewellery Categories"
          >
            {navCategories.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#3A1A1B]/85 transition-colors duration-200 hover:text-[#967344] relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#967344] hover:after:w-full after:transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. MOBILE SLIDE-OVER DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Off-canvas panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-[#FAF7F2] p-5 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3A1A1B]/15 pb-4">
              <span className="font-serif text-lg font-bold text-[#3A1A1B]">
                Aura of Shree
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1.5 text-[#3A1A1B] hover:bg-[#3A1A1B]/10"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Navigation */}
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#967344]">
                Categories
              </span>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#3A1A1B] hover:bg-white transition"
              >
                ✨ Shop All Jewellery
              </Link>
              {navCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-[#3A1A1B]/80 hover:bg-white hover:text-[#3A1A1B] transition"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Account & Bag Links */}
            <div className="mt-6 border-t border-[#3A1A1B]/15 pt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#967344]">
                My Account
              </span>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#3A1A1B]"
              >
                <span>Shopping Bag</span>
                <span className="rounded-full bg-[#E6A122] px-2 py-0.5 text-[10px] font-bold text-[#3A1A1B]">
                  {cartCount}
                </span>
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-[#3A1A1B] hover:bg-white transition"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-lg bg-[#3A1A1B] px-3 py-2 text-center text-xs font-bold text-[#FFF9F0]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-lg border border-[#3A1A1B]/20 bg-white px-3 py-2 text-center text-xs font-semibold text-[#3A1A1B]"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
