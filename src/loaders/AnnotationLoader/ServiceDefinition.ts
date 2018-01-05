import ServiceMethodDefinition from './ServiceMethodDefinition';

interface ServiceDefinition {
    name: string;
    args: string[];
    fn: Function;
    injectMethods: ServiceMethodDefinition[];
    postConstructMethods: ServiceMethodDefinition[];
};

export default ServiceDefinition;