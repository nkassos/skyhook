class ServiceDefinition {

    name: String;
    factory: Function;
    dependencies: Array<String>;

    constructor(name: String, factory, dependencies: Array<String> = []) {
        this.name = name;
        this.factory = factory;
        this.dependencies = dependencies;
    }

}

export default ServiceDefinition;
