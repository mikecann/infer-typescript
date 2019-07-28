// 1 --------------------------------

function pick(obj: any, keysToPick: any): any {
  let newObj = {};
  for (let key in obj) {
    if (keysToPick.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// 2 --------------------------------

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