{
  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type Pick<T, U extends keyof T> = { [K in U]: T[K] };

  function runPickedFunctions<T>(obj: T): Pick<T, FunctionKeys<T>> {
    throw "not implemented"
  }

  const user = {
    name: "mike",
    age: 34,
    say: () => "hello",
    say2: () => 42,
  }

  const picked = runPickedFunctions(user) // { say: string, say2: number }  

  type PickedType = typeof picked;
}