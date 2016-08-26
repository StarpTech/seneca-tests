'use strict'

const Seneca = require('seneca');
const Assert = require('assert');

describe('Seneca error handling', function () {

    describe('Error handling in a call chain()', function () {

        it('should propagate passed error to the first callee', function (done) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(null, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(null, {chain: 'C->' + reply.chain})
                    });
                })
            }

            function C() {
                this.add('cmd:C', (msg, done) => {
                    return done(new Error('test'));
                })
            }

            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .use(B)
                .use(C)
                .error((err) => {
                    Assert.ok(err);
                })
                .listen({type: 'http', port: '8260', pin: 'cmd:*'});


            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .client({port: 8260, pin: 'cmd:*'})
                .error((err) => {
                    Assert.ok(err);
                })
                .act('cmd:A', function (err, reply) {
                    Assert.ok(err); //Important: You should be able to evaluate the error for yourself
                    console.log('error: ', err, 'result: ', reply);
                    done();
                });



        });

        it('should propagate timeout errors to the first callee', function (done) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(null, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(null, {chain: 'C->' + reply.chain})
                    });
                })
            }

            function C() {
                //NOTE: D is not available so it leads to a timeout error
                this.add('cmd:D', (msg, done) => {
                    return done(new Error('test'));
                })
            }

            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .use(B)
                .use(C)
                .error((err) => {
                    Assert.ok(err);
                })
                .listen({type: 'http', port: '8261', pin: 'cmd:*'});


            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .client({port: 8261, pin: 'cmd:*'})
                .error((err) => {
                    Assert.ok(err);
                })
                .act('cmd:A', function (err, reply) {
                    Assert.ok(err); //Important: You should be able to evaluate the error for yourself
                    console.log('error: ', err, 'result: ', reply);
                    done();
                });



        });

        it('should propagate passed error to the previous callee', function (done) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(null, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {

                        Assert.ok(err); //Important: You should be able to evaluate the error for yourself

                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(null, {chain: 'C->' + reply.chain})
                    });
                })
            }

            function C() {
                this.add('cmd:C', (msg, done) => {
                    return done(new Error('test'));
                })
            }

            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .use(B)
                .use(C)
                .error((err) => {
                    Assert.ok(err);
                })
                .listen({type: 'http', port: '8262', pin: 'cmd:*'});


            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .client({port: 8262, pin: 'cmd:*'})
                .error((err) => {
                    Assert.ok(err);
                })
                .act('cmd:A', function (err, reply) {
                    console.log('error: ', err, 'result: ', reply);
                    done();
                });



        });

        it('should passed error in a custom response - This is a dirty hack', function (done) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(null, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {

                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(null, {chain: 'C->' + reply.chain})
                    });
                })
            }

            function C() {
                this.add('cmd:C', (msg, done) => {
                    return done(null /*always null*/, { success: false, chain: 'error'  });
                })
            }

            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .use(B)
                .use(C)
                .error((err) => {
                    Assert.ok(!err);
                })
                .listen({type: 'http', port: '8263', pin: 'cmd:*'});


            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .client({port: 8263, pin: 'cmd:*'})
                .error((err) => {
                    Assert.ok(!err);
                })
                .act('cmd:A', function (err, reply) {
                    Assert.ok(!err); //Err is ignored everywhere
                    Assert.ok(reply.chain, 'A->B->C->error');
                    done();
                });



        });

    });

});
