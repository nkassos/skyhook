import InjectKey from "../symbols/InjectKey";
import ServiceDefinition from "../ServiceDefinition";
import ServiceKey from "../symbols/ServiceKey";
import PostConstructKey from "../symbols/PostConstructKey";
import * as _ from "lodash";
import QualifierKey from "../symbols/QualifierKey";
import FunctionParser from 'function-parser';
import ServiceMethodDefinition from "../ServiceMethodDefinition";

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
        let fnArgs = functionParser.parseFunction(methodName ? target[methodName] : target);
        _.each(fnArgs, (fnArg, argIndex) => {
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

    static parseService(constructor: Function): ServiceDefinition {
        let serviceName = Reflect.hasMetadata(ServiceKey, constructor.prototype) ?
            Reflect.getMetadata(ServiceKey, constructor.prototype) :
            AnnotationParserUtil.parseServiceName(constructor);

        let serviceDefinition: ServiceDefinition = {
            name: serviceName,
            args: AnnotationParserUtil.parseQualifiers(constructor),
            fn: constructor,
            injectMethods: AnnotationParserUtil.parseServiceMethods(InjectKey, constructor.prototype),
            postConstructMethods: AnnotationParserUtil.parseServiceMethods(PostConstructKey, constructor.prototype)
        };

        return serviceDefinition;
    }
}

export default AnnotationParserUtil;