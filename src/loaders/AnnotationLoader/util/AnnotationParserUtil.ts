import 'reflect-metadata';
import InjectKey from '../symbols/InjectKey';
import PropertyKey from '../symbols/PropertyKey';
import ServiceDefinition from '../ServiceDefinition';
import ServiceKey from '../symbols/ServiceKey';
import PostConstructKey from '../symbols/PostConstructKey';
import * as _ from 'lodash';
import QualifierKey from '../symbols/QualifierKey';
import FunctionParser from 'function-parser';
import ServiceMethodDefinition from '../ServiceMethodDefinition';
import FactoryDefinition from '../FactoryDefinition';
import ServicePropertyDefinition from '../ServicePropertyDefinition';

class AnnotationParserUtil {
    static parseServiceName(constructor: Function): String {
        return constructor.name.charAt(0).toLowerCase() + constructor.name.substr(1);
    }

    static parseQualifiers(target: Function);                       // For constructors
    static parseQualifiers(target: Object, methodName: string);     // For instance methods
    static parseQualifiers(target: Function | Object, methodName?: string): string[] {
        let args: string[] = [];
        let functionParser = new FunctionParser();
        let qualifiedArgs: string[] = Reflect.hasMetadata(QualifierKey, target, methodName) ?
            Reflect.getMetadata(QualifierKey, target, methodName) :
            [];
        let fnArgs = functionParser.parseFunctionArguments(methodName ? target[methodName] : target);
        fnArgs.forEach((fnArg, argIndex) => {
            if(qualifiedArgs[argIndex]) {
                args.push(qualifiedArgs[argIndex]);
            } else {
                args.push(fnArg);
            }
        });

        return args;
    };

    static parseServiceMethod(target: Object, methodName: string): ServiceMethodDefinition {
        let serviceMethodArgs = AnnotationParserUtil.parseQualifiers(
            target,
            methodName);
        return {
            name: methodName,
            args: serviceMethodArgs
        };
    };

    static parseServiceMethods = (key: Symbol, target: Object): ServiceMethodDefinition[] => {
        let serviceMethods: ServiceMethodDefinition[] = [];
        if(Reflect.hasMetadata(key, target)) {
            let methods = Reflect.getMetadata(key, target);

            _.each(methods, (method) => {
                serviceMethods.push(AnnotationParserUtil.parseServiceMethod(target, method));
            });
        }
        return serviceMethods;
    };

    static parseServiceProperties(target: Object): ServicePropertyDefinition[] {
        let serviceProperties: ServicePropertyDefinition[] = [];
        if(Reflect.hasMetadata(PropertyKey, target)) {
            let properties = Reflect.getMetadata(PropertyKey, target);
            _.each(properties, (propertyName: string) => {
                let serviceName = Reflect.hasMetadata(QualifierKey, target, propertyName) ?
                    Reflect.getMetadata(QualifierKey, target, propertyName) :
                    propertyName;
                serviceProperties.push({
                    name: propertyName,
                    serviceName: serviceName
                });
            });
        }

        return serviceProperties;
    }

    static createServiceFactory(args: string[]): Function {
        return (...serviceArgs) => {
            let argValues = new Map<string, any>();
            _.each(args, (arg, index) => {
                argValues.set(arg, serviceArgs[index]);
            });
        }
    }

    static parseService(constructor: Function): ServiceDefinition {
        let serviceName = Reflect.hasMetadata(ServiceKey, constructor.prototype) ?
            Reflect.getMetadata(ServiceKey, constructor.prototype) :
            AnnotationParserUtil.parseServiceName(constructor);

        let serviceDefinition: ServiceDefinition = {
            name: serviceName,
            args: AnnotationParserUtil.parseQualifiers(constructor),
            fn: constructor,
            properties: AnnotationParserUtil.parseServiceProperties(constructor.prototype),
            injectMethods: AnnotationParserUtil.parseServiceMethods(InjectKey, constructor.prototype),
            postConstructMethods: AnnotationParserUtil.parseServiceMethods(PostConstructKey, constructor.prototype)
        };

        return serviceDefinition;
    }

    static parseFactory(constructor: Function): FactoryDefinition[] {
        let factoryContructor: any = constructor;
        let factory: any = new factoryContructor();

        let serviceFactories: FactoryDefinition[] = [];
        let target = constructor.prototype;
        _.each(Object.getOwnPropertyNames(target), (prop) => {
            if(_.isFunction(target[prop]) && Reflect.hasMetadata(ServiceKey, target, prop)) {
                let factoryDefinition: FactoryDefinition = {
                    name: Reflect.getMetadata(ServiceKey, target, prop),
                    args: AnnotationParserUtil.parseQualifiers(target, prop),
                    fn: target[prop].bind(factory)
                };
                serviceFactories.push(factoryDefinition);
            }
        });

        return serviceFactories;
    }
}

export default AnnotationParserUtil;