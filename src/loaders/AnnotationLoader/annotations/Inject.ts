import 'reflect-metadata';
import InjectKey from '../symbols/InjectKey';

function Inject() {
    return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
        let injectMethods: string[] = Reflect.hasMetadata(InjectKey, target) ?
            Reflect.getMetadata(InjectKey, target) :
            [];
        if(injectMethods.indexOf(methodName) == -1) {
            injectMethods.push(methodName);
        }
        Reflect.defineMetadata(InjectKey, injectMethods, target);
    };
}

export default Inject;