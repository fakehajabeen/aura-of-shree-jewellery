"use client";

import Image from "next/image";
import Link from "next/link";

export default function FestiveSaleBanner() {
  return (
    <section className="relative my-8 overflow-hidden bg-[#240A0D] lg:my-14 shadow-lg">
      <div className="relative mx-auto max-w-7xl">
        {/* Banner Container with 16:9 / Panoramic ratio */}
        <div className="relative flex min-h-[460px] w-full items-center justify-center sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px]">
          {/* Background Image with Models */}
          <Image
            src="/images/banners/festive-sale-banner.jpg"
            alt="Aura of Shree Festive Karwa Chauth Sale"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Luxury Ambient Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40 sm:bg-gradient-to-r sm:from-black/35 sm:via-black/20 sm:to-black/35" />

          {/* Central Promotional Offer Lockup (matching the reference design) */}
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 py-8 text-center text-white">
            {/* Top Headline Lockup */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8">
              {/* Left: Karwa Chauth SALE */}
              <div className="flex flex-col items-end text-right leading-none">
                <span className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-[#FFF9F0] drop-shadow-md">
                  Karwa
                </span>
                <span className="mt-1 font-serif text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white drop-shadow-md">
                  CHAUTH
                </span>
                <span className="mt-1 font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.25em] text-[#F5C253] drop-shadow-lg">
                  SALE
                </span>
              </div>

              {/* Vertical Elegant Gold Divider */}
              <div className="h-16 w-[2px] bg-gradient-to-b from-transparent via-[#F5C253] to-transparent sm:h-24 md:h-28 shrink-0" />

              {/* Right: BUY 1 GET 1 FREE */}
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="font-sans text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-md">
                  BUY 1
                </span>
                <span className="font-sans text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-md">
                  GET 1
                </span>
                <span className="font-sans text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-[#F5C253] drop-shadow-lg">
                  FREE
                </span>
              </div>
            </div>

            {/* Pill Bordered Badge: MANGALSUTRA STARTING AT ₹699/- */}
            <div className="mt-6 sm:mt-8 inline-flex items-center rounded-full border border-[#F5C253]/80 bg-black/50 px-5 py-2 sm:px-8 sm:py-2.5 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105">
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.22em] text-[#FFF9F0] uppercase">
                MANGALSUTRA STARTING AT{" "}
                <span className="font-bold text-[#F5C253] text-xs sm:text-sm md:text-base">
                  ₹699/-
                </span>
              </span>
            </div>

            {/* CTA Button */}
            <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products?category=mangalsutra"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4B77E] via-[#F5C253] to-[#D4B77E] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3A1A1B] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#F5C253]/30 active:scale-95"
              >
                <span>Shop Mangalsutra</span>
                <span className="text-base">→</span>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/40 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-xl transition-all duration-300 hover:bg-white hover:text-[#3A1A1B] hover:scale-105 active:scale-95"
              >
                <span>Explore All Offers</span>
              </Link>
            </div>
          </div>

          {/* Bottom Right Decorative Pagination Dots (from reference image) */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 opacity-80">
            <span className="h-1.5 w-4 rounded-full bg-[#F5C253]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
