import 'reflect-metadata';
import QualifierKey from '../symbols/QualifierKey';

function Qualifier(name: string) {
    return (target: Object, methodName: string, propertyIndex?: number) => {
        if(typeof propertyIndex === 'number') {
            let qualifiers: string[] = Reflect.hasMetadata(QualifierKey, target, methodName) ?
                Reflect.getMetadata(QualifierKey, target, methodName) :
                [];

            qualifiers[propertyIndex] = name;
            Reflect.defineMetadata(QualifierKey, qualifiers, target, methodName);
        } else {
            Reflect.defineMetadata(QualifierKey, name, target, methodName);
        }
    };
}

export default Qualifier;