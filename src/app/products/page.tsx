import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import SiteNavigation from "@/components/navigation/SiteNavigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export const dynamic = "force-dynamic";

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    featured?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const resolvedParams = props.searchParams ? await props.searchParams : {};
  const { category, search, featured } = resolvedParams;

  const products = await productUseCases.getProducts({
    category,
    search,
    featured: featured === "true" ? true : undefined,
    limit: 50,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const pageTitle = search
    ? `Search: "${search}"`
    : category
      ? `${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}`
      : featured === "true"
        ? "New Arrivals"
        : "All Jewellery";

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      <SiteNavigation isLoggedIn={Boolean(session?.user)} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#967344]">
          {search ? "Search Results" : "Discover your favorites"}
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl capitalize text-[#3A1A1B] sm:text-5xl">
              {pageTitle}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806D60]">
              {search
                ? `Showing jewellery pieces matching "${search}".`
                : "Explore timeless designs and find the pieces that feel uniquely yours."}
            </p>
          </div>

          <p className="text-sm font-medium text-[#806D60]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        {products.length === 0 ? (
          <div className="bg-[#FFF9F0] px-6 py-20 text-center">
            <h2 className="font-serif text-3xl text-[#3A1A1B]">
              Your collection is on its way
            </h2>

            <p className="mt-4 text-sm text-[#806D60]">
              No products are available right now. Please check back soon.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => {
              const imageUrl = product.images?.[0]?.url;

              return (
                <article key={String(product._id)} className="group">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-[220px] overflow-hidden bg-[#FFF9F0] sm:h-[300px] lg:h-[340px]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#806D60]">
                          Image coming soon
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="pt-4">
                    <h2 className="font-serif text-lg text-[#3A1A1B] sm:text-xl">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-[#3A1A1B]">
                      {formatPrice(product.price)}
                    </p>

                    {product.stock > 0 ? (
                      <p className="mt-2 text-xs text-[#806D60]">In stock</p>
                    ) : (
                      <p className="mt-2 text-xs text-red-800">Out of stock</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
