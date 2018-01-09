import { assert } from 'chai';
import AnnotationLoader from 'src/loaders/AnnotationLoader/AnnotationLoader';
import Context from "src/Context";
import Service from "src/loaders/AnnotationLoader/annotations/Service";
import Qualifier from "src/loaders/AnnotationLoader/annotations/Qualifier";
import Inject from "src/loaders/AnnotationLoader/annotations/Inject";
import PostConstruct from "src/loaders/AnnotationLoader/annotations/PostConstruct";

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
    });
});