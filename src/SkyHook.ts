import { DependencyGraph } from 'dependency-graph/dist';
import Context from './Context';
import ServiceDefinition from './ServiceDefinition';
import * as _ from 'lodash';
import * as async from 'async';

class SkyHook {

    services: Map<String, ServiceDefinition>;

    constructor() {
        this.services = new Map();
    }

    addService(name: String, factory: Function, dependencies: Array<String> = []) {
        if(this.services.has(name)) {
            throw 'idiot';
        } else {
            this.services.set(name, new ServiceDefinition(name, factory, dependencies));
        }
    }

    initialize(): Promise<Context> {
        let services = this.services;

        let initService: Function = (context: Context, serviceDefinition: ServiceDefinition): Promise<Object> => {
            return Promise.resolve().then((): Object => {
                var args: Array<Object> = [];
                _.each(serviceDefinition.dependencies, (dependencyName: String) => {
                    args.push(context.get(dependencyName));
                });
                return serviceDefinition.factory.apply({}, args);
            });
        };

        return Promise.resolve().then((): Array<String> => {
            let dependencyGraph = new DependencyGraph();
            //add nodes
            let serviceNames = services.keys();
            for (let serviceName of serviceNames) {
                dependencyGraph.addNode(serviceName);
            }

            // add edges
            services.forEach((value, key, map) => {
                dependencyGraph.addNode(key);
                _.each(value.dependencies, (dependencyName) => {
                    dependencyGraph.addEdge(dependencyName, key);
                });
            });

            return dependencyGraph.getOrder();
        }).then((order: Array<String>): Array<ServiceDefinition> => {
            let serviceDefinitions: Array<ServiceDefinition> = [];
            _.each(order, (serviceName: String) => {
                serviceDefinitions.push(services.get(serviceName));
            });
            return serviceDefinitions;
        }).then((serviceDefinitions: Array<ServiceDefinition>): Promise<Context> => {
            return new Promise<Context>((resolve, reject) => {
                let context = new Context();
                async.eachSeries(serviceDefinitions, (serviceDefinition: ServiceDefinition, cb: Function) => {
                    initService(context, serviceDefinition).then((service: Object) => {
                        context.addService(serviceDefinition.name, service);
                        cb();
                    }).catch((err) => {
                        cb(err);
                    });
                }, (err) => {
                    if(err) {
                        reject(err);
                    }

                    resolve(context);
                });
            });
        });
    }
}

export default SkyHook;
