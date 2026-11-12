// Fallback product catalog — PLACEHOLDER names and prices.
// Once Supabase is connected (see README), the live catalogue is read from
// the `products` table instead and this file is only used when the database
// isn't configured (e.g. local development).
//
// `stock`: null = not tracked (always available), a number = units left.
// `image`: a full https URL (e.g. from Supabase Storage) shows a photo;
// anything else falls back to a labelled placeholder swatch.

export const categories = [
  {
    slug: "rabbits",
    name: "Live Rabbits",
    tagline: "Weaners, growers & breeding stock",
  },
  {
    slug: "feed",
    name: "Rabbit Feed",
    tagline: "Grower, breeder & finisher formulations",
  },
  {
    slug: "cages",
    name: "Cages & Hutches",
    tagline: "Welded mesh, tiered & mobile units",
  },
  {
    slug: "manure",
    name: "Rabbit Manure",
    tagline: "Cold, low-odour organic fertiliser",
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Feeders, waterers & handling tools",
  },
];

export const products = [
  {
    slug: "nzw-weaner-8wk",
    name: "New Zealand White Weaner",
    category: "rabbits",
    price: 12000,
    unit: "per rabbit",
    bulkNote: "Starter batches of 10+ — chat with us on WhatsApp",
    image: "",
    description:
      "Healthy, fully weaned New Zealand White rabbits ready for a grow-out pen. The standard commercial meat breed — fast growth and a calm temperament.",
    specs: ["Weaned & eating pellets", "Dewormed", "Sexed on request"],
    stock: 24,
    rabbit: { breed: "New Zealand White", sex: "Mixed", age: "8 weeks", weight: "1.2–1.5kg", purpose: "Meat / grow-out" },
  },
  {
    slug: "californian-breeding-doe",
    name: "Californian Breeding Doe",
    category: "rabbits",
    price: 25000,
    unit: "per doe",
    bulkNote: null,
    image: "",
    description:
      "Mature Californian doe selected from productive lines, ready to join a breeding programme.",
    specs: ["Breeding age", "Selected from good litters", "Health-checked before dispatch"],
    stock: 8,
    rabbit: { breed: "Californian", sex: "Doe (female)", age: "5–6 months", weight: "3–3.5kg", purpose: "Breeding" },
  },
  {
    slug: "nzw-breeding-buck",
    name: "New Zealand White Breeding Buck",
    category: "rabbits",
    price: 28000,
    unit: "per buck",
    bulkNote: null,
    image: "",
    description:
      "Proven-quality New Zealand White buck for improving or starting a breeding herd.",
    specs: ["Breeding age", "Unrelated to our doe lines on request", "Health-checked before dispatch"],
    stock: 5,
    rabbit: { breed: "New Zealand White", sex: "Buck (male)", age: "6 months", weight: "3.5–4kg", purpose: "Breeding" },
  },
  {
    slug: "starter-trio",
    name: "Starter Breeding Trio",
    category: "rabbits",
    price: 72000,
    unit: "1 buck + 2 does",
    bulkNote: "Pair it with a 3-tier hutch for a complete starter setup",
    image: "",
    description:
      "Everything a new rabbitry needs to start breeding: one buck and two unrelated does of breeding age.",
    specs: ["Unrelated buck and does", "Breeding age", "Free care guide with every trio"],
    stock: 4,
    rabbit: { breed: "NZW / Californian", sex: "1 buck, 2 does", age: "5–6 months", weight: "3–4kg each", purpose: "Breeding" },
  },
  {
    slug: "grower-pellets-25kg",
    name: "Grower Pellet Feed",
    category: "feed",
    price: 18500,
    unit: "per 25kg bag",
    bulkNote: "Bulk price available from 10 bags",
    image: "/images/products/feed-grower.jpg",
    description:
      "Balanced pellet ration formulated for rabbits from weaning to 12 weeks. Supports steady weight gain and coat condition without overloading protein too early.",
    specs: ["16% crude protein", "Pelleted, low-dust", "25kg woven bag"],
  },
  {
    slug: "breeder-formula-25kg",
    name: "Breeder & Doe Formula",
    category: "feed",
    price: 20500,
    unit: "per 25kg bag",
    bulkNote: "Bulk price available from 10 bags",
    image: "/images/products/feed-breeder.jpg",
    description:
      "Higher-density formulation for pregnant and lactating does, with added calcium for milk production and litter growth.",
    specs: ["18% crude protein", "Added calcium & minerals", "25kg woven bag"],
  },
  {
    slug: "finisher-pellets-25kg",
    name: "Finisher Pellet Feed",
    category: "feed",
    price: 17800,
    unit: "per 25kg bag",
    bulkNote: "Bulk price available from 10 bags",
    image: "/images/products/feed-finisher.jpg",
    description:
      "Energy-forward finishing ration for rabbits headed to market weight, aimed at efficient last-stage weight gain.",
    specs: ["14% crude protein", "Higher energy density", "25kg woven bag"],
  },
  {
    slug: "hay-supplement-bale",
    name: "Dried Forage Bale",
    category: "feed",
    price: 6500,
    unit: "per bale",
    bulkNote: null,
    image: "/images/products/feed-hay.jpg",
    description:
      "Sun-dried grass and legume forage to supplement pellet feed, support digestion and give rabbits something to chew.",
    specs: ["Sun-dried", "Low-moisture, mould-checked"],
  },
  {
    slug: "tiered-hutch-3-level",
    name: "3-Tier Welded Mesh Hutch",
    category: "cages",
    price: 85000,
    unit: "per unit",
    bulkNote: "Discount for 5+ units, delivery arranged for large orders",
    image: "/images/products/cage-tiered.jpg",
    description:
      "Galvanised welded-mesh hutch with three tiers and slide-out waste trays. Suited to a small breeding row or backyard start-up.",
    specs: [
      "Galvanised mesh, rust-resistant",
      "3 tiers, removable trays",
      "Approx. 180cm (L) x 60cm (D) x 150cm (H)",
    ],
  },
  {
    slug: "single-doe-cage",
    name: "Single Doe Breeding Cage",
    category: "cages",
    price: 32000,
    unit: "per unit",
    bulkNote: "Bulk price available from 10 units",
    image: "/images/products/cage-single.jpg",
    description:
      "Standard single-level cage with a nest box compartment, built for one breeding doe and her litter.",
    specs: ["Attached nest box", "Welded mesh floor", "Slide-out waste tray"],
  },
  {
    slug: "grow-out-colony-pen",
    name: "Grow-Out Colony Pen",
    category: "cages",
    price: 68000,
    unit: "per unit",
    bulkNote: "Discount for 5+ units",
    image: "/images/products/cage-colony.jpg",
    description:
      "Larger floor-level pen for grouping weaned kits together during the grow-out stage, before they move to finishing.",
    specs: ["Holds 8–12 grow-outs", "Reinforced mesh floor", "Hinged access door"],
  },
  {
    slug: "mobile-tractor-pen",
    name: "Mobile Grass Tractor Pen",
    category: "cages",
    price: 95000,
    unit: "per unit",
    bulkNote: null,
    image: "/images/products/cage-mobile.jpg",
    description:
      "Wheeled, bottomless pen for rotational grazing on grass, useful for supplementary feeding and reducing feed cost.",
    specs: ["Wheeled frame", "Bottomless, direct grass access", "Weatherproof roof panel"],
  },
  {
    slug: "manure-bag-25kg",
    name: "Composted Rabbit Manure",
    category: "manure",
    price: 4500,
    unit: "per 25kg bag",
    bulkNote: "Bulk price available from 20 bags — ask for farm-gate rate",
    image: "/images/products/manure-bag.jpg",
    description:
      "Cold manure that can go straight onto beds without the burn risk of hotter manures, popular with vegetable and nursery growers.",
    specs: ["Low odour", "Cold manure, safe application", "25kg woven bag"],
  },
  {
    slug: "manure-tonne-bulk",
    name: "Bulk Manure (Tonne Order)",
    category: "manure",
    price: 140000,
    unit: "per tonne",
    bulkNote: "For farms and nurseries — delivery quoted by location",
    image: "/images/products/manure-bulk.jpg",
    description:
      "Bulk tonnage orders for commercial farms, nurseries and landscaping contractors. Delivery arranged on request.",
    specs: ["Loose or bagged on request", "Delivery quoted separately"],
  },
  {
    slug: "gravity-feeder",
    name: "Gravity Hopper Feeder",
    category: "accessories",
    price: 5200,
    unit: "per unit",
    bulkNote: "Bulk price available from 10 units",
    image: "/images/products/acc-feeder.jpg",
    description:
      "Hang-on hopper feeder that reduces feed wastage and topping-up frequency compared to open bowls.",
    specs: ["Rust-resistant", "Approx. 2kg capacity"],
  },
  {
    slug: "nipple-waterer-set",
    name: "Nipple Waterer (Set of 5)",
    category: "accessories",
    price: 6800,
    unit: "per set of 5",
    bulkNote: null,
    image: "/images/products/acc-waterer.jpg",
    description:
      "Screw-fit nipple drinkers that connect to a header tank line, keeping water cleaner than open dishes.",
    specs: ["Fits standard PVC line", "Set of 5 nipples"],
  },
  {
    slug: "handling-carrier",
    name: "Rabbit Handling Carrier",
    category: "accessories",
    price: 9500,
    unit: "per unit",
    bulkNote: null,
    image: "/images/products/acc-carrier.jpg",
    description:
      "Ventilated carrier for moving rabbits between cages, to market or to the vet without stress injuries.",
    specs: ["Ventilated sides", "Secure latch lid"],
  },
];

export function getProductsByCategory(categorySlug) {
  return products.filter((p) => p.category === categorySlug);
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export { formatNaira } from "@/lib/format";
