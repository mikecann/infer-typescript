{
  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type Pick<T, U extends keyof T> = { [K in U]: T[K] };

  type PickFunctions<T> = Pick<T, FunctionKeys<T>>;

  function runPickedFunctions<T>(obj: T): PickFunctions<T> {
    throw "not implemented"
  }

  const user = {
    name: "mike",
    age: 34,
    say: () => "hello"
  }

  const picked = runPickedFunctions(user) // { say: () => {...} }  

  type PickedType = typeof picked;
}