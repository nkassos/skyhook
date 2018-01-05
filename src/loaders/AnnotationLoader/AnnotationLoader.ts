import SkyHook from '../../SkyHook';
import LoadingDock from '../../LoadingDock';
import AnnotationParserUtil from './util/AnnotationParserUtil';
import * as _ from 'lodash';
import ServiceDefinition from "./ServiceDefinition";
import ServiceUtil from './util/ServiceUtil';

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

    load(skyhook?: SkyHook): SkyHook {
        if(!skyhook) {
            skyhook = new SkyHook();
        }

        let serviceDefinitions: ServiceDefinition[] = [];
        _.each(this.services, (service: Function) => {
            serviceDefinitions.push(AnnotationParserUtil.parseService(service));
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

        return skyhook;
    }

}

export default AnnotationLoader;