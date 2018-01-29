import 'reflect-metadata';
import InjectKey from '../symbols/InjectKey';
import PropertyKey from '../symbols/PropertyKey';

function Inject() {
    return (target: Object, methodName: string, descriptor?: PropertyDescriptor) => {
        let key = typeof target[methodName] === 'function' ? InjectKey : PropertyKey;
        let injectMethods: string[] = Reflect.hasMetadata(key, target) ?
            Reflect.getMetadata(key, target) :
            [];
        if (injectMethods.indexOf(methodName) == -1) {
            injectMethods.push(methodName);
        }
        Reflect.defineMetadata(key, injectMethods, target);
    };
}

export default Inject;