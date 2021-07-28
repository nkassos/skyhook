import ServiceDefinition from "../ServiceDefinition";
import Context from "../Context";
import {initService} from "./initService";

export async function initializeServices(serviceDefinitions: ServiceDefinition[]): Promise<Context> {
    const context = new Context();
    for await(let serviceDefinition of serviceDefinitions) {
        const service = await initService(serviceDefinition, context);
        context.addService(serviceDefinition.name, service);
    }

    return context;
}