import ServiceMethodDefinition from './ServiceMethodDefinition';
import ServicePropertyDefinition from './ServicePropertyDefinition';

interface ServiceDefinition {
    name: string;
    args: string[];
    fn: Function;
    properties: ServicePropertyDefinition[];
    injectMethods: ServiceMethodDefinition[];
    postConstructMethods: ServiceMethodDefinition[];
};

export default ServiceDefinition;