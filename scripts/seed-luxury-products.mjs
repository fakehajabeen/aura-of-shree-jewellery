import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const BRAIN_DIR = "C:\\Users\\fakeh\\.gemini\\antigravity-ide\\brain\\4e519a4e-5b28-46af-b805-9ddadc0d1aa0";
const TARGET_DIR = path.join(process.cwd(), "public", "images", "products");

const imageMappings = [
  {
    sourceFile: "royal_gold_necklace_1791980992854.jpg",
    destFile: "royal-gold-necklace.jpg",
  },
  {
    sourceFile: "diamond_chandbali_earrings_1791981019839.jpg",
    destFile: "diamond-chandbali-earrings.jpg",
  },
  {
    sourceFile: "antique_gold_bangles_1791981045939.jpg",
    destFile: "antique-gold-bangles.jpg",
  },
  {
    sourceFile: "solitaire_emerald_ring_1791981082792.jpg",
    destFile: "solitaire-emerald-ring.jpg",
  },
  {
    sourceFile: "heritage_bridal_set_1791981117088.jpg",
    destFile: "heritage-bridal-set.jpg",
  },
  {
    sourceFile: "ruby_peacock_pendant_1791981146443.jpg",
    destFile: "ruby-peacock-pendant.jpg",
  },
  {
    sourceFile: "diamond_mangalsutra_1791981201448.jpg",
    destFile: "diamond-mangalsutra.jpg",
  },
  {
    sourceFile: "diamond_tennis_bracelet_1791982796066.jpg",
    destFile: "diamond-tennis-bracelet.jpg",
  },
];

async function seed() {
  console.log("Preparing target directory:", TARGET_DIR);
  fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const mapping of imageMappings) {
    const srcPath = path.join(BRAIN_DIR, mapping.sourceFile);
    const destPath = path.join(TARGET_DIR, mapping.destFile);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${mapping.sourceFile} -> /images/products/${mapping.destFile}`);
    } else {
      console.warn(`Source not found: ${srcPath}`);
    }
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aura_of_shree_jewellery";
  console.log(`Connecting to MongoDB (${mongoUri})...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.warn("Could not connect to MongoDB right now:", err.message);
    console.warn("Images have been copied to public/images/products successfully.");
    console.warn("When your MongoDB server is up, re-run this script to seed products into the database.");
    process.exit(0);
  }

  // Define Category Model
  const categorySchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String },
      imageUrl: { type: String },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

  // Define Product Model
  const productSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      price: { type: Number, required: true },
      compareAtPrice: { type: Number },
      stock: { type: Number, required: true, default: 0 },
      sku: { type: String, required: true, unique: true },
      images: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      isActive: { type: Boolean, default: true },
      isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

  const categoriesData = [
    {
      name: "Necklaces",
      slug: "necklaces",
      description: "Opulent handcrafted royal necklaces, chokers, and polki statement pieces.",
      imageUrl: "/images/products/royal-gold-necklace.jpg",
      isActive: true,
    },
    {
      name: "Earrings",
      slug: "earrings",
      description: "Timeless chandbalis, jhumkas, and dazzling diamond drops.",
      imageUrl: "/images/products/diamond-chandbali-earrings.jpg",
      isActive: true,
    },
    {
      name: "Bangles & Bracelets",
      slug: "bangles",
      description: "Intricately carved 22K gold kada bangles and diamond bracelets.",
      imageUrl: "/images/products/antique-gold-bangles.jpg",
      isActive: true,
    },
    {
      name: "Rings",
      slug: "rings",
      description: "Handcrafted cocktail rings, solitaire halos, and emerald masterpieces.",
      imageUrl: "/images/products/solitaire-emerald-ring.jpg",
      isActive: true,
    },
    {
      name: "Bridal Sets",
      slug: "bridal-sets",
      description: "Magnificent bridal jewelry ensembles for your wedding celebrations.",
      imageUrl: "/images/products/heritage-bridal-set.jpg",
      isActive: true,
    },
    {
      name: "Pendants",
      slug: "pendants",
      description: "Signature gold and gemstone pendants sculpted with heritage motifs.",
      imageUrl: "/images/products/ruby-peacock-pendant.jpg",
      isActive: true,
    },
    {
      name: "Mangalsutra",
      slug: "mangalsutra",
      description: "Sacred bonds designed with modern diamond elegance and gold artistry.",
      imageUrl: "/images/products/diamond-mangalsutra.jpg",
      isActive: true,
    },
  ];

  const categoryMap = new Map();

  for (const cat of categoriesData) {
    const saved = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryMap.set(cat.slug, saved._id);
    console.log(`Saved Category: ${cat.name}`);
  }

  const productsData = [
    {
      name: "Royal Kundan & Emerald Choker Necklace",
      slug: "royal-kundan-emerald-choker-necklace",
      description:
        "Handcrafted in 22K yellow gold with uncut polki diamonds, rich Zambian emerald cabochons, and hand-strung south sea pearl droplets. A timeless centerpiece for gala evenings and royal weddings.",
      categorySlug: "necklaces",
      price: 48999,
      compareAtPrice: 58999,
      stock: 5,
      sku: "AURA-NCK-001",
      image: "/images/products/royal-gold-necklace.jpg",
      isFeatured: true,
    },
    {
      name: "Polki Diamond & Pearl Chandbali Earrings",
      slug: "polki-diamond-pearl-chandbali-earrings",
      description:
        "Grand royal chandbali earrings set with luminous polki diamonds and a cascade of lustrous white freshwater pearls. Designed to accentuate traditional attire with majestic grace.",
      categorySlug: "earrings",
      price: 18499,
      compareAtPrice: 22999,
      stock: 8,
      sku: "AURA-EAR-002",
      image: "/images/products/diamond-chandbali-earrings.jpg",
      isFeatured: true,
    },
    {
      name: "Antique Peacock Carved 22K Gold Kada Bangles",
      slug: "antique-peacock-22k-gold-kada-bangles",
      description:
        "A magnificent pair of 22K antique gold kada bangles featuring meticulous three-dimensional peacock filigree engravings, screw clasp lock, and heirloom craftsmanship.",
      categorySlug: "bangles",
      price: 36999,
      compareAtPrice: 44500,
      stock: 6,
      sku: "AURA-BNG-003",
      image: "/images/products/antique-gold-bangles.jpg",
      isFeatured: true,
    },
    {
      name: "Royal Emerald Solitaire Diamond Halo Ring",
      slug: "royal-emerald-solitaire-diamond-halo-ring",
      description:
        "A captivating 3.5 carat cushion-cut natural emerald bordered by a scintillating double halo of round brilliant-cut diamonds, mounted on a vintage filigree 18K gold shank.",
      categorySlug: "rings",
      price: 24999,
      compareAtPrice: 31000,
      stock: 12,
      sku: "AURA-RNG-004",
      image: "/images/products/solitaire-emerald-ring.jpg",
      isFeatured: true,
    },
    {
      name: "Heritage Rajputana Royal Bridal Jewellery Set",
      slug: "heritage-rajputana-royal-bridal-set",
      description:
        "The epitome of regal bridal splendor. This full ensemble includes a masterfully layered choker, matching statement chandbali earrings, and a delicate maang tikka encrusted with Burmese rubies, uncut polki, and pearls.",
      categorySlug: "bridal-sets",
      price: 125000,
      compareAtPrice: 149000,
      stock: 3,
      sku: "AURA-BRD-005",
      image: "/images/products/heritage-bridal-set.jpg",
      isFeatured: true,
    },
    {
      name: "Burmese Ruby Peacock Pendant with Baroque Pearl",
      slug: "burmese-ruby-peacock-pendant",
      description:
        "Sculpted in 18K yellow gold, this majestic peacock pendant is adorned with pavé natural rubies, micro diamonds, and a rare teardrop baroque pearl on a woven gold rope chain.",
      categorySlug: "pendants",
      price: 19999,
      compareAtPrice: 25000,
      stock: 7,
      sku: "AURA-PND-006",
      image: "/images/products/ruby-peacock-pendant.jpg",
      isFeatured: true,
    },
    {
      name: "Contemporary Diamond Floral Mangalsutra",
      slug: "contemporary-diamond-floral-mangalsutra",
      description:
        "Celebrating sacred matrimony with refined contemporary style. Featuring double strand auspicious black beads and a floral centerpiece centered around a brilliant solitaire diamond.",
      categorySlug: "mangalsutra",
      price: 29499,
      compareAtPrice: 35999,
      stock: 9,
      sku: "AURA-MNG-007",
      image: "/images/products/diamond-mangalsutra.jpg",
      isFeatured: true,
    },
    {
      name: "Imperial 18K Gold Solitaire Diamond Tennis Bracelet",
      slug: "imperial-18k-gold-diamond-tennis-bracelet",
      description:
        "Crafted in polished 18K yellow gold, this iconic tennis bracelet boasts 5.0 carats of VS clarity round brilliant diamonds individually handset in classic four-prong settings. Featuring a secure double-safety clasp, it exudes effortless glamour for both daytime chic and evening soirées.",
      categorySlug: "bangles",
      price: 54999,
      compareAtPrice: 65000,
      stock: 6,
      sku: "AURA-BRC-008",
      image: "/images/products/diamond-tennis-bracelet.jpg",
      isFeatured: true,
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug);

    const product = await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: categoryId,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          stock: item.stock,
          sku: item.sku,
          images: [
            {
              url: item.image,
              publicId: item.slug,
            },
          ],
          isActive: true,
          isFeatured: item.isFeatured,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(`Saved Product: ${product.name} (₹${product.price})`);
  }

  console.log("\n✅ All luxury products and categories seeded successfully into MongoDB!");
  await mongoose.disconnect();
}

seed();
