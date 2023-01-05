import { SimpleGraph, depthFirstSearch, PrimitiveLabel, LinkedStack } from 'potpourri';
import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { ArrayStack } from '../../../potpourri/dist/Stack/ArrayStack';

export function getDependencyOrder<T>(services: Map<keyof T, ServiceDefinition<T>>): IterableIterator<PrimitiveLabel> {
    const graph = new SimpleGraph();
    services.forEach((serviceDefinition, serviceName) => {
        graph.addNode(serviceName);
    });

    services.forEach((serviceDefinition, serviceName) => {
        serviceDefinition.dependencies.forEach((dependencyName) => {
            graph.addEdge(dependencyName, serviceName);
        });
    });

    return getOrder(graph);
}

export function getOrder<T>(graph: SimpleGraph): IterableIterator<PrimitiveLabel> {
    const stack = new ArrayStack<PrimitiveLabel>();
    depthFirstSearch(graph, (node: PrimitiveLabel, visited: boolean): boolean => {
        if (visited) {
            stack.push(node);
        }
        return true;
    });
    return stack.iterator();
}