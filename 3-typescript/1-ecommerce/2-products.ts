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

import { Brand, Product, ProductImage } from './1-types';
import { readJsonFile } from "./utils/read-json.util";
import * as path from "path";

const productsPath = path.join(__dirname, "data", "products.json");
const brandsPath = path.join(__dirname, "data", "brands.json");

async function analyzeProductPrices(products: Product[]): Promise<any> {
  if (products.length === 0) return;

  let totalPrice: number = 0;
  products.forEach((p) => {
    totalPrice += p.price;
  });
  const averagePrice: number = Number(
    (totalPrice / products.length).toFixed(2),
  );
  let mosExpensiveProduct: Product = products[0];
  let cheapestroduct: Product = products[0];
  products.forEach((p) => {
    mosExpensiveProduct =
      p.price > mosExpensiveProduct.price ? p : mosExpensiveProduct;
    cheapestroduct = p.price < cheapestroduct.price ? p : cheapestroduct;
  });
  const onSaleProducts: Product[] = products.filter((p) => p.onSale === true);
  const onSaleCount: number = onSaleProducts.length;
  let averageDiscount: number = 0;
  onSaleProducts
    .map((p) => ((p.price - (p.salePrice || 0)) * 100) / p.price)
    .forEach((p) => (averageDiscount += p));
  let averageDiscountPercentage: string = `${(averageDiscount / products.length).toFixed(2)}%`;
  return {
    totalPrice,
    averagePrice,
    mosExpensiveProduct,
    cheapestroduct,
    onSaleCount,
    averageDiscountPercentage,
  };
}

const productsPromise: Promise<Product[]> = readJsonFile<Product>(productsPath);
/*
productsPromise
  .then(result => {
    return analyzeProductPrices(result);
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
*/

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

type EnrichedProduct = Omit<Product, "isActive"> & {
  brandInfo: Omit<Brand, "id" | "isActive">;
};

async function buildProductCatalog(
  products: Product[],
  brands: Brand[],
): Promise<EnrichedProduct[]> {
  const activeBrands = brands.filter((b) => b.isActive);
  return products
    .filter((p) => p.isActive && activeBrands.some((b) => b.id === p.brandId))
    .map((p) => {
      const brand = activeBrands.find((b) => b.id === p.brandId);
      if (!brand) return null!;

      const { id, isActive, ...brandInfo } = brand;

      return {
        ...p,
        brandInfo,
      };
    });
}

const brandsPromise: Promise<Brand[]> = readJsonFile<Brand>(brandsPath);
/*
Promise.all([productsPromise, brandsPromise])
  .then(([products, brands]) => {
    return buildProductCatalog(products, brands);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
*/

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

/*IN CASE WE WANT THE SINGLE IMAGE ITEM INSTEAD OF AN ARRAY*/
// type SingleImageProduct = Omit<Product, "images"> & { images: ProductImage };
async function filterProductsWithOneImage(
  products: Product[]
): Promise<Readonly<Product[]>> {
  return products
    .filter((product) => product.images && product.images.length > 0)
    .map((product) => ({
      ...product,
      images: [product.images[0]],
    }));
}
productsPromise
  .then((products) => {
    return filterProductsWithOneImage(products);
  })
  .then((filteredProducts) => {
    console.log(filteredProducts);
  })
  .catch((error) => {
    console.error(error);
  });