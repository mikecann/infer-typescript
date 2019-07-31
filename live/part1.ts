{
  function addUserToDb(user: User) {

  }

  type User = {
    name: string,
    age: number
  }

  const user = {
    name: "mike",
    age: 20,
    foo: "bar"
  }

  addUserToDb(user);
}