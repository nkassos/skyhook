import 'reflect-metadata';
import ServiceKey from '../symbols/ServiceKey';
import AnnotationParserUtil from '../util/AnnotationParserUtil';

function Service(serviceName = null) {
    return (constructor: Function) => {
        let name = serviceName ?
            serviceName :
            AnnotationParserUtil.parseServiceName(constructor);
        if(!Reflect.hasMetadata(ServiceKey, constructor.prototype)) {
            Reflect.defineMetadata(ServiceKey, name, constructor.prototype);
        }
    };
}

export default Service;
