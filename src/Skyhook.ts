import Context from './Context';
import ServiceDefinition from './ServiceDefinition';
import {initializeServices} from "./util/initializeServices";
import {getDependencyOrder} from "./util/getDependencyOrder";

class Skyhook {

    services: Map<string, ServiceDefinition>;

    constructor() {
        this.services = new Map();
    }

    addService(name: string, factory: Function, dependencies: Array<string> = []) {
        if(this.services.has(name)) {
            throw new Error(`Dependency ${name} already present`);
        } else {
            this.services.set(name, new ServiceDefinition(name, factory, dependencies));
        }
    }

    async initialize(): Promise<Context> {
        const dependencyOrder = getDependencyOrder(this.services);
        const serviceDefinitions: ServiceDefinition[] = [];
        for(const serviceName of dependencyOrder) {
            serviceDefinitions.push(this.services.get(serviceName));
        }

        const context = await initializeServices(serviceDefinitions);

        return context;
    }
}

export default Skyhook;
