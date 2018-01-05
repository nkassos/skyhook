import { assert } from 'chai';
import AnnotationParserUtil from 'src/loaders/AnnotationLoader/util/AnnotationParserUtil';
import Qualifier from 'src/loaders/AnnotationLoader/annotations/Qualifier';
import ServiceMethodDefinition from "src/loaders/AnnotationLoader/ServiceMethodDefinition";
import PostConstruct from "src/loaders/AnnotationLoader/annotations/PostConstruct";
import PostConstructKey from "src/loaders/AnnotationLoader/symbols/PostConstructKey";
import Inject from "src/loaders/AnnotationLoader/annotations/Inject";
import InjectKey from "src/loaders/AnnotationLoader/symbols/InjectKey";
import ServiceDefinition from "src/loaders/AnnotationLoader/ServiceDefinition";
import Service from "src/loaders/AnnotationLoader/annotations/Service";

describe('AnnotationParserUtil', () => {
    describe('#parseServiceName', () => {
        it('should parse a service name', () => {
            class TestService {}
            let name = AnnotationParserUtil.parseServiceName(TestService);
            assert.equal(name, 'testService');
        });
    });

    describe('#parseQualifiers', () => {
        it('should not qualify any arguments of the constructor', () => {
            class TestService {
                constructor(arg1, arg2) {}
            }

            let args: String[] = AnnotationParserUtil.parseQualifiers(TestService);
            assert.equal(args.length, 2);
            assert.equal(args[0], 'arg1');
            assert.equal(args[1], 'arg2');
        });

        it('should qualify the first argument of a constructor', () => {
            class TestService {
                constructor(@Qualifier('qualified') arg1, arg2) {}
            }

            let args: String[] = AnnotationParserUtil.parseQualifiers(TestService);
            assert.equal(args.length, 2);
            assert.equal(args[0], 'qualified');
            assert.equal(args[1], 'arg2');
        });

        it('should qualify the second argument of a constructor', () => {
            class TestService {
                constructor(arg1, @Qualifier('qualified2') arg2) {}
            }

            let args: String[] = AnnotationParserUtil.parseQualifiers(TestService);
            assert.equal(args.length, 2);
            assert.equal(args[0], 'arg1');
            assert.equal(args[1], 'qualified2');
        });

        it('should qualify both constructor arguments', () => {
            class TestService {
                constructor(@Qualifier('qualifier1') arg1, @Qualifier('qualified2') arg2) {}
            }

            let args: String[] = AnnotationParserUtil.parseQualifiers(TestService);
            assert.equal(args.length, 2);
            assert.equal(args[0], 'qualifier1');
            assert.equal(args[1], 'qualified2');
        });

        it('should qualify a method argument', () => {
            class TestService {
                someMethod(arg1, @Qualifier('qualified') arg2) {}
            }

            let args: String[] = AnnotationParserUtil.parseQualifiers(TestService.prototype, 'someMethod');
            assert.equal(args.length, 2);
            assert.equal(args[0], 'arg1');
            assert.equal(args[1], 'qualified');
        });
    });

    describe('#parseServiceMethod', () => {
        it('should parse a method with no qualifiers', () => {
            class TestService {
                someMethod(arg1, arg2) {}
            }

            let methodDefinition: ServiceMethodDefinition = AnnotationParserUtil.parseServiceMethod(TestService.prototype, 'someMethod');
            assert.equal(methodDefinition.name, 'someMethod');
            assert.equal(methodDefinition.args.length, 2);
            assert.equal(methodDefinition.args[0], 'arg1');
            assert.equal(methodDefinition.args[1], 'arg2');
        });

        it('should parse a method with a qualifier', () => {
            class TestService {
                someMethod(arg1, @Qualifier('qualified') arg2) {}
            }

            let methodDefinition: ServiceMethodDefinition = AnnotationParserUtil.parseServiceMethod(TestService.prototype, 'someMethod');
            assert.equal(methodDefinition.name, 'someMethod');
            assert.equal(methodDefinition.args.length, 2);
            assert.equal(methodDefinition.args[0], 'arg1');
            assert.equal(methodDefinition.args[1], 'qualified');
        });
    });

    describe('#parseServiceMethods', () => {
        it('should parse all PostConstruct annotated methods', () => {
            class TestService {
                @PostConstruct()
                someMethod1(arg1) {}

                @PostConstruct()
                someMethod2() {}

                someMethod3(arg1) {}
            }

            let methods: ServiceMethodDefinition[] = AnnotationParserUtil.parseServiceMethods(PostConstructKey, TestService.prototype);
            assert.equal(methods.length, 2);
            assert.deepInclude(methods, {name: 'someMethod1', args: ['arg1']});
            assert.deepInclude(methods, {name: 'someMethod2', args: []});
        });

        it('should parse all PostConstruct annotated methods with qualifiers', () => {
            class TestService {
                @PostConstruct()
                someMethod1(arg1, @Qualifier('qualified') arg2) {}

                @PostConstruct()
                someMethod2() {}

                someMethod3(arg1) {}
            }

            let methods: ServiceMethodDefinition[] = AnnotationParserUtil.parseServiceMethods(PostConstructKey, TestService.prototype);
            assert.equal(methods.length, 2);
            assert.deepInclude(methods, {name: 'someMethod1', args: ['arg1', 'qualified']});
            assert.deepInclude(methods, {name: 'someMethod2', args: []});
        });

        it('should parse all Inject annotated methods', () => {
            class TestService {
                @Inject()
                someMethod1(arg1, @Qualifier('qualified') arg2) {}

                @Inject()
                someMethod2() {}

                someMethod3(arg1) {}
            }

            let methods: ServiceMethodDefinition[] = AnnotationParserUtil.parseServiceMethods(InjectKey, TestService.prototype);
            assert.equal(methods.length, 2);
            assert.deepInclude(methods, {name: 'someMethod1', args: ['arg1', 'qualified']});
            assert.deepInclude(methods, {name: 'someMethod2', args: []});
        });
    });

    describe('#parseService', () => {
        it('should parse a service', () => {
            class TestService {
                constructor(arg1, @Qualifier('qualified') arg2) {}

                @Inject()
                injectMethod(arg1) {}

                @PostConstruct()
                postConstruct() {}
            }

            let service: ServiceDefinition = AnnotationParserUtil.parseService(TestService);
            assert.equal(service.name, 'testService');
            assert.equal(service.args.length, 2);
            assert.equal(service.fn, TestService);
            assert.equal(service.injectMethods.length, 1);
            assert.equal(service.postConstructMethods.length, 1);
        });

        it('should parse an annotated service', () => {
            @Service('serviceName')
            class TestService {
                constructor(arg1, @Qualifier('qualified') arg2) {}

                @Inject()
                injectMethod(arg1) {}

                @PostConstruct()
                postConstruct() {}
            }

            let service: ServiceDefinition = AnnotationParserUtil.parseService(TestService);
            assert.equal(service.name, 'serviceName');
            assert.equal(service.args.length, 2);
            assert.equal(service.fn, TestService);
            assert.equal(service.injectMethods.length, 1);
            assert.equal(service.postConstructMethods.length, 1);
        });
    });
});