import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import Container from "@/components/ui/Container";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import StickyAddToCart from "@/components/product/StickyAddToCart";
import { products, getProductBySlug, getRelatedProducts } from "@/data/products";

// Dynamic import for below-fold component
const RelatedProducts = dynamic(
  () => import("@/components/product/RelatedProducts")
);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produkt Ikke Fundet",
    };
  }

  const categoryNames: Record<string, string> = {
    rings: "Ringe",
    necklaces: "Halskæder",
    earrings: "Øreringe",
    bracelets: "Armbånd",
  };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Yunik`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
      locale: "da_DK",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    keywords: [
      product.name,
      categoryNames[product.category],
      "smykker",
      "Yunik",
      "håndlavet",
      product.category,
    ],
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  // Product JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => `https://yunik.dk${img}`),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Yunik",
    },
    offers: {
      "@type": "Offer",
      url: `https://yunik.dk/product/${product.slug}`,
      priceCurrency: "DKK",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Yunik",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "DK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
    material: product.materials,
    category: product.category,
  };

  // BreadcrumbList Schema
  const categoryNames: Record<string, string> = {
    rings: "Ringe",
    necklaces: "Halskæder",
    earrings: "Øreringe",
    bracelets: "Armbånd",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Forside",
        item: "https://yunik.dk",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://yunik.dk/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryNames[product.category],
        item: `https://yunik.dk/shop?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://yunik.dk/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="pt-20">
      {/* Product Schema */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Product Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <ImageGallery images={product.images} productName={product.name} />

            {/* Product Info */}
            <ProductInfo product={product} />
          </div>
        </Container>
      </section>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />

      {/* Sticky Add to Cart (Mobile) */}
      <StickyAddToCart product={product} />
    </div>
  );
}
