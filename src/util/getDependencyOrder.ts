import { DependencyGraph } from 'potpourri';
import type { ServiceDefinition } from '../domain/ServiceDefinition';

export function getDependencyOrder<T>(services: Map<keyof T, ServiceDefinition<T, keyof T>>): IterableIterator<string> {
    const dependencyGraph = new DependencyGraph();
    services.forEach((serviceDefinition, serviceName) => {
        dependencyGraph.addNode(serviceName as string);
    });

    services.forEach((serviceDefinition, serviceName) => {
        serviceDefinition.dependencies.forEach((dependencyName) => {
            dependencyGraph.addEdge(dependencyName as string, serviceName as string);
        });
    });

    return dependencyGraph.getOrder();
}