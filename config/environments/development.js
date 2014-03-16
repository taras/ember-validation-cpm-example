// Put your development configuration here.
//
// This is useful when using a separate API
// endpoint in development than in production.
//
// window.ENV.public_key = '123456'

window.ENV.FIXTURES = {
  "/posts" : {
    response: [
      {id: "1", title: "Hello World", slug: "hello-world"},
      {id: "2", title: "Why is validation so hard?", slug: "validation-is-hard"},
      {id: "3", title: "Let's get to the bottom of this", slug: "figure-it-out"}
    ],
    textStatus: 'success',
    jqXHR: {}
  },
  "/posts/hello-world": {
    response: {id: "1", title: "Hello World", slug: "hello-world"},
    textStatus: 'success',
    jqXHR: {}
  },
  "/posts/validation-is-hard": {
    response: {id: "2", title: "Why is validation so hard?", slug: "validation-is-hard"},
    textStatus: 'success',
    jqXHR: {}
  },
  "/posts/figure-it-out": {
    response: {id: "3", title: "Let's get to the bottom of this", slug: "figure-it-out"},

  }
};
