import Context from "../Context";
import ServiceDefinition from "../ServiceDefinition";

export async function initService(serviceDefinition: ServiceDefinition, context: Context): Promise<any> {
    var args: Array<Object> = [];
    serviceDefinition.dependencies.forEach((dependencyName) => {
        args.push(context.get(dependencyName));
    });

    return Promise.resolve().then(() => serviceDefinition.factory.apply({}, args));
}
