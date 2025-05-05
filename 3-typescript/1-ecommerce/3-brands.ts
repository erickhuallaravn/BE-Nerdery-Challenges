/**
 *  Challenge 4: Get Countries with Brands and Amount of Products
 *
 * Create a function that takes an array of brands and products, and returns the countries with the amount of products available in each country.
 *
 * Requirements:
 * - The function should accept an array of Brand objects and an array of Product objects.
 * - Each brand should have a country property.
 * - Each product should have a brandId property that corresponds to the id of a brand.
 * - The function should return an array of objects, each containing a country and the amount of products available in that country.
 * - The amount of products should be calculated by counting the number of products that have a brandId matching the id of a brand in the same country.
 * - The return should be a type that allow us to define the country name as a key and the amount of products as a value.
 */
import { Brand, Product } from "./1-types";
import { readJsonFile } from "./utils/read-json.util";
import * as path from "path";

const productsPath = path.join(__dirname, "data", "products.json");
const brandsPath = path.join(__dirname, "data", "brands.json");

type CountryProductCount = {
  country: string;
  productsAvailable: number;
};
type ProductsPerCountry = Record<string, number>;

async function countProductsByCountry(
  brands: Brand[],
  products: Product[]
): Promise<CountryProductCount[]> {
  const productCountByBrand: Record<number, number> = {};
  for (const product of products) {
    const brandId = Number(product.brandId);
    productCountByBrand[brandId] = (productCountByBrand[brandId] || 0) + 1;
  }

  const productCountByCountry: ProductsPerCountry = {};
  for (const brand of brands) {
    const brandId = Number(brand.id);
    const brandProductCount = productCountByBrand[brandId];
    if (!brandProductCount) continue;

    const country = brand.headquarters?.split(", ")[1];
    if (!country) continue;

    productCountByCountry[country] =
      (productCountByCountry[country] || 0) + brandProductCount;
  }
  
  return Object.entries(productCountByCountry).map(
    ([country, productsAvailable]) => ({
      country,
      productsAvailable,
    })
  );
}

const productsPromise: Promise<Product[]> = readJsonFile<Product>(productsPath);
const brandsPromise: Promise<Brand[]> = readJsonFile<Brand>(brandsPath);

Promise.all([brandsPromise, productsPromise])
  .then(([brands, products]) => countProductsByCountry(brands, products))
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Error counting products by country:", error);
  });
