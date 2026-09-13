import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductCardCatalog } from "@/components/shop/ProductCardCatalog";
import { ProductDetailCommerce } from "@/components/shop/ProductDetailCommerce";
import { Shell } from "@/components/shop/Shell";
import {
  findProductBySlug,
  formatDecimal,
  getCategoryById,
  getRelatedProducts,
  productImage,
  saleUnitLabel,
} from "@/lib/catalog";
import { buildSeo, jsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product, category: getCategoryById(product.categoryId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product, category } = loaderData;
    return buildSeo({
      title: `${product.name} — купить в Минске и Борисове | Ромедов`,
      description: `${product.name}, ${product.gost}. Вес ${formatDecimal(product.weightKg)} кг/${saleUnitLabel(product.saleUnit)}${
        product.lengthM !== null ? `, длина ${formatDecimal(product.lengthM)} м` : ""
      }. ${product.stock === "in" ? "В наличии на складе" : "Поставка под заказ"}, резка в размер, доставка по Беларуси.`,
      path: `/product/${product.slug}`,
      keywords: `${product.name.toLowerCase()}, ${category.name.toLowerCase()}, ${product.steel.toLowerCase()}, цена, минск`,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category } = Route.useLoaderData();
  const related = getRelatedProducts(product, 4);

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.article ?? product.slug,
          category: category.name,
          material: product.steel,
          image: `${SITE_URL}${productImage(product)}`,
          description: `${product.name}, ${product.gost}.`,
          brand: { "@type": "Brand", name: "Ромедов" },
        })}
      />

      <ProductDetailCommerce product={product} category={category} />

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl border-t border-border px-5 py-12 lg:px-8">
          <h2 className="text-xl font-bold">Похожие позиции</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCardCatalog key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
