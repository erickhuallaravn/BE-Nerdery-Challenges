/**
 * Products - Challenge 1: Product Price Analysis
 *
 * Create a function that analyzes pricing information from an array of products.
 *
 * Requirements:
 * - Create a function called `analyzeProductPrices` that accepts an array of Product objects
 * - The function should return an object containing:
 *   - totalPrice: The sum of all product prices
 *   - averagePrice: The average price of all products (rounded to 2 decimal places)
 *   - mostExpensiveProduct: The complete Product object with the highest price
 *   - cheapestProduct: The complete Product object with the lowest price
 *   - onSaleCount: The number of products that are currently on sale
 *   - averageDiscount: The average discount percentage for products on sale (rounded to 2 decimal places)
 * - Prices should be manage in regular prices and not in sale prices
 * - Use proper TypeScript typing for parameters and return values
 * - Implement the function using efficient array methods
 *
 *
 **/

import { Brand, Product } from "./1-types";
import { readJsonFile } from "./utils/read-json.util";
import * as path from "path";

const productsPath = path.join(__dirname, "data", "products.json");
const brandsPath = path.join(__dirname, "data", "brands.json");

interface ProductAnalysisResult {
  totalPrice: number;
  averagePrice: number;
  mostExpensiveProduct: Product;
  cheapestProduct: Product;
  onSaleCount: number;
  averageDiscountPercentage: number;
}

async function analyzeProductPrices(
  products: Product[]
): Promise<ProductAnalysisResult> {
  if (products.length === 0) {
    throw new Error("No products to analyze");
  }

  const initial = {
    totalPrice: 0,
    mostExpensiveProduct: products[0],
    cheapestProduct: products[0],
    onSaleCount: 0,
    totalDiscountPercentage: 0,
  };

  const result = products.reduce((acc, product) => {
    acc.totalPrice += product.price;

    if (product.price > acc.mostExpensiveProduct.price) {
      acc.mostExpensiveProduct = product;
    }

    if (product.price < acc.cheapestProduct.price) {
      acc.cheapestProduct = product;
    }

    if (product.onSale && product.salePrice !== undefined) {
      acc.onSaleCount++;
      const discount =
        ((product.price - (product.salePrice ?? 0)) * 100) / product.price;
      acc.totalDiscountPercentage += discount;
    }

    return acc;
  }, initial);

  const averagePrice = parseFloat(
    (result.totalPrice / products.length).toFixed(2)
  );

  const averageDiscountPercentage = result.onSaleCount
    ? Number((result.totalDiscountPercentage / result.onSaleCount).toFixed(2))
    : 0;

  return {
    totalPrice: result.totalPrice,
    averagePrice,
    mostExpensiveProduct: result.mostExpensiveProduct,
    cheapestProduct: result.cheapestProduct,
    onSaleCount: result.onSaleCount,
    averageDiscountPercentage,
  };
}

const productsPromise: Promise<Product[]> = readJsonFile<Product>(productsPath);
productsPromise
  .then((products) => analyzeProductPrices(products))
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Error analizing the product prices:", error);
  });

/**
 *  Challenge 2: Build a Product Catalog with Brand Metadata
 *
 * Create a function that takes arrays of Product and Brand, and returns a new array of enriched product entries. Each entry should include brand details embedded into the product, under a new brandInfo property (excluding the id and isActive fields).
 *  e.g
 *  buildProductCatalog(products: Product[], brands: Brand[]): EnrichedProduct[]

  Requirements:
  - it should return an array of enriched product entries with brand details
  - Only include products where isActive is true and their corresponding brand is also active.
  - If a product’s brandId does not match any active brand, it should be excluded.
  - The brandInfo field should include the rest of the brand metadata (name, logo, description, etc.).
 */

type EnrichedProduct = Omit<Product, "brandId" | "isActive"> & {
  brandInfo: Omit<Brand, "isActive">;
};

async function buildProductCatalog(
  products: Product[],
  brands: Brand[]
): Promise<EnrichedProduct[]> {
  const activeBrandMap = new Map<number | string, Omit<Brand, "isActive">>();
  for (const { id, isActive, ...rest } of brands) {
    if (isActive) {
      activeBrandMap.set(id, {id, ...rest});
    }
  }

  const enrichedCatalog: EnrichedProduct[] = [];
  for (const { isActive, brandId, ...productData } of products) {
    if (!isActive) continue;
    const brandInfo = activeBrandMap.get(brandId);
    if (!brandInfo) continue;
    
    enrichedCatalog.push({
      ...productData,
      brandInfo,
    });
  }

  return enrichedCatalog;
}

const brandsPromise: Promise<Brand[]> = readJsonFile<Brand>(brandsPath);
Promise.all([productsPromise, brandsPromise])
  .then(([products, brands]) => buildProductCatalog(products, brands))
  .then((result) => console.log(result))
  .catch((error) => console.error("Error building product catalog:", error));

/**
 * Challenge 3: One image per product
 *
 * Create a function that takes an array of products and returns a new array of products, each with only one image.
 *
 * Requirements:
 * - The function should accept an array of Product objects.
 * - Each product should have only one image in the images array.
 * - The image should be the first one in the images array.
 * - If a product has no images, it should be excluded from the result.
 * - The function should return an array of Product objects with the modified images array.
 * - Use proper TypeScript typing for parameters and return values.
 */

async function getProductsWithSingleImage(
  products: Product[]
): Promise<Product[]> {
  return products
    .filter(
      (product) => Array.isArray(product.images) && product.images.length > 0
    )
    .map((product) => ({
      ...product,
      images: [product.images[0]], // Keep only the first image
    }));
}

productsPromise
  .then(getProductsWithSingleImage)
  .then((singleImageProducts) => {
    console.log(singleImageProducts);
  })
  .catch((error) => {
    console.error("Error filtering products with one image:", error);
  });
