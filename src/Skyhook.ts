import { DependencyGraph } from 'potpourri';
import Context from './Context';
import ServiceDefinition from './ServiceDefinition';
import * as async from 'async';

class Skyhook {

    services: Map<string, ServiceDefinition>;

    constructor() {
        this.services = new Map();
    }

    addService(name: string, factory: Function, dependencies: Array<string> = []) {
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
                serviceDefinition.dependencies.forEach((dependencyName) => {
                    args.push(context.get(dependencyName));
                });
                return serviceDefinition.factory.apply({}, args);
            });
        };

        return Promise.resolve().then((): IterableIterator<string> => {
            let dependencyGraph = new DependencyGraph();
            //add nodes
            let serviceNames = services.keys();
            for (let serviceName of serviceNames) {
                dependencyGraph.addNode(serviceName.toString());
            }

            // add edges
            services.forEach((value, key, map) => {
                dependencyGraph.addNode(key);

                value.dependencies.forEach((dependencyName) => {
                    dependencyGraph.addEdge(dependencyName, key);
                });
            });

            return dependencyGraph.getOrder();
        }).then((order: IterableIterator<string>): Array<ServiceDefinition> => {
            let serviceDefinitions: Array<ServiceDefinition> = [];
            for(let serviceName of order) {
                serviceDefinitions.push(services.get(serviceName));
            }
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

export default Skyhook;
