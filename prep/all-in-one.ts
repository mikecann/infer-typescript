/* 

  Misc Notes

  - My name is Mike Cann, co-founder and lead developer at a startup called Markd.co

  - I am going to talk to you today about Typescript

  - I have been developing in it pretty much since its first release in 2012 but its only 
    fairly recently that I have started to dig a little deeper into the language
    and I was blown away by the expressiveness of whats possible

  - I dont really know the level of peoples typescript knowledge so I have structured it so
    it starts off basic and gets a bit more complex as things go on.

  - This is a live coding talk (which I havent ever done before). 
  
  - To make it event more risky I want to try to play a "infer the type" game 
    at the end if we have time.
    
  Misc:

  - TS is turing complete so technically anything is possbible: https://github.com/Microsoft/TypeScript/issues/14833
  - Some cool advanced types here: https://github.com/andnp/SimplyTyped
*/

// -------------------------------------------
// Lets start with something simple but really interesting in typescript, literal types
// type inference and type widening.
// -------------------------------------------

{
  // we can declare a variable in a number of ways
  var x: string = "foo";
  let y: number = 123;
  const z: boolean = true;

  // so we can re assign the var and let variables as we expect

  x = "bar"; // can reassign
  y = 456; // can reassign
  z = false // cant reassign

  // but what about their types?

  x = 666
  y = "mike"
  z = "foo"

  // All as expected, now if we drop the types then everything stays the same

  // typescript has "inferred" the correct types

  // okay fair enough seems simple enough but if we inspect the types there is something
  // a little more interesting going on here if we look at the type of z
}

// lets investigate how we can use this "literal" type thing to help us

{
  // lets say we want to represent a binary number purely in the type system (no classes)

  let binary: 0 | 1 = 0;

  // now when we try to assign to it then we can assign 0 or 1 as expected

  binary = 1
  binary = 0

  // but we cannot assign any other number because its not of the type "exactly 1 or 0"

  binary = 22
  binary = -12

  // another use case I find this really useful for is to restrict a function to only accept
  // certain event types

  function listen(event: "click" | "hover") { }

  // Now we cant call the function with something other than the type exactly "click or hover"

  listen("focus");

  // but what if we do this

  let event = "click";

  // can we call the function with this variable, what do you think?

  listen(event);

  // nope, because event is a let and thus typed to "string" it isnt narrow enough as 
  // listenForEvent only allows exactly the type "click or hover"

  // so we can fix this by "narrowing" the type by either making it const or explicilty 
  // typing the variable

  let event2: "click" = "click";
  listenForEvent(event2);

  const event3 = "click"
  listenForEvent(event3);
}


// okay lets take this a step further

{
  // Lets create a function that adds a user to a DB

  function addUserToDB(obj: User) { }

  type User = {
    name: string;
    age: number;
  };

  // we can then create an object and call the function

  const user = {
    name: "mike",
    age: 34
  };

  addUserToDB(user);

  // note that we havent explicity said that the object user is of type User yet typescript 
  // lets us do this, this is because typescript is a "Structurally Subtyped" language
  // which basically means that if it looks like a duck and quacks like a duck then its a duck
}

// now lets have a look at what happens if we change the type of one of the properties on our
// user object?

{
  const user = {
    name: "mike",
    age: "foo"
  };

  function addUserToDB2(obj: User) { }

  type User = {
    name: string;
    age: number;
  };

  addUserToDB(user);

  // we now get an error here as expected our user variable no longer looks like a User

  // but what if we add properties that arent explicity defined on the user?

  const user2 = {
    name: "mike",
    age: 34,
    foo: "bar"
  };

  addUserToDB(user2); // hmm.. we dont get an error?

  // This was wierd to be at first coming from C# with its "Nominal Subtypes" but it turns out 
  // this can make for some really flexible coding styles and can often really simplify 
  // your types

  // writing less types == good

  // But what if we want to say explicitly that it must be exactly User and contain no other
  // properties

  // Well one way to do it is like this:

  const user3: User = {
    name: "jane",
    age: 100,
    foo: "bar" // now we get an error
  };

  // But what if you want to strictly define it on the function definition?

  // Turns out this is tricker that you would have thought. And arguably more tricky than
  // it should be. Before we get there we need to back up a little and talk about a coupple
  // of other parts of the Typescript type system.
}

// To explain these lets look at another example

{
  // Suppose we want to write a function that "picks" a subset of properties from a provided
  // object and returns them?

  const picked = pick({ name: "mike", age: 34 }, ["name"]) // { name: "mike" }

  // a very simple imperative way to implement this might look like this"

  function pick(obj: any, keysToPick: any): any {
    let newObj = {};
    for (let key in obj) {
      if (keysToPick.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  // Cool, very handy, but it has problems like we can call it with properties that dont exist on 
  // the object

  pick({ name: "mike", age: 34 }, ["foo"])

  // Also the returned object is of type any which isnt very useful, another problem is that
  // the arguments are type any so we can pass anything to them

  pick("foo", "bar")

  // so how do we improve this and enforce some rules using typescript?

  // Well Typescript is fully turing complete so technically we can express ANYTHING in its type
  // system, but what makes it powerful is that we can express thing succinctly
  // in it

  // so we can start by saying that we expect the keys to be an array of strings..

  function pick2(obj: any, keysToPick: string[]): any {
    // ...
  }

  // Okay now what?

  // Well typescript has a powerful generics system what we might beable to leverage.

  function pick3<T>(obj: T, keysToPick: string[]): any { }

  // Note we dont have to explicitly provide the generic type when calling the function,
  // typescript can infer it:

  {
    const picked = pick3({ name: "mike", age: 34 }, ["name", "age"]);
  }

  // But the return type is still any, what we really want is a way express is that we are
  // going to return a type with a subset of properties from T

  // Well we want that same ability for the selection of the keys we want to pick too.

  // Well there is a handy keyword called "keyof"

  function pick4<T>(obj: T, keysToPick: (keyof T)[]): any {
    // ...
  }

  // Interesting so now the keys MUST belong to T

  pick4({ name: "mike", age: 34 }, ["name", "age"]); // awesome it allows what it should
  pick4({ name: "mike", age: 34 }, ["foo"]); // and doesnt allow what it shouldnt

  // But the return types is "any" still.. thats no good

  {
    const picked = pick4({ name: "mike", age: 34 }, ["name"]);
  }

  // Maybe we can use keyof again here in the returning type:

  function pick5<T>(obj: T, keysToPick: (keyof T)[]): { [P in keyof T]: any } {
    return {} as any;
  }

  // Hmm nope, it hasnt picked only the keys we want:

  {
    const picked = pick5({ name: "mike", age: 34 }, ["name"]);
  }

  // What we want to say is that the keys supplied in "keysToPick" are going to be the keys
  // in the returned object, we can do it like this:

  function pick6<T, U>(obj: T, keysToPick: U[]): { [P in U]: any } {
    return {} as any;
  }

  // But the above isnt happy with us, why?

  // The error it gives isnt actually very helpful but what its trying to say is that we 
  // havent told typescript that we want U to be the keys in T, how do we say that?

  // Type constraints to the rescue!

  function pick7<T, U extends keyof T>(obj: T, keysToPick: U[]): { [P in U]: any } {
    return {} as any;
  }

  {
    const picked = pick7({ name: "mike", age: 34 }, ["name"]);

    // yey our returned object now only has the keys that we have specified
  }

  // One thing tho is we have lost the type of the properties on the returned object
  // but we can get them back again by looking up the key P on T

  function pick8<T, U extends keyof T>(obj: T, keysToPick: U[]): { [P in U]: T[P] } {
    return {} as any;
  }

  {
    const picked = pick8({ name: "mike", age: 34 }, ["name", "age"]); // yey! it now works
  }

  // Awesome! Its almost there.

  // Theres one final problem however, we can pass non object types to our function

  pick8("foo", []);
  pick8(1, []);

  // well this is where we can use type constraints again

  function pick9<T extends object, U extends keyof T>(obj: T, keysToPick: U[]):
    { [P in U]: T[P] } {
    return {} as any;
  }

  // Awesome but now what if wanted modify the function a little so it only will 
  // pick functions

  function pick10<T extends object, U extends OnlyFunctionKeys10<T>>(obj: T, keysToPick: U[]):
    { [P in U]: T[P] } {
    return {} as any;
  }

  type OnlyFunctionKeys10<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  const picked10 = pick10({ name: "mike", execute: () => "hello" }, ["execute"]);

  // Okay cool, but what if now instead of returning the function we wanted to execute it?

  function pick11<T extends object, U extends OnlyFunctionKeys10<T>>(obj: T, keysToPick: U[]):
    { [P in U]: T[P] extends () => infer X ? X : never } {
    return {} as any;
  }

  const picked11 = pick11({ name: "mike", execute: () => "hello" }, ["execute"]);

  // infer is cool, it works with function arguments too:

  function pick12<T extends object, U extends OnlyFunctionKeys10<T>>(obj: T, keysToPick: U[]):
    { [P in U]: T[P] extends (args: infer Y) => infer X ? Y : never } {
    return {} as any;
  }

  const picked12 = pick12({ name: "mike", execute: (say: number) => "hello" }, ["execute"]);

}


// ----------------
// So now we have done all that we can go back to our user object and create a strict selector  
// ----------------

{
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
}



/*

// Okay so lets take this a step further

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening\

  // lets say we have these two consts

  const http = "http";
  const https = "https";

  // Then we make an array that contains those two variables

  const protocols = [http, https];

  const first = protocols[0];
  const second = protocols[1];

  // whats the type of first and second?

  // its string because protocols is string[] so we can push any old string in there

  protocols.push("foo");

  // but what if we didnt want to allow that?
}

// when you declare protocols typescript thinks that because you made an array the things
// you are putting into it are any old strings not the types it inferred

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  // Lets try explicity setting the literal types of the two consts

  const http: "http" = "http";
  const https: "https" = "https";

  const protocols = [http, https];

  const first = protocols[0];
  const second = protocols[1];

  protocols.push("foo");
}

// great but what if we wanted the first element to be exactly "http" and the second to be
// exactly "https"?

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  const http = "http";
  const https = "https";

  const protocols: ["http", "https"] = [http, https];

  const first = protocols[0];
  const second = protocols[1];
  const third = protocols[2]; // cannot access the third element

  protocols.push("http");
}

// Protocols is now a "tuple" not an "array" type.

*/