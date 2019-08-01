{
  function addUserToDb(user: User) { }

  type User = {
    name: string,
    age: number
  }

  const user: User = {
    name: "mike",
    age: 20,
  }

  addUserToDb(user);
}