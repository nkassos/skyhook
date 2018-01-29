import { assert } from 'chai';
import ServiceDefinition from "src/loaders/AnnotationLoader/ServiceDefinition";
import ServiceUtil from "src/loaders/AnnotationLoader/util/ServiceUtil";

class TestService {
    constructorArgValue: string;
    injectMethodArgValue: string;
    postConstructMethodArgValue: string;

    injectProperty: string;

    constructor(constructorArg1: string) {
        this.constructorArgValue = constructorArg1;
    }

    injectMethod(injectMethodArg1: string) {
        this.injectMethodArgValue = injectMethodArg1;
    }

    postConstructMethod(postConstructMethodArg1: string) {
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
    }],
    properties: [{
        name: 'injectProperty',
        serviceName: 'injectProperty'
    }]
};

describe('ServiceUtil', () => {
    describe('#buildServiceArgList', () => {
        it('should build an args list', () => {
            let args = ServiceUtil.buildServiceArgList(serviceDefinition);
            assert.equal(args.length, 4);
            assert.include(args, 'constructorArg1');
            assert.include(args, 'injectMethodArg1');
            assert.include(args, 'postConstructMethodArg1');
            assert.include(args, 'injectProperty');
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
        it('should initialize a service', (cb) => {
            let args = new Map();
            args.set('constructorArg1', 'constructorArgValue');
            args.set('injectMethodArg1', 'injectMethodArgValue');
            args.set('postConstructMethodArg1', 'postConstructMethodArgValue');
            args.set('injectProperty', 'injectPropertyValue');

            ServiceUtil.initializeService(serviceDefinition, args).then((service) => {
                assert.equal(service.constructorArgValue, 'constructorArgValue');
                assert.equal(service.injectProperty, 'injectPropertyValue');
                assert.equal(service.injectMethodArgValue, 'injectMethodArgValue');
                assert.equal(service.postConstructMethodArgValue, 'postConstructMethodArgValue');
                cb();
            }).catch((err) => {
                cb(err);
            });
        });
    });
});
