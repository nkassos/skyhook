import { SkyhookContext } from './SkyhookContext';
import type { ServiceDefinition } from './domain/ServiceDefinition';
import { initializeServices } from './util/initializeServices';
import { getDependencyOrder } from './util/getDependencyOrder';

export class Skyhook {

    services: Map<string, ServiceDefinition>;

    constructor() {
        this.services = new Map();
    }

    addService(name: string, factory: Function, dependencies: Array<string> = []) {
        if(this.services.has(name)) {
            throw new Error(`Dependency ${name} already present`);
        } else {
            this.services.set(name, { name, factory, dependencies });
        }
    }

    async initialize(): Promise<SkyhookContext> {
        const dependencyOrder = getDependencyOrder(this.services);
        const serviceDefinitions: ServiceDefinition[] = [];
        for(const serviceName of dependencyOrder) {
            serviceDefinitions.push(this.services.get(serviceName));
        }

        const context = await initializeServices(serviceDefinitions);

        return context;
    }
}
