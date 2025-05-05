/**
 * Challenge 1: Type Definitions for Product Catalog
 *
 * You need to define proper TypeScript types for the product catalog data.
 * These types should accurately represent the structure of the JSON data and establish
 * the relationships between different entities (e.g., products and brands).
 *
 * The JSON data is provided in the `data` folder.
 *
 * Consider:
 * - Handle all of the properties in the JSON data as accurately as possible in typescript types
 * - Use appropriate types for each property (e.g., string, number, boolean, etc.)
 * - Optional properties and mandatory properties
 * - The use of union types for properties that can have multiple types
 * - The use of enums for properties that can have a limited set of values
 * - The use of interfaces and type aliases to create a clear and maintainable structure
 */

// PRODUCTS JSON
type Size = number | string;
type ExtraSpecs =
  | "ankleSupport"
  | "shaftHeight"
  | "heelDrop"
  | "heelHeight"
  | "lining"
  | "flexibility"
  | "waterproofing"
  | "archSupport";
type ExtraProductSpecification = Partial<Record<ExtraSpecs, string>>;
export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isMain: boolean;
};
interface BaseSpecifications {
  material: string;
  weight: string;
  cushioning: string;
  closure: string;
};

type ProductSpecifications = BaseSpecifications & ExtraProductSpecification;
type RemoveNullProperties<T> = {
  [K in keyof T as T[K] extends null ? never : K]: T[K];
};
interface BaseProduct {
  id: number;
  name: string;
  departmentId: number;
  categoryId: number;
  brandId: number;
  linkId: string;
  refId: string;
  isVisible: boolean;
  description: string;
  descriptionShort: string;
  releaseDate: string;
  keywords: string;
  title: string;
  isActive: boolean;
  taxCode: string;
  metaTagDescription: string;
  supplierId: number;
  showWithoutStock: boolean;
  score: number;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  colors: string[];
  sizes: Size[];
  tags: string[];
  images: ProductImage[];
  specifications: ProductSpecifications;
  adWordsRemarketingCode?: string | null;
  lomadeeCampaignCode?: string | null;
};
export type Product = RemoveNullProperties<BaseProduct>;

// CATEGORIES JSON
interface CategoryFilter {
  name: string;
  values: string[];
};
export interface Category {
  id: number;
  name: string;
  departmentId: number;
  description: string;
  keywords: string;
  isActive: boolean;
  iconUrl: string;
  bannerUrl: string;
  displayOrder: number;
  metaDescription: string;
  filters: CategoryFilter[];
};

// BRANDS JSON
enum SocialMediaPlatform {
    instagram = "instagram",
    twitter = "twitter",
    facebook = "facebook"
};
type SocialMedia = Record<SocialMediaPlatform, string>;
export interface Brand {
  id: number | string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  website: string;
  isActive: boolean;
  headquarters: string;
  signature: string;
  socialMedia: SocialMedia;
};

// DEPARTMENTS JSON
export interface Department {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  iconUrl: string;
  bannerUrl: string;
  metaDescription: string;
  featuredCategories: number[];
  slug: string;
};