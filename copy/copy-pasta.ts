// ----------------------------------------
{
  function pickOnlyFunctions<T extends object, U extends keyof T>(obj: T): { [P in U]: T[P] } {
    throw "not implemented"
  }

  const anObj = {
    name: "mike",
    age: 34,
    execute: () => { return "hello world" }
  }

  const picked = pickOnlyFunctions(anObj) // { execute: () => {...} }  
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