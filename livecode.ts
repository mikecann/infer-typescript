{
  var x = "foo"
  let y = 123
  const z = true

  x = "bar"
  y = 555
  z = false

  x = 123
  y = "sdf"
  z = "s"
}

{

  let binary: 0 | 1 = 0

  binary = 1
  binary = 0
  binary = 22
  binary = -6

}

{

  function listen(eventName: "click" | "hover")

  listen("focus")

  const event = "click";

  listen(event);

}

{

  const http: "http" = "http"
  const https: "https" = "https"

  const protocols = [http, https]

  const first = protocols[0]
  const second = protocols[1]

  protocols.push("foo")

}

{
  const http: "http" = "http"
  let protocol = http;
}