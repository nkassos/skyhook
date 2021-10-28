import { SkyhookContext } from '../SkyhookContext';
import { ServiceDefinition } from '../domain/ServiceDefinition';

export async function initService(serviceDefinition: ServiceDefinition, context: SkyhookContext): Promise<any> {
    var args: Array<Object> = [];
    serviceDefinition.dependencies.forEach((dependencyName) => {
        args.push(context.get(dependencyName));
    });

    return Promise.resolve().then(() => serviceDefinition.factory.apply({}, args));
}
