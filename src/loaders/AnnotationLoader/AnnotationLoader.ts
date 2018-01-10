import Skyhook from '../../Skyhook';
import LoadingDock from '../../LoadingDock';
import AnnotationParserUtil from './util/AnnotationParserUtil';
import * as _ from 'lodash';
import ServiceDefinition from "./ServiceDefinition";
import ServiceUtil from './util/ServiceUtil';
import Factory from "./annotations/Factory";
import FactoryKey from "./symbols/FactoryKey";
import FactoryDefinition from "./FactoryDefinition";

class AnnotationLoader implements LoadingDock {

    services: Function[];

    constructor(services?: any[]) {
        if(!services) {
            services = [];
        }

        this.services = services;
    }

    addService(service: any): AnnotationLoader {
        this.services.push(service);
        return this;
    }

    load(skyhook?: Skyhook): Skyhook {
        if(!skyhook) {
            skyhook = new Skyhook();
        }

        let serviceDefinitions: ServiceDefinition[] = [];
        let serviceFactories: FactoryDefinition[] = [];
        _.each(this.services, (service: Function) => {
            if(Reflect.hasMetadata(FactoryKey, service)) {
                let factories = AnnotationParserUtil.parseFactory(service);
                _.each(factories, (factory) => {
                    serviceFactories.push(factory);
                });
            } else {
                serviceDefinitions.push(AnnotationParserUtil.parseService(service));
            }
        });

        _.each(serviceDefinitions, (serviceDefinition: ServiceDefinition) => {
            let args: string[] = ServiceUtil.buildServiceArgList(serviceDefinition);
            skyhook.addService(serviceDefinition.name, (...serviceArgs) => {
                let argValues = new Map<string, any>();
                _.each(args, (arg, index) => {
                    argValues.set(arg, serviceArgs[index]);
                });

                let service = ServiceUtil.initializeService(serviceDefinition, argValues);
                return service;
            }, args);
        });

        _.each(serviceFactories, (serviceFactory: FactoryDefinition) => {
            skyhook.addService(serviceFactory.name, (...serviceArgs) => {
                return Promise.resolve().then(() => {
                    return serviceFactory.fn.apply(null, serviceArgs);
                });
            }, serviceFactory.args);
        });

        return skyhook;
    }

}

export default AnnotationLoader;