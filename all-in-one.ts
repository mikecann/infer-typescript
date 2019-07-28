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
  var x = "foo";
  let y = 123;
  const z = true;

  // so we can re assign the var and let variables as we expect

  x = "bar"; // can reassign
  y = 456; // can reassign

  // but cannot assign the wrong type to the variables

  x = 666
  y = "mike"

  // and we cannot reassign to the z variable because its a constant

  z = false;

  // this is all pretty basic but there is something else interesting going on here
  // if we hover over the variables x,y,z we can inspect their type 

  // see if you can guess what the type of the variables will be

  // z is interesting, its typed to exactly "true" not "boolean", lets look to see what 
  // we can do with this 

}

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

  function listenForEvent(eventName: "click" | "hover") { }

  // Now we cant call the function with something other than the type exactly "click or hover"

  listenForEvent("focus");

  // but what if we do this

  let event = "click";

  // can we call the function with this variable, what do you think?

  listenForEvent(event);

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

  // Given what we have just talked about what do you think the type of "protocols" is?
  // maybe not what you would expect

  // If we extract out each of the elements from the array we can look at the types here too

  const first = protocols[0];
  const second = protocols[1];

  // and we can push into the array as expected 

  protocols.push("foo");
}

// To see whats going on here lets look at this a little closer

{
  const http = "http";
  let protocol = http;

  // What do you think the type of protocol is here?

  // typescript has "widened" the type of the const variable when assigning it into the let variable
}

{

  // If we explicity type the const variable however

  const http: "http" = "http";
  let protocol = http;

  // what do we think the type of protocol is now?

  // typescript has been told not to "widen the variable"

}

// lets apply that to our array example

{
  // Borrowed from: https://mariusschulz.com/blog/typescript-2-1-literal-type-widening

  // Lets try explicity setting the literal types of the two consts

  const http: "http" = "http";
  const https: "https" = "https";

  // Guess, what is the type of protocols now?
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

  pick({ name: "mike", age: 34 }, ["name"]) // { name: "mike" }

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

  function pick3<T>(obj: T, keysToPick: string[]): any { }

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

  function pick7<T, U extends keyof T>(obj: T, keysToPick: U[]): { [P in U]: any } {
    return {} as any;
  }

  {
    const picked = pick7({ name: "mike", age: 34 }, ["name"]); // yey! it now works
  }

  // One thing tho is we have lost the type of the properties on the returned object
  // but we can get them back again by looking up the property on U

  function pick8<T, U extends keyof T>(obj: T, keysToPick: U[]): { [P in U]: T[P] } {
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

  function pick9<T extends object, U extends keyof T>(obj: T, keysToPick: U[]):
    { [P in U]: T[P] } {
    return {} as any;
  }

  {
    const picked = pick9({ name: "mike", age: 34 }, ["name", "age"]); // yey! it now works
    pick9("foo", ["bar"]);
    pick9(1, ["bar"]);
  }

  // Ill show you one extra thing that will set the groundwork for the next section..

  // In pure typeland we could describe this "Picking" behaviour in a type alias as

  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] };

  type User = {
    firstName: string;
    surname: string;
    age: number;
  };

  type JustNames = Pick<User, "firstName" | "surname">;

  // Could write our pick now as:

  function pick10<T extends object, U extends keyof T>(obj: T, keysToPick: U[]): Pick<T, U> {
    return {} as any;
  }

  // Okay this is all good but lets say that we wanted to write a slightly new variation on
  // our pick function that only picked properties from the object that are functions. 
  // How can we do this?

  function pickOnlyFunctions1<T extends object, U extends keyof T>(obj: T): Pick<T, U> // U ??
  {
    return {} as any;
  }

  const anObj = {
    name: "mike",
    age: 34,
    execute: () => { return "hello world" }
  }

  const onlyFunctions = pickOnlyFunctions1(anObj) // well yes we could do it like this

  // But what if the object had lots of fields on it and we dont want to have to go through
  // and list every single one, it would be nice if there was a way to select just the
  // fields that are functions

  // We kind of want something that only representing that we only want the keys from a 
  // given type that are functions:

  type OnlyFunctionNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];

  type FunctionsOfAnObj = OnlyFunctionNames<typeof anObj>

  // Great! So now we can add that to the return from our function

  function pickOnlyFunctions2<T extends object>(obj: T):
    Pick<T, OnlyFunctionNames<T>> {
    return {} as any;
  }

  {
    const onlyFunctions = pickOnlyFunctions2(anObj);
    onlyFunctions.name // doesnt exist
    onlyFunctions.execute() // does exist
  }

  // Okay cool, lets take it up one more level 

  // What if we wanted to write a function that calls any function on the given object and
  // returns the result?

  function resultsOfFunctions(obj: any): any {
    let returned: any = {};
    for (let key in obj)
      if (typeof obj[key] == "function")
        returned[key] = obj[key]();

    return returned;
  }

  // How do we strongly type this?

  function resultsOfFunctions2<T>(obj: T): any {
    return {} as any;
  }

  // Well we want to make sure we are only returning fields that are functions, but we know
  // how to do that from before.

  // Then we could turn the pick we used above into a type alias:

  type PickOnlyFunctions<T extends object> = Pick<T, OnlyFunctionNames<T>>

  // Great so now we have just functions we need to somehow get access to just their return type.
  // This leads us to our final new keyword

  type ReturnTypes<T extends object> = { [K in keyof T]: T[K] extends () => infer R ? R : never }

  // Awesome, now we can finish our function definition

  function resultsOfFunctions3<T extends object>(obj: T): ReturnTypes<PickOnlyFunctions<T>> {
    return {} as any;
  }

  {
    const myObj = {
      name: "mike",
      execute1: () => "hello",
      execute2: () => 123
    }

    const ret = resultsOfFunctions3(myObj);

    ret.execute1 // is a string
    ret.execute2 // is a number
  }

  // So now we have done all that we can go back to our user object and create a strict selector  

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

  // So given the above lets ask the audience .ts

}
