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
// Lets start with something simple but really interesting in typescript, literal types
// type inference and type widening.
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

  // we can see that the type of z has been "inferred" to be exactly "true" which is a "literal types" // and "type widening"
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

// Although in the above we are working with "literal types"

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening\

  // Let take a little look at how this works with arrays.

  const http = "http"; // Type "http" (widening)
  const https = "https"; // Type "https" (widening)

  // Guess, what is the type of protocols? You might expect it to be ["http", "https"] ?
  const protocols = [http, https];

  const first = protocols[0];
  const second = protocols[1];

  protocols.push("foo");
}

// So whats going on here?

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  // Lets try explicity setting the literal types of the two consts

  const http: "http" = "http"; // Type "http" (non-widening)
  const https: "https" = "https"; // Type "https" (non-widening)

  // Guess, what is the type of protocols now?
  const protocols = [http, https];

  const first = protocols[0];
  const second = protocols[1];

  protocols.push("foo");
}

// Curious, so explicity telling typscript that http and https are going to be their literal type
// it forces protocol not to be "widened" to string

// But the type of first and second could be either http OR https, thats because typescript has
// inferred that protocols is an array so all the elements in the array could be EITHER
// http or https

// What if we wanted the first element to be exactly "http" and the second to be exactly "https"?

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

// -------------------------------------------
// Lets take this s step further now and look at how this applies to objects
// -------------------------------------------

{
  // Guess, what do you think the type of user is here?

  const user = {
    name: "mike",
    age: 34
  };

  // We can define a function that takes in a User like so:

  function addUserToDB(obj: User) {}

  type User = {
    name: string;
    age: number;
  };

  // Then we can call it with our "user" even tho we havent explicity typed user as a "User"

  addUserToDB(user);
}

// Coming a C# / Java background this might seem a little odd, why is typescript allowing this
// "untyped" object to be passed in somewhere where we are explicity requesting a "User"?

// Lets have a look at what happens if we change the type of one of the properties on our
// user object?

{
  const user = {
    name: "mike",
    age: "foo"
  };

  function addUserToDB2(obj: User) {}

  type User = {
    name: string;
    age: number;
  };

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
  // up a little and talk about another powerful feature of the TS type system..
}

{
  // Lets look at an example

  // Suppose we want to write a function that "picks" a subset of properties from a provided
  // object and returns them?

  console.log(pick({ name: "mike", age: 34 }, ["name"])); // { name: "mike" }

  // We might implement it like this:

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

  // Typescript is fully turing complete so technically we can express ANYTHING in its type
  // system, the question is how succinctly can we do it for common tasks?

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

  const theThing1 = ensureThingIsNotNull(null);
  const theThing2 = ensureThingIsNotNull("foo");
  const theThing3 = ensureThingIsNotNull(1);

  // So now back to our pick

  function pick3<T>(obj: T, keysToPick: string[]): any {}

  // Note we dont have to explicitly provide the generic type when calling teh function,
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

  // The problem is we arent specifying that the keys we are supplying are going to be the
  // only keys on the new object, to do that we have to make it a generic argument too:

  function pick6<T, U>(obj: T, keysToPick: U[]): { [P in U]: any } {
    return {} as any;
  }

  // But the above isnt happy with us

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

  // Awesome! Its almost there.

  // Theres one final problem however, we can

  pick8("foo", []);
  pick8(1, []);

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

  // In pure typeland we could describe this "Picking" behaviour in a type alias as

  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] };

  type User = {
    firstName: string;
    surname: string;
    age: number;
  };

  type JustNames = Pick<User, "firstName" | "surname">;

  // Could write our pick now as:

  function pick10<T extends object, U extends keyof T>(
    obj: T,
    keysToPick: U[]
  ): Pick<T, U> {
    return {} as any;
  }
}
