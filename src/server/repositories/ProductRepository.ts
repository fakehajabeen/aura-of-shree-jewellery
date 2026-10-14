import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Category } from "@/server/models/Category";
import { Product, type ProductDocument } from "@/server/models/Product";

type ProductImageInput = {
  url: string;
  publicId: string;
};

type ProductCreateInput = Omit<
  Partial<ProductDocument>,
  "category" | "images"
> & {
  category: Types.ObjectId;
  images: ProductImageInput[];
};

type ProductUpdateInput = Omit<
  Partial<ProductDocument>,
  "category" | "images"
> & {
  category?: Types.ObjectId;
  images?: ProductImageInput[];
};

export class ProductRepository {
  async findById(id: string) {
    await connectDB();

    return Product.findById(id).lean<ProductDocument | null>();
  }
  

  async findByIds(ids: string[]) {
    await connectDB();

    return Product.find({
      _id: { $in: ids },
      isActive: true,
    }).lean<ProductDocument[]>();
  }


  async findBySlug(slug: string) {
    await connectDB();

    return Product.findOne({
      slug,
      isActive: true,
    }).lean<ProductDocument | null>();
  }

  async findMany(options?: {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    skip?: number;
  }) {
    await connectDB();

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (options?.category && options.category !== "all") {
      if (Types.ObjectId.isValid(options.category)) {
        filter.category = options.category;
      } else {
        const categoryDoc = await Category.findOne({
          slug: options.category.toLowerCase(),
        }).lean();
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // If category slug not found by exact slug, allow fuzzy regex match
          const categoryFuzzy = await Category.findOne({
            name: new RegExp(options.category, "i"),
          }).lean();
          if (categoryFuzzy) {
            filter.category = categoryFuzzy._id;
          }
        }
      }
    }

    if (options?.featured !== undefined) {
      filter.isFeatured = options.featured;
    }

    if (options?.search) {
      const sanitized = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(sanitized, "i");
      filter.$or = [
        { name: regex },
        { description: regex },
        { sku: regex },
      ];
    }

    return Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 20)
      .lean<ProductDocument[]>();
  }

  async create(data: ProductCreateInput) {
    await connectDB();

    const product = await Product.create(data);

    return product.toObject();
  }

  async updateById(id: string, data: ProductUpdateInput) {
    await connectDB();

    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<ProductDocument | null>();
  }

  async deleteById(id: string) {
    await connectDB();

    return Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    ).lean<ProductDocument | null>();
  }
}

export const productRepository = new ProductRepository();
