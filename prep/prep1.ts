
{
  // Suppose we wanted to write a function that given an object it returns another object that
  // just contains the functions on that object

  // so:

  function pickFunctions(obj): any {
    throw "doesnt matter"
  }

  const obj = {
    name: "mike",
    age: 34,
    execute: () => "hello world"
  }

  const picked = pickFunctions(obj); // should be { execute: () => {...} }

  type TypeOfPicked = typeof picked;

  // One problem is that we loose all type safety after calling the function 

  // Another issue is that we can call the function with anything:

  pickFunctions("foo");

  // So how can we improve this?

  // Well we can say that the obj is going to be an object:

  function pickFunctions2(obj: object) : object {
    throw "doesnt matter"
  }

  // what we can do next is begin to make the function genric

  function pickFunctions3<T>(obj: T) : object {
    throw "doesnt matter"
  }

  // What we want is then to return a type that only has the subset of properties

  function pickFunctions4<T>(obj: T) : Picked<T> {
    throw "doesnt matter"
  }

  type Picked<T> = {  }

  // We need a way of iterating over the keys in an object, we can use the keyof keyword

  type Picked2<T> = { [P in keyof T]: any }

  // Test it out

  type User = {
    name: string,
    age: number,
    execute: () => string
  }

  type Picked2User = Picked2<User>

  // Great, so now we need a way to somehow narrow our keysof T to just functions
  // this is where we can use conditional types

  type OnlyFunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  type Picked3<T> = { [P in OnlyFunctionKeys<T>]: T[P] extends Function ? T[P] : never }

  type Picked3User = Picked3<User>

}
