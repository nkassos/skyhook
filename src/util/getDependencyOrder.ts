import { DependencyGraph } from 'potpourri';
import type { ServiceDefinition } from '../domain/ServiceDefinition';

export function getDependencyOrder(services: Map<string, ServiceDefinition>): IterableIterator<string> {
    const dependencyGraph = new DependencyGraph();
    services.forEach((serviceDefinition, serviceName) => {
        dependencyGraph.addNode(serviceName);
    });

    services.forEach((serviceDefinition, serviceName) => {
        serviceDefinition.dependencies.forEach((dependencyName) => {
            dependencyGraph.addEdge(dependencyName, serviceName);
        });
    });

    return dependencyGraph.getOrder();
}