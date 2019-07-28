/* 

  Misc Notes

  - My name is Mike Cann, co-founder and lead developer at markd.co

  - So typescript is a pretty cool language. I have been developing in it pretty much since its 
    first release in 2012 but its only fairly recently that I have started to play with some of the 
    more "advanced" aspects of the language and was impressed so I thought I might share some 
    of the things that I found cool.

  - So this talk is only going to be about a small part of the language itself.

  - Im not going to deal with ecosystem around typescript like build tools editors etc

  - If you like what you see however there is a whole bunch more stuff you can go into and a 
    deep rabbit hole of interesting things to learn about.

  - Okay so lets get into it.

  - Oh BTW this is a live coding talk (which I havent ever done before) and I dont know if this is
    going to work or not but occasionally im going to ask a question so feel free to shout out what
    you think the answer is or keep it in your head or murmer it to yourself or whatever :)
    
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
}

// Great this all works. 

// Okay this is all good but lets say that we wanted to write a slightly new variation on
// our pick function that only picked properties from the object that are functions. 
// How can we do this?

{
  function pickOnlyFunctionsx<T extends object, U extends keyof T>(obj: T): { [P in U]: T[P] } {
    let newObj: any = {};
    for (let key in obj) {
      if (typeof obj[key] == "function") {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
}

const anObj = {
  name: "mike",
  age: 34,
  execute: () => { return "hello world" },
  execute2: () => 123
}

{
  const picked = pickOnlyFunctions(anObj) // { execute: () => {...} }  

  // So we can see that obviously the above is returning every key on T

  // We kind of want is something that picks just the functions, but how?

  //well first lets extract out this "Pick"'ingness out into its own type:

  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] };

  // okay cool, now we can see what we need is to somehow get all the keys of a given type
  // that are functions

  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  // Cool looks good, lets try this out in typeland:

  type OnlyTheFunctions = FunctionKeys<typeof anObj>

  // Great! So now we can add that to the return from our function

  function pickOnlyFunctionsx2<T extends object>(obj: T): Pick<T, FunctionKeys<T>> {
    return {} as any;
  }

  const picked2 = pickOnlyFunctionsx2(anObj);

  // The problem with the above is that VSCode shows us the type alias not the resultant 
  // object literal type. 
}

// To fix this I learnt a neat trick last week:

{
  type Identity<T> = T;
  type Pick<T extends object, U extends keyof T> = Identity<{ [P in U]: T[P] }>;
  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  function pickOnlyFunctionsx3<T extends object>(obj: T): Pick<T, FunctionKeys<T>> {
    return {} as any;
  }

  const picked3 = pickOnlyFunctionsx3(anObj);
}

// Great

// Lets take this up one final level (I promise) and lets say that we only want to return the
// results of each function call

{
  function resultsOfFunctions(obj: any): any {
    let returned: any = {};
    for (let key in obj)
      if (typeof obj[key] == "function")
        returned[key] = obj[key](); // add this

    return returned;
  }

  // Given what we have already

  type Identity<T> = T;
  type Pick<T extends object, U extends keyof T> = Identity<{ [P in U]: T[P] }>;
  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  // Lets alias out our picked functions into a type

  type PickedFunctions<T extends object> = Pick<T, FunctionKeys<T>>

  // Cool so we now know that this type has only functions, now we just need a way to somehow
  // iterate over each of those keys and just get the return type

  type ReturnTypes<T extends object> = { [K in keyof T]: T[K] extends () => infer R ? R : never }

  // Awesome, now we can finish our function definition

  function resultsOfFunctions3<T extends object>(obj: T): ReturnTypes<PickedFunctions<T>> {
    return {} as any;
  }

  const picked3 = resultsOfFunctions3(anObj);

  // Lets just use our identity trick again

  type ReturnTypes2<T extends object> = Identity<{ [K in keyof T]: T[K] extends () => infer R ? R : never }>


  function resultsOfFunctions4<T extends object>(obj: T): ReturnTypes2<PickedFunctions<T>> {
    return {} as any;
  }

  const picked4 = resultsOfFunctions4(anObj);
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
