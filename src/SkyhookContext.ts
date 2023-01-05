export class SkyhookContext<T> {

    private readonly services: Partial<T>;
    private readonly interceptors: Map<keyof T, Set<(service: T[keyof T]) => T[keyof T]>>;

    constructor(
        services: Partial<T>,
        interceptors?: Map<keyof T, Set<(service: T[keyof T]) => T[keyof T]>>) {

        this.services = services;
        this.interceptors = interceptors;
    }
    
    // addInterceptor<K extends keyof T>(serviceName: K, interceptor: (service: T[K]) => T[K]): SkyhookContext<T> {
    //     let interceptorSet = this.interceptors.get(serviceName) || new Set();
    //     interceptorSet.add(interceptor);
    //     this.interceptors.set(serviceName, interceptorSet);
    //     return this;
    // }

    get<K extends keyof T>(name: K): T[K] {
        if(!this.services[name]) {
            throw new Error(`Service ${name} not found`);
        }

        return this.services[name] as T[K];
    }

}
