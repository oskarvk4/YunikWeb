import { Product, CategoryInfo } from "@/types";

export const categories: CategoryInfo[] = [
  {
    name: "Rings",
    slug: "rings",
    image: "/yunik-5.jpg",
    description: "Elegant rings for every occasion",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "/yunik-14.jpg",
    description: "Timeless necklaces and pendants",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "/yunik-2.jpg",
    description: "Stunning earrings to complete your look",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "/hero-bracelet.webp",
    description: "Beautiful bracelets and bangles",
  },
];

export const products: Product[] = [
  // Rings
  {
    id: "ring-001",
    slug: "aurora-signet-ring",
    name: "Aurora Signet Ring",
    price: 1299,
    currency: "DKK",
    category: "rings",
    description: "A modern take on the classic signet ring. The Aurora features a subtly domed surface that catches light beautifully, creating an ethereal glow on your finger.",
    materials: "18k gold-plated sterling silver. Nickel-free and hypoallergenic.",
    images: [
      "/yunik-5.jpg",
      "/yunik-6.jpg",
    ],
    featured: true,
    newArrival: false,
  },
  {
    id: "ring-002",
    slug: "celestine-band",
    name: "Celestine Band",
    price: 899,
    currency: "DKK",
    category: "rings",
    description: "A delicate stacking ring with a hammered texture that adds dimension and character. Perfect alone or layered with your favorite pieces.",
    materials: "Sterling silver with rhodium plating for lasting shine.",
    images: [
      "/yunik-6.jpg",
      "/yunik-7.jpg",
    ],
    featured: false,
    newArrival: true,
  },
  {
    id: "ring-003",
    slug: "solstice-dome-ring",
    name: "Solstice Dome Ring",
    price: 1599,
    currency: "DKK",
    category: "rings",
    description: "Bold yet refined, the Solstice features a sculptural dome design inspired by mid-century architecture. A statement piece for the modern woman.",
    materials: "14k gold vermeil over sterling silver.",
    images: [
      "/yunik-7.jpg",
      "/yunik-5.jpg",
    ],
    featured: true,
    newArrival: false,
  },

  // Necklaces
  {
    id: "necklace-001",
    slug: "luna-pendant",
    name: "Luna Pendant",
    price: 1499,
    currency: "DKK",
    category: "necklaces",
    description: "Inspired by the gentle glow of moonlight, the Luna pendant features a luminous mother-of-pearl center set in a delicate gold frame.",
    materials: "18k gold-plated sterling silver with genuine mother-of-pearl.",
    images: [
      "/yunik-14.jpg",
      "/yunik-15.jpg",
    ],
    featured: true,
    newArrival: false,
  },
  {
    id: "necklace-002",
    slug: "whisper-chain",
    name: "Whisper Chain",
    price: 799,
    currency: "DKK",
    category: "necklaces",
    description: "An ultra-fine chain that sits delicately on the collarbone. Simple, elegant, and endlessly versatile.",
    materials: "Sterling silver. Available in 40cm and 45cm lengths.",
    images: [
      "/yunik-15.jpg",
      "/yunik-16.jpg",
    ],
    featured: false,
    newArrival: true,
  },
  {
    id: "necklace-003",
    slug: "ophelia-layered-necklace",
    name: "Ophelia Layered Necklace",
    price: 1899,
    currency: "DKK",
    category: "necklaces",
    description: "Three delicate chains of varying lengths come together in one effortlessly elegant piece. The perfect shortcut to a curated layered look.",
    materials: "14k gold vermeil with adjustable clasp.",
    images: [
      "/yunik-16.jpg",
      "/yunik-14.jpg",
    ],
    featured: true,
    newArrival: true,
  },

  // Earrings
  {
    id: "earring-001",
    slug: "eden-hoops",
    name: "Eden Hoops",
    price: 1199,
    currency: "DKK",
    category: "earrings",
    description: "Classic hoops reimagined with a subtle organic twist. The Eden hoops feature a gently irregular shape that feels both modern and timeless.",
    materials: "18k gold-plated sterling silver with secure click-top closure.",
    images: [
      "/yunik-2.jpg",
      "/yunik-3.jpg",
    ],
    featured: true,
    newArrival: false,
  },
  {
    id: "earring-002",
    slug: "pearl-drop-studs",
    name: "Pearl Drop Studs",
    price: 999,
    currency: "DKK",
    category: "earrings",
    description: "Freshwater pearls suspended from minimal gold studs. A contemporary interpretation of a beloved classic.",
    materials: "14k gold posts with genuine freshwater pearls.",
    images: [
      "/yunik-3.jpg",
      "/yunik-4.jpg",
    ],
    featured: false,
    newArrival: true,
  },
  {
    id: "earring-003",
    slug: "cascade-earrings",
    name: "Cascade Earrings",
    price: 1499,
    currency: "DKK",
    category: "earrings",
    description: "Dramatic yet delicate, these linear drop earrings move gracefully with you, catching light from every angle.",
    materials: "Sterling silver with 18k gold plating.",
    images: [
      "/yunik-4.jpg",
      "/yunik-2.jpg",
    ],
    featured: true,
    newArrival: false,
  },

  // Bracelets
  {
    id: "bracelet-001",
    slug: "tanzanite-bracelet",
    name: "Tanzanite Stone Bracelet",
    price: 1399,
    currency: "DKK",
    category: "bracelets",
    description: "Raw tanzanite stones set in golden prongs create a stunning statement piece. Each stone is unique, making every bracelet one of a kind.",
    materials: "18k gold-plated brass with natural tanzanite stones.",
    images: [
      "/hero-bracelet.webp",
      "/yunik-8.jpg",
    ],
    featured: true,
    newArrival: false,
  },
  {
    id: "bracelet-002",
    slug: "nova-chain-bracelet",
    name: "Nova Chain Bracelet",
    price: 1099,
    currency: "DKK",
    category: "bracelets",
    description: "A refined chain bracelet with a unique link design that creates beautiful movement on the wrist.",
    materials: "18k gold-plated sterling silver with lobster clasp.",
    images: [
      "/yunik-8.jpg",
      "/yunik-9.jpg",
    ],
    featured: false,
    newArrival: true,
  },
  {
    id: "bracelet-003",
    slug: "bloom-bangle",
    name: "Bloom Bangle",
    price: 1699,
    currency: "DKK",
    category: "bracelets",
    description: "An elegant bangle featuring a delicate floral motif. The hinged design ensures a secure and comfortable fit.",
    materials: "14k gold vermeil over sterling silver.",
    images: [
      "/yunik-9.jpg",
      "/yunik-10.jpg",
    ],
    featured: true,
    newArrival: true,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter((product) => product.newArrival);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
};
