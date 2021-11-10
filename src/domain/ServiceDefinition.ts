import type { ServiceFactory } from '../domain/ServiceFactory';

export interface ServiceDefinition<T, K extends keyof T> {

    name: K;
    factory: ServiceFactory<T, K>;
    dependencies: Array<K>;

}
