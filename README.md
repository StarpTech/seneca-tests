[![Build Status](https://travis-ci.org/StarpTech/seneca-tests.svg?branch=master)](https://travis-ci.org/StarpTech/seneca-tests)

# seneca-tests
Seneca is a microservice toolkit to build distributed systems. In order to guarantee that your most important part of your application works as you expect I write some edges cases to prove senecajs in practice. Thanks to the guys who create senecajs.

# Run tests

```js
mocha
````

# Description
In Seneca you can build easily a network of Microservices. Seneca built this tool of following reasons:

> So that it doesn't matter,

    who provides the functionality,
    where it lives (on the network),
    what it depends on,
    it's easy to define blocks of functionality (plugins!).
    So long as some command can handle a given JSON document, you're good.

**Where it lives (on the network)**

To ensure this feature senecajs needs to be able to handle distribution problems. I open this repository fo focus on error handling in a microservice environment.
Any contribution is welcome! Thank you. In case of the wrong usage of this framework it would be nice to show me the correct way. Another reason why I open this is that senecajs lacks on documentation.

**Question to answering:**

- What is the way to handle with errors across services when it doesn't matter where they lives? In the tests you can see that it behavious very differently.

Tests:

```js
 √ should propagate error to callee "Error first callbacks" on the same host (315ms)
1) should propagate error "Error first callbacks"
2) should propagate passed error to the first callee
3) should propagate timeout errors to the first callee
4) should propagate passed error to the previous callee
√ should passed error with custom error handling (549ms)
```


### Author
Dustin Deus <deusdustin@gmail.de>
