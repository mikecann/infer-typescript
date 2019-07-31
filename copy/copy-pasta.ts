// ----------------------------------------
{
  type Identity<T> = T;
  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] };

  function pickOnlyFunctions<T extends object, U extends keyof T>(obj: T): Pick<T, U> {
    throw "not implemented"
  }

  const anObj = {
    name: "mike",
    age: 34,
    start: () => { return "hello world" },
    launch: () => { return 123 }
  }

  const picked = pickOnlyFunctions(anObj) // { start: () => {...}, launch: () => {...} }  

  type PickedType = typeof picked;
}









// --------------------------------------------------

{
  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] };
}

// ---------------------------------------------------

{
  type Identity<T> = T;
  type Pick<T extends object, U extends keyof T> = Identity<{ [P in U]: T[P] }>;
}













// --------------------------------

{
  type Subset<A extends {}, B extends {}> = {
    [P in keyof B]: P extends keyof A ? (B[P] extends A[P] | undefined ? A[P] : never) : never;
  }

  type Strict<A extends {}, B extends {}> = Subset<A, B> & Subset<B, A>;

  type User = {
    name: string;
    age: number;
  };

  function addUserToDB3<T extends Strict<User, T>>(obj: T) { }

  const user3 = {
    name: "jane",
    age: 100,
    foo: "bar"
  };

  addUserToDB3(user3);
}