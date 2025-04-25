/**
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

//? implement the function  here

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type DeepClone<T> = T extends Primitive
  ? T
  : T extends Function
    ? T
    : { [K in keyof T]: DeepClone<T[K]> };

function createDeepClone<T>(originalInstance: T): DeepClone<T> {
  if (originalInstance === null || typeof originalInstance !== "object") {
    return originalInstance as DeepClone<T>;
  }

  if (Array.isArray(originalInstance)) {
    return originalInstance.map((item) =>
        createDeepClone(item),
    ) as DeepClone<T>;
  }

  if (originalInstance instanceof Map) {
    const result = new Map();
    originalInstance.forEach((value, key) => {
      result.set(createDeepClone(key), createDeepClone(value));
    });
    return result as DeepClone<T>;
  }

  if (originalInstance instanceof Set) {
    const result = new Set();
    originalInstance.forEach((value) => {
      result.add(createDeepClone(value));
    });
    return result as DeepClone<T>;
  }

  if (originalInstance instanceof Date) {
    return new Date(originalInstance.getTime()) as DeepClone<T>;
  }

  if (originalInstance instanceof RegExp) {
    return new RegExp(
        (originalInstance as RegExp).source,
        (originalInstance as RegExp).flags
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
  metadata: { created: Date; updated: Date };
  scores: number[];
  settings: Map<string, any>;
  uniqueIds: Set<string>;
  nested: {
    level1: {
      level2: {
        value: string;
      };
    };
  };
  mixedArray: (string | number | boolean)[];
  pattern: RegExp;

  constructor() {
    this.name = "Test";
    this.age = 30;
    this.isActive = true;
    this.tags = ["typescript", "clone", "utility"];
    this.metadata = {
      created: new Date("2023-01-01"),
      updated: new Date("2024-01-01"),
    };
    this.scores = [100, 95, 90];
    this.settings = new Map([
      ["theme", "dark"],
      ["layout", "grid"],
    ]);
    this.uniqueIds = new Set(["id1", "id2", "id3"]);
    this.nested = {
      level1: {
        level2: {
          value: "deep",
        },
      },
    };
    this.mixedArray = [1, "two", true];
    this.pattern = /test/i;
  }

  greet(): string {
    return `Hello, ${this.name}`;
  }
  addTag(tag: string): void {
    this.tags.push(tag);
  }
}

const original = new CompleteClass();
const cloned = createDeepClone(original);

console.log(cloned instanceof CompleteClass);
console.log(cloned.greet());
console.log(cloned.settings.entries());
console.log(cloned.metadata);
console.log(cloned.uniqueIds.entries());
console.log(cloned.nested);
console.log(cloned.pattern);