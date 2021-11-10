import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { SkyhookContext } from '../SkyhookContext';
import { initService } from './initService';

export async function initializeServices<T, K extends keyof T>(serviceDefinitions: ServiceDefinition<T, K>[]): Promise<SkyhookContext<T>> {
    const context = new SkyhookContext<T>();
    for await(let serviceDefinition of serviceDefinitions) {
        const service = await initService<T, K>(serviceDefinition, context);
        context.addService(serviceDefinition.name, service);
    }

    return context;
}