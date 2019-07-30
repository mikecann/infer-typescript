{
  var x = "foo"
  let y = 123
  const z = true

  x = "bar"
  y = 444
  z = false

  x = 444
  y = "ggg"
  y = {}
}

{

  let binary: 0 | 1 = 1

  binary = 0
  binary = 1

  binary = 22
  binary = -4

}

{

  function listen(event: "click" | "hover"){}

  listen("focus")

  const event = "click"

  listen(event)

}

{

  function addUserToDB(user: User) {}

  type User = {
    name: string,
    age: number
  }

  const user = {
    name: "mike",
    age: 34,
    foo: "bar"
  }

  addUserToDB(user);

}

{

  function pick<T extends object, U extends keyof T>(obj: T, keys: U[]) : { [P in U]: T[P] } {
    throw "not implemented"
  }

  const picked = pick({ name: "mike", age: 34 }, ["name"]) // { name: "mike" }

  pick({ name: "jane", age: 22, pet: "doggo" }, ["foo"])

  pick("ddd", "fff");

}

{

  type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

  type OnlyTheFunction = FunctionKeys<typeof anObj>

  type Pick<T extends object, U extends keyof T> = { [P in U]: T[P] }

  function pickOnlyFunctions<T extends object, U extends keyof T>(obj: T): Pick<T, U>  {
    throw "not implemented"
  }

  const anObj = {
    name: "mike",
    age: 34,
    execute: () => { return "hello world" }
  }

  const picked = pickOnlyFunctions(anObj) // { execute: () => {...} }  

}