{
  type Subset<A extends {}, B extends {}> = {
    [P in keyof B]: P extends keyof A ? (B[P] extends A[P] | undefined ? A[P] : never) : never;
  }

  type Strict<A extends {}, B extends {}> = Subset<A, B> & Subset<B, A>;

  type User = {
    name: string;
    age: number;
  };

  function addUserToDBStrict<T extends Strict<User, T>>(obj: T) { }

  const user = {
    name: "jane",
    age: 100,
    //foo: "bar"
  };

  addUserToDBStrict(user);
}