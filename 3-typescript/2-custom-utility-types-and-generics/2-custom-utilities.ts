/**
 * Exercise #1: Filter object properties by type.
 *
 * Using a utility type `OmitByType`, this example demonstrates how to pick properties
 * from a type `T` whose values are *not* assignable to a specified type `U`.
 *
 * @example
 * type OmitBoolean = OmitByType<{
 *   name: string;
 *   count: number;
 *   isReadonly: boolean;
 *   isEnable: boolean;
 * }, boolean>;
 *
 * Resulting type:
 *
 * {
 * name: string;
 * count: number;
 * }
 */

/* IMPLEMENTACION */
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/* EJEMPLO */
type Original = {
  name: string;
  count: number;
  isReadonly: boolean;
  isEnable: boolean;
};
const omitByExample: Original = {
  name: "Dashboard",
  count: 42,
  isReadonly: true,
  isEnable: false,
};
type WithoutBooleans = OmitByType<Original, boolean>;
const omitByExampleFiltered: WithoutBooleans = {
  name: omitByExample.name,
  count: omitByExample.count,
  //isReadOnly: false //Error: does not exist in type 'OmitByType<Original, boolean>'
  //isEnable: true //Error: does not exist in type 'OmitByType<Original, boolean>'
};
console.log("Original:", omitByExample);
console.log("Filtered (without booleans):", omitByExampleFiltered);

/**
 * Exercise #2: Implement the utility type `If<C, T, F>`, which evaluates a condition `C`
 * and returns one of two possible types:
 * - `T` if `C` is `true`
 * - `F` if `C` is `false`
 *
 * @description
 * - `C` is expected to be either `true` or `false`.
 * - `T` and `F` can be any type.
 *
 * @example
 * type A = If<true, 'a', 'b'>;  // expected to be 'a'
 * type B = If<false, 'a', 'b'>; // expected to be 'b'
 */

/* IMPLEMENTACION */
type If<C extends boolean, T, F> = C extends true ? T : F;

/* EJEMPLO */
type A = If<true, "a", "b">;
type B = If<false, "a", "b">;
const ifExampleA: A = "a";
const ifExampleB: B = "b";
// const exampleAWrong: A = 'b'; // Error: Type '"b"' is not assignable to type '"a"'
// const exampleBWrong: B = 'a'; // Error: Type '"a"' is not assignable to type '"b"'
console.log(ifExampleA);
console.log(ifExampleB);

/**
 * Exercise #3: Recreate the built-in `Readonly<T>` utility type without using it.
 *
 * @description
 * Constructs a type that makes all properties of `T` readonly.
 * This means the properties of the resulting type cannot be reassigned.
 *
 * @example
 * interface Todo {
 *   title: string;
 *   description: string;
 * }
 *
 * const todo: MyReadonly<Todo> = {
 *   title: "Hey",
 *   description: "foobar"
 * };
 *
 * todo.title = "Hello";       // Error: cannot reassign a readonly property
 * todo.description = "barFoo"; // Error: cannot reassign a readonly property
 */

/* IMPLEMENTACION */
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

/* EJEMPLO */
interface Todo {
  title: string;
  description: string;
}
const readonlyExample: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};
// readonlyExample.title = "Hello"; // Error: Cannot assign to 'title' because it is a read-only property
// readonlyExample.description = "barFoo"; // Error: Cannot assign to 'description' because it is a read-only property
console.log(readonlyExample);

/**
 * Exercise #4: Recreate the built-in `ReturnType<T>` utility type without using it.
 *
 * @description
 * The `MyReturnType<T>` utility type extracts the return type of a function type `T`.
 *
 * @example
 * const fn = (v: boolean) => {
 *   if (v) {
 *     return 1;
 *   } else {
 *     return 2;
 *   }
 * };
 *
 * type a = MyReturnType<typeof fn>; // expected to be "1 | 2"
 */

/* IMPLEMENTACION */
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/* EJEMPLO */
const fn = (v: boolean): 1 | 2 => {
  if (v) {
    return 1;
  } else {
    return 2;
  }
};
type ReturnTypeOfFn = MyReturnType<typeof fn>;
const returnTypeExample: ReturnTypeOfFn = 1;
// const wrongResult: ReturnTypeOfFn = "string"; // Error: Type 'string' is not assignable to type '1 | 2'
console.log(returnTypeExample);

/**
 * Exercise #5: Extract the type inside a wrapped type like `Promise`.
 *
 * @description
 * Implement a utility type `MyAwaited<T>` that retrieves the type wrapped in a `Promise` or similar structure.
 *
 * If `T` is `Promise<ExampleType>`, the resulting type should be `ExampleType`.
 *
 * @example
 * type ExampleType = Promise<string>;
 *
 * type Result = MyAwaited<ExampleType>; // expected to be "string"
 */

/* IMPLEMENTACION */
type MyAwaited<T> = T extends Promise<infer U> ? U : T;

/* EJEMPLO */
type ExampleType = Promise<string>;
type Result = MyAwaited<ExampleType>;
const myAwaitedExample: Result = "Hello, world!";
// const wrongMyAwaitedExample: Result = 123; // Error: Type 'number' is not assignable to type 'string'
console.log(myAwaitedExample);

/**
 * Exercise 6: Create a utility type `RequiredByKeys<T, K>` that makes specific keys of `T` required.
 *
 * @description
 * The type takes two arguments:
 * - `T`: The object type.
 * - `K`: A union of keys in `T` that should be made required.
 *
 * If `K` is not provided, the utility should behave like the built-in `Required<T>` type, making all properties required.
 *
 * @example
 * interface User {
 *   name?: string;
 *   age?: number;
 *   address?: string;
 * }
 *
 * type UserRequiredName = RequiredByKeys<User, 'name'>;
 * expected to be: { name: string; age?: number; address?: string }
 */

/* IMPLEMENTACION */
type RequiredByKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};

/* EJEMPLO */
interface User {
  name?: string;
  age?: number;
  address?: string;
}
type UserRequiredName = RequiredByKeys<User, "name">; // expected to be { name: string; age?: number; address?: string }

const requiredByKeysExample: UserRequiredName = { name: "John" }; // OK
// const wrongRequiredByKeysExample: UserRequiredName = { age: 25 }; // Error: Property 'name' is missing in type '{ age: number; }' but required in type '{ name: string; }'

console.log(requiredByKeysExample);
