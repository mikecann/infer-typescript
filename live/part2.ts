{

  function pick(obj, keys) {
    throw "doesnt matter"
  }

  const user = {
    name: "mike",
    age: 34,
    say: () => "hello",
  }

  const picked = pick(user, ["name", "age"]); // { name: "mike", age: 34 }

}