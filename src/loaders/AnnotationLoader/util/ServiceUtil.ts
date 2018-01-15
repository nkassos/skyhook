import * as _ from "lodash";
import each from 'async/each';
import ServiceDefinition from "../ServiceDefinition";
import ServiceMethodDefinition from "../ServiceMethodDefinition";

export default class ServiceUtil {
    static buildServiceArgList(serviceDefinition: ServiceDefinition): string[] {
        let args = _.concat([], serviceDefinition.args);
        _.each(serviceDefinition.injectMethods, (injectMethod) => {
            args = _.union(args, injectMethod.args);
        });
        _.each(serviceDefinition.postConstructMethods, (postConstructMethod) => {
            args = _.union(args, postConstructMethod.args);
        });
        return args;
    };

    static runServiceMethod(service: Object, methodDefinition: ServiceMethodDefinition, args: Map<String, any>) {
        let methodArgs = [];
        _.each(methodDefinition.args, (arg) => {
            methodArgs.push(args.get(arg));
        });

        return service[methodDefinition.name].apply(service, methodArgs);
    };

    static initializeService(serviceDefinition: ServiceDefinition, args: Map<String, any>): Promise<any> {
        let constructorArgs = [];
        _.each(serviceDefinition.args, (arg) => {
            constructorArgs.push(args.get(arg));
        });
        let serviceConstructor: any = serviceDefinition.fn;
        let service = new serviceConstructor(...constructorArgs);

        _.each(serviceDefinition.injectMethods, (injectMethod) => {
            ServiceUtil.runServiceMethod(service, injectMethod, args);
        });

        let postConstructMethods = [];
        _.each(serviceDefinition.postConstructMethods, (postConstructMethod) => {
            postConstructMethods.push(Promise.resolve().then(() => {
                return ServiceUtil.runServiceMethod(service, postConstructMethod, args);
            }));
        });
        return Promise.all(postConstructMethods).then(() => {
            return service;
        });

        //return service;
    };
}