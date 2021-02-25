class ServiceDefinition {

    name: string;
    factory: Function;
    dependencies: Array<string>;

    constructor(name: string, factory, dependencies: Array<string> = []) {
        this.name = name;
        this.factory = factory;
        this.dependencies = dependencies;
    }

}

export default ServiceDefinition;
