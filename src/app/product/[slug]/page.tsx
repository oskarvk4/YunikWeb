import { notFound } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/ui/Container";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { products, getProductBySlug, getRelatedProducts } from "@/data/products";

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
      title: "Product Not Found | Yunik",
    };
  }

  return {
    title: `${product.name} | Yunik`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Yunik`,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="pt-20">
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
    </div>
  );
}
