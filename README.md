[![Build Status](https://travis-ci.org/StarpTech/seneca-tests.svg?branch=master)](https://travis-ci.org/StarpTech/seneca-tests)

**After few months without a response from the Seneca Core Team I create my own solution https://github.com/hemerajs/hemera#**

seneca-tests
[Senecajs](https://github.com/senecajs/seneca) is a microservice toolkit to build distributed systems. In order to guarantee that your most important part of your application works as you expect I write some edges cases to prove senecajs in practice. Thanks to the guys who create senecajs.

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

#Tests:

##Error handling
```js
√ should propagate error to callee "Error first callbacks" on the same host (315ms)
1) should propagate error "Error first callbacks"
2) should propagate passed error to the first callee on the same host
3) should propagate passed error to the first callee
4) should propagate timeout errors to the first callee
5) should propagate passed error to the previous callee
√ should passed error with custom error handling (549ms)
```

## Result:
1) As long as we communicate in the same server and don't call further acts the error is propagated correctly.

2) As soon as we use acts in acts the original error isn't propagated correctly (the error is from type timeout).

3) As soon as we seperate our seneca plugins to different servers the error isn't propagated to the callee (err is NULL) and the
original error (error handler of seneca) is wrong.


__How can I handle my business errors when I can't handle them in the corresponding handler?__



### Author
Dustin Deus <deusdustin@gmail.de>
