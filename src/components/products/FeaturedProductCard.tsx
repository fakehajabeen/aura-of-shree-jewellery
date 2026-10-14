"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QuickAddToBag from "@/components/products/QuickAddToBag";

type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function FeaturedProductCard({
  product,
}: {
  product: FeaturedProduct;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const images = product.images.filter(
    (image) => typeof image === "string" && image.trim().length > 0,
  );

  function moveImage(direction: number) {
    if (images.length < 2) return;

    setActiveImage(
      (current) => (current + direction + images.length) % images.length,
    );
  }

  function handleTouchEnd(touchEnd: number) {
    if (touchStart === null) return;

    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 40) {
      moveImage(distance > 0 ? 1 : -1);
    }

    setTouchStart(null);
  }

  return (
    <article className="group min-w-0 transition-all duration-500 ease-out hover:-translate-y-1.5">
      <div
        className="luxury-sheen-container relative aspect-[4/5] overflow-hidden rounded-sm bg-[#F5EBDD] shadow-xs transition-shadow duration-500 group-hover:shadow-xl"
        onTouchStart={(event) =>
          setTouchStart(event.changedTouches[0]?.clientX ?? null)
        }
        onTouchEnd={(event) =>
          handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
        }
      >
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-0"
          tabIndex={-1}
        >
          {images[activeImage] ? (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#806D60]">
              Image coming soon
            </div>
          )}
        </Link>

        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-xs border border-[#D4B77E]/30 bg-[#FFF9F0]/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3A1A1B] shadow-xs backdrop-blur-xs">
          Aura Selection
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label={`Previous image of ${product.name}`}
              onClick={() => moveImage(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFF9F0]/95 text-lg text-[#3A1A1B] shadow-sm transition hover:bg-[#3A1A1B] hover:text-[#FFF9F0]"
            >
              ‹
            </button>

            <button
              type="button"
              aria-label={`Next image of ${product.name}`}
              onClick={() => moveImage(1)}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFF9F0]/95 text-lg text-[#3A1A1B] shadow-sm transition hover:bg-[#3A1A1B] hover:text-[#FFF9F0]"
            >
              ›
            </button>

            <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
              {images.map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeImage
                      ? "w-5 bg-[#3A1A1B]"
                      : "w-1.5 bg-[#FFF9F0]/90"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-x-3 bottom-3 z-20 hidden translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <QuickAddToBag
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: images[0] ?? "",
              stock: product.stock,
            }}
          />
        </div>
      </div>

      <div className="pt-4">
        <h3 className="font-serif text-base leading-snug text-[#3A1A1B] sm:text-xl">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors duration-200 hover:text-[#967344]"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm font-semibold text-[#3A1A1B]">
          {formatPrice(product.price)}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em]">
          {product.stock > 0 ? (
            <>
              <span className="animate-pulse-live inline-block h-2 w-2 rounded-full bg-emerald-600" />
              <span className="font-medium text-emerald-800">In stock ({product.stock})</span>
            </>
          ) : (
            <span className="font-medium text-red-800">Out of stock</span>
          )}
        </div>

        <div className="mt-3 lg:hidden">
          <QuickAddToBag
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: images[0] ?? "",
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </article>
  );
}
