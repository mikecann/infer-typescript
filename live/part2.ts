{

  function pick(obj, keys): any {
    throw "not implemented"
  }

  const user = {
    name: "mike",
    age: 34,
    say: () => "hello",
  }

  const picked = pick(user, ["name", "age"]); // { name: "mike", age: 34 }

  pick(user, ["foo"]);

  pick(user, 444);

}