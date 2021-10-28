import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { SkyhookContext } from '../SkyhookContext';
import { initService } from './initService';

export async function initializeServices(serviceDefinitions: ServiceDefinition[]): Promise<SkyhookContext> {
    const context = new SkyhookContext();
    for await(let serviceDefinition of serviceDefinitions) {
        const service = await initService(serviceDefinition, context);
        context.addService(serviceDefinition.name, service);
    }

    return context;
}