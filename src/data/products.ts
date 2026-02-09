import { Product, CategoryInfo } from "@/types";

export const categories: CategoryInfo[] = [
  {
    name: "Ringe",
    slug: "rings",
    image: "/yunik-5.jpg",
    description: "Elegante ringe til enhver lejlighed",
  },
  {
    name: "Halskæder",
    slug: "necklaces",
    image: "/yunik-14.jpg",
    description: "Tidløse halskæder og vedhæng",
  },
  {
    name: "Øreringe",
    slug: "earrings",
    image: "/yunik-2.jpg",
    description: "Smukke øreringe der fuldender dit look",
  },
  {
    name: "Armbånd",
    slug: "bracelets",
    image: "/hero-bracelet.webp",
    description: "Smukke armbånd og armringe",
  },
];

export const products: Product[] = [
  // Ringe
  {
    id: "ring-001",
    slug: "aurora-signet-ring",
    name: "Aurora Signet Ring",
    price: 1299,
    currency: "DKK",
    category: "rings",
    description: "En moderne fortolkning af den klassiske signetring. Aurora har en subtilt hvælvet overflade, der fanger lyset smukt og skaber en æterisk glød på din finger.",
    materials: "18 karat guldbelagt sterlingsølv. Nikkelfri og hypoallergenisk.",
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
    name: "Celestine Bånd",
    price: 899,
    currency: "DKK",
    category: "rings",
    description: "En delikat stablering med hamret tekstur, der tilføjer dybde og karakter. Perfekt alene eller kombineret med dine favoritsmykker.",
    materials: "Sterlingsølv med rhodiumbelægning for langvarig glans.",
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
    description: "Markant men raffineret. Solstice har et skulpturelt kuppeldesign inspireret af midterhundredetallets arkitektur. Et statement-smykke til den moderne kvinde.",
    materials: "14 karat guld vermeil over sterlingsølv.",
    images: [
      "/yunik-7.jpg",
      "/yunik-5.jpg",
    ],
    featured: true,
    newArrival: false,
  },

  // Halskæder
  {
    id: "necklace-001",
    slug: "luna-pendant",
    name: "Luna Vedhæng",
    price: 1499,
    currency: "DKK",
    category: "necklaces",
    description: "Inspireret af månens blide skær. Luna-vedhænget har et lysende perlemorscenter indfattet i en delikat guldramme.",
    materials: "18 karat guldbelagt sterlingsølv med ægte perlemor.",
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
    name: "Whisper Kæde",
    price: 799,
    currency: "DKK",
    category: "necklaces",
    description: "En ultrafin kæde der ligger elegant på kravebenet. Simpel, elegant og uendeligt alsidig.",
    materials: "Sterlingsølv. Fås i 40 cm og 45 cm længder.",
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
    name: "Ophelia Lagdelt Halskæde",
    price: 1899,
    currency: "DKK",
    category: "necklaces",
    description: "Tre delikate kæder i forskellige længder samlet i ét ubesværet elegant smykke. Den perfekte genvej til et kurateret lagdelt look.",
    materials: "14 karat guld vermeil med justerbar lås.",
    images: [
      "/yunik-16.jpg",
      "/yunik-14.jpg",
    ],
    featured: true,
    newArrival: true,
  },

  // Øreringe
  {
    id: "earring-001",
    slug: "eden-hoops",
    name: "Eden Hoops",
    price: 1199,
    currency: "DKK",
    category: "earrings",
    description: "Klassiske hoops genfortolket med et subtilt organisk twist. Eden hoops har en blidt uregelmæssig form, der føles både moderne og tidløs.",
    materials: "18 karat guldbelagt sterlingsølv med sikker klik-top lukning.",
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
    name: "Perle Drop Ørestikker",
    price: 999,
    currency: "DKK",
    category: "earrings",
    description: "Ferskvandsperler hængende fra minimale guldørestikker. En moderne fortolkning af en elsket klassiker.",
    materials: "14 karat guld med ægte ferskvandsperler.",
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
    name: "Cascade Øreringe",
    price: 1499,
    currency: "DKK",
    category: "earrings",
    description: "Dramatiske men delikate. Disse lineære drop-øreringe bevæger sig yndefuldt med dig og fanger lyset fra alle vinkler.",
    materials: "Sterlingsølv med 18 karat guldbelægning.",
    images: [
      "/yunik-4.jpg",
      "/yunik-2.jpg",
    ],
    featured: true,
    newArrival: false,
  },

  // Armbånd
  {
    id: "bracelet-001",
    slug: "tanzanite-bracelet",
    name: "Tanzanit Sten Armbånd",
    price: 1399,
    currency: "DKK",
    category: "bracelets",
    description: "Rå tanzanitsten indfattet i gyldne griffer skaber et fantastisk statement-smykke. Hver sten er unik, hvilket gør hvert armbånd til et original.",
    materials: "18 karat guldbelagt messing med naturlige tanzanitsten.",
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
    name: "Nova Kæde Armbånd",
    price: 1099,
    currency: "DKK",
    category: "bracelets",
    description: "Et raffineret kædearmbånd med et unikt led-design, der skaber smuk bevægelse på håndleddet.",
    materials: "18 karat guldbelagt sterlingsølv med hummerlås.",
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
    name: "Bloom Armring",
    price: 1699,
    currency: "DKK",
    category: "bracelets",
    description: "En elegant armring med et delikat blomstermotiv. Det hængslede design sikrer en sikker og behagelig pasform.",
    materials: "14 karat guld vermeil over sterlingsølv.",
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
