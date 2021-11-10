export class SkyhookContext<T> {

    services: Map<keyof T, T[keyof T]>;
    interceptors: Map<keyof T, Set<(service: T[keyof T]) => T[keyof T]>>;

    constructor() {
        this.services = new Map();
        this.interceptors = new Map();
    }

    addService<K extends keyof T>(name: K, service: T[K]): SkyhookContext<T> {
        if(this.services.has(name)) {
            throw new Error(`Service ${name} already exists`);
        }

        this.services.set(name, service);
        return this;
    }

    addInterceptor<K extends keyof T>(serviceName: K, interceptor: (service: T[K]) => T[K]): SkyhookContext<T> {
        let interceptorSet = this.interceptors.get(serviceName) || new Set();
        interceptorSet.add(interceptor);
        this.interceptors.set(serviceName, interceptorSet);
        return this;
    }

    get<K extends keyof T>(name: K): T[K] {
        if(!this.services.has(name)) {
            throw new Error(`Service ${name} not found`);
        }

        return this.services.get(name) as T[K];
    }

}
