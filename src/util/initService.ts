import { ServiceDefinition } from '../domain/ServiceDefinition';

export async function initService<T>(serviceDefinition: ServiceDefinition<T>, context: Partial<T>): Promise<ReturnType<ServiceDefinition<T>['factory']>> {
    const args: Array<T[keyof T]> = [];
    serviceDefinition.dependencies.forEach((dependencyName) => {
        args.push(context[dependencyName]);
    });

    return Promise.resolve().then(() => serviceDefinition.factory.apply({}, args));
}
