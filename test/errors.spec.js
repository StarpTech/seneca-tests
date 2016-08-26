'use strict'

process.setMaxListeners(0);

const Seneca = require('seneca');
const Code = require('code');
const expect = Code.expect;

describe('Seneca error handling', function () {

    describe('Default Error handling', function () {

        it('should propagate error to callee "Error first callbacks" on the same host', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    return done(new Error('test'), { chain: 'A' });
                })
            }

           let si = Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .error((err) => {
                    expect(err).to.be.exists();
                })
                .listen({type: 'http', port: '8260', pin: 'cmd:*'});

            si.act('cmd:A', function (err, reply) {
                expect(err).to.be.exists();
                console.log('error: ', err, 'result: ', reply);
                cb();
            });


        });

        it('should propagate error "Error first callbacks"', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    return done(new Error('test'), { chain: 'A' });
                })
            }

            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .use(A)
                .error((err) => {
                    expect(err).to.be.exists();
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
                    expect(err).to.be.exists();
                })
                .act('cmd:A', function (err, reply) {

                    //Here: reply contains the result { chain: 'A' } although an error was passed.
                    //console.log(reply);

                    expect.to.be.exists(err); //Important: should be able to evaluate the error for yourself
                    console.log('error: ', err, 'result: ', reply);
                    cb();
                });


        });

    });

    describe('Error handling in a call chain()', function () {

        it('should propagate passed error to the first callee', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(err, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(err, {chain: 'C->' + reply.chain})
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
                    expect(err).to.be.exists();
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
                    expect(err).to.be.exists();
                })
                .act('cmd:A', function (err, reply) {
                    expect(err).to.be.exists(); //Important: should be able to evaluate the error for yourself
                    console.log('error: ', err, 'result: ', reply);
                    cb();
                });



        });

        it('should propagate timeout errors to the first callee', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(err, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(err, {chain: 'C->' + reply.chain})
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
                    expect.to.be.exists(err);
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
                    expect(err).to.be.exists();
                })
                .act('cmd:A', function (err, reply) {
                    expect(err).to.be.exists(); //Important: should be able to evaluate the error for yourself
                    console.log('error: ', err, 'result: ', reply);
                    cb();
                });



        });

        it('should propagate passed error to the previous callee', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(err, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {

                        expect(err).to.be.exists(); //Important: should be able to evaluate the error for yourself

                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(err, {chain: 'C->' + reply.chain})
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
                    expect(err).to.be.exists();
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
                    expect(err).to.be.exists();
                })
                .act('cmd:A', function (err, reply) {
                    expect(err).to.be.exists();
                    console.log('error: ', err, 'result: ', reply);
                    cb();
                });



        });

        it('should passed error with custom error handling', function (cb) {

            function A() {
                this.add('cmd:A', (msg, done) => {
                    this.act('cmd:B', function (err, reply) {
                        if (err) {
                            console.error('Error propagated to A-B call :', err);
                        }
                        return done(err, {chain: 'A->B->' + reply.chain})
                    });
                })
            }

            function B() {
                this.add('cmd:B', (msg, done) => {
                    this.act('cmd:C', function (err, reply) {

                        if (err) {
                            console.error('Error propagated to B->C call :', err);
                        }
                        return done(err, {chain: 'C->' + reply.chain})
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
                .listen({type: 'http', port: '8263', pin: 'cmd:*'});


            Seneca({
                debug: {
                    undead: true
                },
                log: 'silent'
            })
                .client({port: 8263, pin: 'cmd:*'})
                .act('cmd:A', function (err, reply) {
                    expect(err).to.be.null();
                    expect(reply.chain).to.be.equals('A->B->C->error');
                    cb();
                });



        });

    });

});
