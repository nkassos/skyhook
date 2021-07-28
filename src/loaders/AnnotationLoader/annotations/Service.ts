import 'reflect-metadata';
import ServiceKey from '../symbols/ServiceKey';
import AnnotationParserUtil from '../util/AnnotationParserUtil';

interface Service {
    (constructory: Function): any;
    (target: Object, name: string, descriptor?: PropertyDescriptor): any;
}

function Service(serviceName = null) {
    let service: Service = (target: Function | Object, methodName?: string) => {
        if(target instanceof Function) {
            let name = serviceName ?
                serviceName :
                AnnotationParserUtil.parseServiceName(target);
            if(!Reflect.hasMetadata(ServiceKey, target.prototype)) {
                Reflect.defineMetadata(ServiceKey, name, target.prototype);
            }
        } else {
            let name = serviceName ?
                serviceName :
                methodName;
            Reflect.defineMetadata(ServiceKey, name, target, methodName);
        }
    };
    return service;
}

export default Service;
