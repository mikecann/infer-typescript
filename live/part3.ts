{
  type Pick<T, U extends keyof T> = { [K in U]: T[K] };

  function pickFunctions<T>(obj: T): Pick<T, keyof T> {
    throw "not implemented"
  }

  const user = {
    name: "mike",
    age: 34,
    say: () => "hello",
    say2: () => 42,
  }

  const picked = pickFunctions(user) // { say: () => {...}, say2: () => {...} }  

  type PickedType = typeof picked;
}