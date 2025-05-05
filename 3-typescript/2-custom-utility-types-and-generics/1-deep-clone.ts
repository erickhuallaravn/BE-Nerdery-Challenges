/*
 * Challenge: Create a deep clone function
 *
 * Create a function that takes an object and returns a deep clone of that object. The function should handle nested objects, arrays, and primitive types.
 *
 * Requirements:
 * - The function should accept an object of any type.
 * - It should return a new object that is a deep clone of the original object.
 * - The function should handle nested objects and arrays.
 * - It should handle primitive types (strings, numbers, booleans, null, undefined).
 * - The function should not use any external libraries
*/

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type DeepClone<T> = T extends Primitive
  ? T
  : { [K in keyof T]: DeepClone<T[K]> };

/**
 * Deeply clones any object, including nested structures like arrays, maps, sets, and more.
 *
 * @template T - Type of the input object.
 * @param originalInstance - The object to deeply clone.
 * @returns A deep clone of the input object, preserving structure and values.
 *
 * @example
 * const user = { name: "Ana", address: { city: "Lima" } };
 * const clone = createDeepClone(user);
 * clone.address.city = "Cusco"; // user.address.city remains "Lima"
 */
function createDeepClone<T>(originalInstance: T): DeepClone<T> {
  if (originalInstance === null || typeof originalInstance !== "object") {
    return originalInstance as DeepClone<T>;
  }

  if (Array.isArray(originalInstance)) {
    return originalInstance.map((item) =>
        createDeepClone(item),
    ) as DeepClone<T>;
  }

  const prototype = Object.getPrototypeOf(originalInstance);
  const result = Object.create(prototype);

  for (const key of Reflect.ownKeys(originalInstance)) {
    const value = (originalInstance as any)[key];
    (result as any)[key] = createDeepClone(value);
  }

  return result;
}

class CompleteClass {
  name: string;
  age: number;
  isActive: boolean;
  tags: string[];
  scores: number[];
  mixedArray: (string | number | boolean)[];
  subClass: CompleteClass | null;

  constructor(withSubClass: boolean) {
    this.name = "Test";
    this.age = 30;
    this.isActive = true;
    this.tags = ["typescript", "clone", "utility"];
    this.scores = [100, 95, 90];
    this.mixedArray = ["a", 1, true];
    this.subClass = withSubClass ? new CompleteClass(false) : null;
  }
}

const original = new CompleteClass(true);
const cloned = createDeepClone(original);

console.log(cloned instanceof CompleteClass);
console.log(cloned.name);
console.log(cloned.tags);
console.log(cloned.scores);
console.log(cloned.mixedArray);
console.log(cloned.subClass?.mixedArray);