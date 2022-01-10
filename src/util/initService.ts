import { ServiceDefinition } from '../domain/ServiceDefinition';

export async function initService<T, K extends keyof T>(serviceDefinition: ServiceDefinition<T, K>, context: Map<K, T[K]>): Promise<T[K]> {
    const args: Array<T[K]> = [];
    serviceDefinition.dependencies.forEach((dependencyName) => {
        args.push(context.get(dependencyName));
    });

    return Promise.resolve().then(() => serviceDefinition.factory.apply({}, args));
}
