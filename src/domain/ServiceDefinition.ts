export interface ServiceDefinition {

    name: string;
    factory: Function;
    dependencies: Array<string>;

}
