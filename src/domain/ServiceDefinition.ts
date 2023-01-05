import type { ServiceFactory } from '../domain/ServiceFactory';

export interface ServiceDefinition<T> {

    name: keyof T;
    factory: ServiceFactory<T, ServiceDefinition<T>['name']>;
    dependencies: Array<keyof T>;

}
