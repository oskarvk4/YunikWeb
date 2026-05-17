import { Product } from "@/types";
import { getRelatedProducts } from "@/data/products";
import RelatedProducts from "./RelatedProducts";

interface RelatedProductsLoaderProps {
  product: Product;
}

export default async function RelatedProductsLoader({ product }: RelatedProductsLoaderProps) {
  const relatedProducts = await getRelatedProducts(product);

  if (relatedProducts.length === 0) {
    return null;
  }

  return <RelatedProducts products={relatedProducts} />;
}
