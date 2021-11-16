import { SimpleGraph, GraphUtil, PrimitiveLabel, LinkedStack } from 'potpourri';
import type { ServiceDefinition } from '../domain/ServiceDefinition';
import { Graph } from '../../../potpourri/dist/Graph';

export function getDependencyOrder<T>(services: Map<keyof T, ServiceDefinition<T, keyof T>>): IterableIterator<PrimitiveLabel> {
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

export function getOrder<T>(graph: Graph<T>): IterableIterator<T> {
    const stack = new LinkedStack<T>();
    GraphUtil.depthFirstSearch(graph, (node: T, visited: boolean): boolean => {
        if (visited) {
            stack.push(node);
        }
        return true;
    });
    return stack.iterator();
}