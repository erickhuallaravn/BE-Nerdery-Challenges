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

type DepartmentProductSummary = {
  departmentId: number;
  department: string;
  productsAvailable: number;
  productsNames: string[];
};

async function summarizeProductsByDepartment(
  departments: Department[],
  products: Product[]
): Promise<DepartmentProductSummary[]> {
  const productsByDepartment = new Map<number, string[]>();

  for (const { departmentId, name } of products) {
    if (!productsByDepartment.has(departmentId)) {
      productsByDepartment.set(departmentId, []);
    }
    productsByDepartment.get(departmentId)!.push(name);
  }

  const summaries: DepartmentProductSummary[] = [];

  for (const { id: departmentId, name: department } of departments) {
    const names = productsByDepartment.get(departmentId);
    if (!names) continue;

    summaries.push({
      departmentId,
      department,
      productsAvailable: names.length,
      productsNames: names,
    });
  }

  return summaries;
}

const productsPromise: Promise<Product[]> = readJsonFile<Product>(productsPath);
const departmentsPromise: Promise<Department[]> =
  readJsonFile<Department>(departmentsPath);

Promise.all([departmentsPromise, productsPromise])
  .then(([departments, products]) =>
    summarizeProductsByDepartment(departments, products)
  )
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Error summarizing departments:", error);
  });
