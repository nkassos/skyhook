import { SkyhookContext } from '../SkyhookContext';
import { ServiceDefinition } from '../domain/ServiceDefinition';

export async function initService<T, K extends keyof T>(serviceDefinition: ServiceDefinition<T, K>, context: SkyhookContext<T>): Promise<T[K]> {
    const args: Array<T[K]> = [];
    serviceDefinition.dependencies.forEach((dependencyName) => {
        args.push(context.get(dependencyName));
    });

    return Promise.resolve().then(() => serviceDefinition.factory.apply({}, args));
}
