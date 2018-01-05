import { assert } from 'chai';
import ServiceDefinition from "src/loaders/AnnotationLoader/ServiceDefinition";
import ServiceUtil from "src/loaders/AnnotationLoader/util/ServiceUtil";

class TestService {
    constructorArgValue: String;
    injectMethodArgValue: String;
    postConstructMethodArgValue: String;

    constructor(constructorArg1: String) {
        this.constructorArgValue = constructorArg1;
    }

    injectMethod(injectMethodArg1: String) {
        this.injectMethodArgValue = injectMethodArg1;
    }

    postConstructMethod(postConstructMethodArg1: String) {
        this.postConstructMethodArgValue = postConstructMethodArg1;
    }
}

let serviceDefinition: ServiceDefinition = {
    name: 'testService',
    args: ['constructorArg1'],
    fn: TestService,
    injectMethods: [{
        name: 'injectMethod',
        args: ['injectMethodArg1']
    }],
    postConstructMethods: [{
        name: 'postConstructMethod',
        args: ['postConstructMethodArg1']
    }]
};

describe('ServiceUtil', () => {
    describe('#buildServiceArgList', () => {
        it('should build an args list', () => {
            let args = ServiceUtil.buildServiceArgList(serviceDefinition);
            assert.equal(args.length, 3);
            assert.include(args, 'constructorArg1');
            assert.include(args, 'injectMethodArg1');
            assert.include(args, 'postConstructMethodArg1');
        });
    });

    describe('#runServiceMethod', () => {
        it('should run an inject method', () => {
            let service = new TestService('constructorArgValue');
            assert.notOk(service.injectMethodArgValue);

            let values = new Map();
            values.set('injectMethodArg1', 'injectMethodArg1Value');
            ServiceUtil.runServiceMethod(service, serviceDefinition.injectMethods[0], values);
            assert.equal(service.injectMethodArgValue, 'injectMethodArg1Value');
        });

        it('should run a postConstruct method', () => {
            let service = new TestService('constructorArgValue');
            assert.notOk(service.postConstructMethodArgValue);

            let values = new Map();
            values.set('postConstructMethodArg1', 'postConstructMethodArg1Value');
            ServiceUtil.runServiceMethod(service, serviceDefinition.postConstructMethods[0], values);
            assert.equal(service.postConstructMethodArgValue, 'postConstructMethodArg1Value');
        });
    });

    describe('#initializeService', () => {
        it('should initialize a service', () => {
            let args = new Map();
            args.set('constructorArg1', 'constructorArgValue');
            args.set('injectMethodArg1', 'injectMethodArgValue');
            args.set('postConstructMethodArg1', 'postConstructMethodArgValue');

            let service = ServiceUtil.initializeService(serviceDefinition, args);
            assert.equal(service.constructorArgValue, 'constructorArgValue');
            assert.equal(service.injectMethodArgValue, 'injectMethodArgValue');
            assert.equal(service.postConstructMethodArgValue, 'postConstructMethodArgValue');
        });
    });
});
