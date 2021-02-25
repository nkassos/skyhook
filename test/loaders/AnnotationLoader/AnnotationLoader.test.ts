import { assert } from 'chai';
import {
    AnnotationLoader,
    Context,
    Service,
    Qualifier,
    Inject,
    PostConstruct,
    Factory
} from "../../../src";

describe('AnnotationLoader', () => {
    describe('#load', () => {
        it('should load using constructor dependencies', (cb) => {
            class TestService1 {
                constructor() {}

                saySomething() {
                    return 'I say...'
                }
            }

            class TestService2 {
                testService1: TestService1;

                constructor(testService1: TestService1) {
                    this.testService1 = testService1;
                }

                saySomething() {
                    return this.testService1.saySomething() + 'something!';
                }
            }

            const loader = new AnnotationLoader([
                TestService1,
                TestService2
            ]);

            loader.load().initialize().then((context: Context) => {
                let service: TestService2 = <TestService2> context.get('testService2');
                assert.equal(service.saySomething(), 'I say...something!');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });

        it('should load using constructor dependencies and Service/Qualifier annotations', (cb) => {
            @Service('qualifiedServiceName')
            class TestService1 {
                constructor() {}

                saySomething() {
                    return 'I say...'
                }
            }

            class TestService2 {
                testService1: TestService1;

                constructor(@Qualifier('qualifiedServiceName') testService1: TestService1) {
                    this.testService1 = testService1;
                }

                saySomething() {
                    return this.testService1.saySomething() + 'something!';
                }
            }

            let loader = new AnnotationLoader([
                TestService1,
                TestService2
            ]);

            loader.load().initialize().then((context: Context) => {
                let service: TestService2 = <TestService2> context.get('testService2');
                assert.equal(service.saySomething(), 'I say...something!');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });

        it('should load using Inject methods', (cb) => {
            class TestService1 {
                constructor() {}

                saySomething() {
                    return 'I say...'
                }
            }

            class TestService2 {
                testService1: TestService1;

                @Inject()
                setTestService1(testService1: TestService1) {
                    this.testService1 = testService1;
                }

                saySomething() {
                    return this.testService1.saySomething() + 'something!';
                }
            }

            let loader = new AnnotationLoader([
                TestService1,
                TestService2
            ]);

            loader.load().initialize().then((context: Context) => {
                let service: TestService2 = <TestService2> context.get('testService2');
                assert.equal(service.saySomething(), 'I say...something!');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });

        it('should run a postConstruct method', (cb) => {
            let postConstructRun: Boolean = false;

            class TestService1 {
                constructor() {}

                saySomething() {
                    return 'I say...'
                }
            }

            class TestService2 {
                testService1: TestService1;
                thingToSay: String;

                @Inject()
                setTestService1(testService1: TestService1) {
                    this.testService1 = testService1;
                }

                @PostConstruct()
                postConstruct() {
                    postConstructRun = true;
                    this.thingToSay = this.testService1.saySomething() + 'something!';
                }

                saySomething() {
                    return this.thingToSay;
                }
            }

            let loader = new AnnotationLoader([
                TestService1,
                TestService2
            ]);

            loader.load().initialize().then((context: Context) => {
                let service: TestService2 = <TestService2> context.get('testService2');
                assert.isTrue(postConstructRun);
                assert.equal(service.saySomething(), 'I say...something!');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });

        it('should fail if a cycle is detected', (cb) => {
            class TestService1 {
                constructor(testService2: TestService2) {}
            }

            class TestService2 {
                constructor(testService1: TestService1) {}
            }

            let loader = new AnnotationLoader([
                TestService1,
                TestService2
            ]);

            loader.load().initialize().then((context: Context) => {
                cb('Should have failed');
            }).catch((err) => {
                assert.equal(err.message, 'this is cyclic');
                cb();
            });
        });

        it('should load using a factory class using', (cb) => {
            @Factory()
            class TestFactory {
                constructor() {}

                @Service('qualifiedName')
                testService1() {
                    return {
                        name: 'testService1'
                    };
                }

                @Service()
                testService2(@Qualifier('qualifiedName') testService1) {
                    return {
                        name: 'testService2',
                        otherName: testService1.name
                    };
                }
            }

            let loader = new AnnotationLoader([
                TestFactory
            ]);

            loader.load().initialize().then((context: Context) => {
                assert.equal(context.get('qualifiedName').name, 'testService1');
                assert.equal(context.get('testService2').name, 'testService2');
                assert.equal(context.get('testService2').otherName, 'testService1');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });

        it('should load using a mix of services and factories', (cb) => {
            class TestService1 {
                name: string;

                constructor() {
                    this.name = 'testService1';
                }
            }

            @Factory()
            class TestFactory {

                @Service()
                testService2(testService1: TestService1) {
                    return {
                        name: 'testService2',
                        otherName: testService1.name
                    };
                }
            }

            let loader = new AnnotationLoader([
                TestService1,
                TestFactory
            ]);

            loader.load().initialize().then((context: Context) => {
                assert.equal(context.get('testService1').name, 'testService1');
                assert.equal(context.get('testService2').name, 'testService2');
                assert.equal(context.get('testService2').otherName, 'testService1');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });
    });
});