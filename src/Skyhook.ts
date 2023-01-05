import type { ServiceFactory } from './domain/ServiceFactory';
import type { ServiceDefinition } from './domain/ServiceDefinition';
import { SkyhookContext } from './SkyhookContext';
import { initializeServices } from './util/initializeServices';
import { getDependencyOrder } from './util/getDependencyOrder';


export class Skyhook<T> {

    services: Map<keyof T, ServiceDefinition<T>>;

    constructor() {
        this.services = new Map();
    }

    // addService<K extends Extract<keyof T, string>>(
    addService<K extends keyof T>(
        name: K,
        factory: ServiceFactory<T, K>,
        dependencies: Array<keyof T> = []) {

        this.services.set(name, {
            name,
            factory,
            dependencies
        });
    }

    async initialize(): Promise<SkyhookContext<T>> {
        const dependencyOrder = getDependencyOrder(this.services);
        const serviceDefinitions: ServiceDefinition<T>[] = [];
        for(const serviceName of dependencyOrder) {
            serviceDefinitions.push(this.services.get(serviceName as keyof T));
        }

        const context = await initializeServices(serviceDefinitions);

        return context;
    }
}
