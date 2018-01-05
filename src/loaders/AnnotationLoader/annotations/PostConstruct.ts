import 'reflect-metadata';
import PostConstructKey from '../symbols/PostConstructKey';

function PostConstruct() {
    return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
        let postConstructMethods: string[] = Reflect.hasMetadata(PostConstructKey, target) ?
            Reflect.getMetadata(PostConstructKey, target) :
            [];
        if(postConstructMethods.indexOf(methodName) == -1) {
            postConstructMethods.push(methodName);
        }
        Reflect.defineMetadata(PostConstructKey, postConstructMethods, target);
    };
}

export default PostConstruct;
