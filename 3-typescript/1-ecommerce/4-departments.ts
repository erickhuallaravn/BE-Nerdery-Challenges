/**
 *  Challenge 5: Get Departments with Product Count
 *
 * Create a function that takes an array of departments and products, and returns a new array of departments with the amount of products available in each department.
 *
 * Requirements:
 * - The function should accept an array of Department objects and an array of Product objects.
 * - Each department should include the quantity of products available in that department.
 * - The department should be idetified just by its name and id other properties should be excluded.
 * - In the information of the department, include the amount of products available in that department and just the name and id of the department.
 * - Add the name of the products in an array called productsNames inside the department object.
 */
import { Product, Department } from "./1-types";
import { readJsonFile } from "./utils/read-json.util";
import * as path from "path";
const productsPath = path.join(__dirname, "data", "products.json");
const departmentsPath = path.join(__dirname, "data", "departments.json");

type ProductsPerDepartment = Record<string, number>;
type DepartmentProductsInformation = {
  departmentId: number;
  department: string;
  productsAvailable: number;
  productsNames: string[];
};
async function getDepartmentsWithProductCount(
  departments: Department[],
  products: Product[],
): Promise<DepartmentProductsInformation[]> {
  const result: DepartmentProductsInformation[] = [];

  for (const department of departments) {
    const departmentId = department.id;
    const departmentName = department.name;

    const productsInDepartment = products.filter(
      (p) => p.departmentId === departmentId,
    );

    if (productsInDepartment.length > 0) {
      result.push({
        departmentId,
        department: departmentName,
        productsAvailable: productsInDepartment.length,
        productsNames: productsInDepartment.map((p) => p.name),
      });
    }
  }

  return result;
}

const productsPromise: Promise<Product[]> = readJsonFile<Product>(productsPath);
const brandsPromise: Promise<Department[]> =
  readJsonFile<Department>(departmentsPath);

Promise.all([brandsPromise, productsPromise])
  .then(([brands, products]) => {
    return getDepartmentsWithProductCount(brands, products);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
