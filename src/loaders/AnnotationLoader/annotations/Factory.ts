import 'reflect-metadata';
import FactoryKey from '../symbols/FactoryKey';

function Factory() {
    return (target: Function) => {
        Reflect.defineMetadata(FactoryKey, FactoryKey, target.prototype);
    };
}

export default Factory;