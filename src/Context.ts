class Context {

    services: Map<String, Object>;
    interceptors: Map<String, Set<Function>>;

    constructor() {
        this.services = new Map();
        this.interceptors = new Map();
    }

    addService(name: String, service: Object): Context {
        if(this.services.has(name)) {
            throw new Error(`Service ${name} already exists`);
        }

        this.services.set(name, service);
        return this;
    }

    addInterceptor<T>(serviceName: String, interceptor: (service: T) => T): Context {
        let interceptorSet = this.interceptors.get(serviceName) || new Set();
        interceptorSet.add(interceptor);
        this.interceptors.set(serviceName, interceptorSet);
        return this;
    }

    get(name: String): any {
        if(!this.services.has(name)) {
            throw new Error(`Service ${name} not found`);
        }

        return this.services.get(name);
    }

}

export default Context;
