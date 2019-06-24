/* 

  Misc Notes

  - Im not going to deal with ecosystem around typescript like build tools editors etc
  - Im focusing on the type system with this talk and how you can express things succinctly and in a typesafe way
  - Im not trying to convince you to use typescript, I just think its pretty neat some of things you can do with TS these days
  - TS is turing complete so technically anything is possbible: https://github.com/Microsoft/TypeScript/issues/14833
  - I am not a language design expert 
  - I dont know if this is going to work or not but occasionally im going to ask a question just shout out what you think the answer is going to be
  - Not going to cover every aspect of TS in this talk, mostly the things I have come across on my daily travels and the things I have found interesting
  

  - Some cool advanced types here: https://github.com/andnp/SimplyTyped
*/

// -------------------------------------------
// The basics, const and type widening
// -------------------------------------------

{
  // we can declare a variable in a number of ways
  var x = "foo";
  let y = 123;
  const z = true;

  x = "bar"; // can reassign
  y = 456; // can reassign
  z = 456; // nope cant reassign to a const this is expected

  // note however that the type of "z" is changed due to the usage of the const [hover over it]

  // this is a subtle thing in typescript but super powerful called "type widening"
}

{
  var x: string = "foo";

  // we can change x

  x = "bar";

  // but if we declare the type as literal

  var y: "foo" = "bar"; // we cannot set it to an arbitrary string because this has been literally typed as it will always have this value "foo"

  // we can shortcut this by using const

  const z = "foo";

  // this is super useful when we want to restrict a function to only take in one string

  function listenForEvent(eventName: "foo" | "bar") {}

  listenForEvent("doo"); // cannot call it with something other than "foo" or "bar"

  let event = "bar";

  listenForEvent(event); // wont even allow our "string" to go it because its not narrow enough

  listenForEvent(event2); // Can
}

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  const http = "http"; // Type "http" (widening)
  const https = "https"; // Type "https" (widening)

  const protocols = [http, https]; // Type string[]

  const first = protocols[0]; // Type string
  const second = protocols[1]; // Type string
}

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  const http: "http" = "http"; // Type "http" (non-widening)
  const https: "https" = "https"; // Type "https" (non-widening)

  const protocols = [http, https]; // Type ("http" | "https")[]

  const first = protocols[0]; // Type "http" | "https"
  const second = protocols[1]; // Type "http" | "https"
}

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  const http: "http" = "http"; // Type "http" (non-widening)
  const https: "https" = "https"; // Type "https" (non-widening)

  const protocols: ["http", "https"] = [http, https]; // Type ("http" | "https")[]

  const first = protocols[0]; // Type "http" | "https"
  const second = protocols[1]; // Type "http" | "https"
}

// -------------------------------------------
// Objects
// -------------------------------------------

{
  const user = {
    name: "mike",
    age: 34
  }; // the type of these properties is widened

  type User = {
    name: string;
    age: number;
  };

  function addUserToDB(obj: User) {}

  addUserToDB(user);
}

{
  type User = {
    name: string;
    age: number;
  };

  const user = {
    name: "mike",
    age: "foo"
  }; // the type of these properties is widened

  function addUserToDB2(obj: User) {}

  addUserToDB(user); // we get an error here as expected because it doesnt match

  // but what if we add properties that arent explicity defined on the user?

  const user2 = {
    name: "mike",
    age: 34,
    foo: "bar"
  };

  addUserToDB(user2); // hmm.. we dont get an error?

  // This is because typescript uses "Structural Subtyping", so if it looks like a duck then it is a duck

  // This was wierd to be at first coming from C# with its "Nominal Subtypes" but I now love its increased
  // flexibility

  // But what if we want to say that that the user must not have any other properties on it?

  // Well one way to do it is like this:

  const user3: User = {
    name: "jane",
    age: 100,
    foo: "bar" // now we get an error
  };

  // But what if you want to strictly define it on the function definition?

  // Turns out this is tricker that you would have thought. Before we get there we need to back
  // up a little and talk about "keyof"
}

{
  // Suppose we want to write a function that "picks" a subset of properties from a provided
  // object and returns them?

  console.log(pick({ name: "mike", age: 34 }, ["name"])); // { name: "mike" }

  function pick(obj: any, keysToPick: any): any {
    let newObj = {};
    for (let key in obj) {
      if (keysToPick.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  // Cool, very handy, but how to we make this strongly typed?

  // Well we can start by saying that we expect the keys to be an array of strings..

  function pick2(obj: any, keysToPick: string[]): any {
    // ...
  }

  // Okay now what?

  // Well typescript has a powerful generics system what we might beable to leverage

  // Lets look at a quick example:

  // We can write a function that takes in a generic and returns another generic like this:

  function ensureThingIsNotNull<T>(theThing: T | null): T {
    if (theThing == null) throw new Error("nope");
    return theThing;
  }

  ensureThingIsNotNull(null);
  ensureThingIsNotNull("foo");
  ensureThingIsNotNull(1);

  // So now back to our pick

  function pick3<T>(obj: T, keysToPick: string[]): any {
    // T but only with the keys from "keysToPick"
    // ...
  }

  // Well there is a handy keyword called "keyof"

  function pick4<T>(obj: T, keysToPick: (keyof T)[]): any {
    // ...
  }

  // Interesting so now the keys MUST belong to T

  pick4({ name: "mike", age: 34 }, ["name", "age"]); // awesome it allows what it should
  pick4({ name: "mike", age: 34 }, ["foo"]); // and doesnt allow what it shouldnt

  // But the return types is "any" still.. thats no good

  {
    const picked = pick4({ name: "mike", age: 34 }, ["name"]); // awesome it allows what it should
  }

  // So the final step is to say that the return type is going to be an object that includes
  // the keys we supplied

  function pick5<T>(obj: T, keysToPick: (keyof T)[]): { [P in keyof T]: any } {
    return {} as any;
  }

  {
    const picked = pick5({ name: "mike", age: 34 }, ["name"]); // hmm it doesnt?
  }

  // The problem is we arent specifying that the keys we are supplying are going to be the
  // only keys on the new object, to do that we have to make it a generic argument too:

  function pick6<T, U>(obj: T, keysToPick: U[]): { [P in U]: any } {
    return {} as any;
  }

  // Hmm.. But how do we specify that U should be the keyof T ?

  // Type constraints to the rescue!

  function pick7<T, U extends keyof T>(
    obj: T,
    keysToPick: U[]
  ): { [P in U]: any } {
    return {} as any;
  }

  {
    const picked = pick7({ name: "mike", age: 34 }, ["name"]); // yey! it now works
  }

  // One thing tho is we have lost the type of the properties on the returned object
  // but we can get them back again by looking up the property on U

  function pick8<T, U extends keyof T>(
    obj: T,
    keysToPick: U[]
  ): { [P in U]: T[P] } {
    return {} as any;
  }

  {
    const picked = pick8({ name: "mike", age: 34 }, ["name", "age"]); // yey! it now works
  }

  // Awesome! But one issue:

  pick8("foo", ["bar"]);
  pick8(1, ["bar"]);

  // We can call the pick with any old type.. Thoughts on how to solve this?

  function pick9<T extends object, U extends keyof T>(
    obj: T,
    keysToPick: U[]
  ): { [P in U]: T[P] } {
    return {} as any;
  }

  {
    const picked = pick9({ name: "mike", age: 34 }, ["name", "age"]); // yey! it now works
    pick9("foo", ["bar"]);
    pick9(1, ["bar"]);
  }
}
