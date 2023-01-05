import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { SkyhookContext } from '../SkyhookContext';
import { initService } from './initService';

export async function initializeServices<T>(serviceDefinitions: ServiceDefinition<T>[]): Promise<SkyhookContext<T>> {
    const services: Partial<T> = {};
    for await(let serviceDefinition of serviceDefinitions) {
        const service = await initService<T>(serviceDefinition, services);
        services[serviceDefinition.name] = service;
    }

    return new SkyhookContext<T>(services);
}