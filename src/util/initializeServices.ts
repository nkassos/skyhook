import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { SkyhookContext } from '../SkyhookContext';
import { initService } from './initService';

export async function initializeServices<T, K extends keyof T>(serviceDefinitions: ServiceDefinition<T, K>[]): Promise<SkyhookContext<T>> {
    const services: Map<K, T[K]> = new Map();
    for await(let serviceDefinition of serviceDefinitions) {
        const service = await initService<T, K>(serviceDefinition, services);
        services.set(serviceDefinition.name, service);
    }

    return new SkyhookContext<T>(services);
}