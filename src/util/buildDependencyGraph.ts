import {DependencyGraph} from "potpourri";
import ServiceDefinition from "../ServiceDefinition";

export function buildDependencyGraph(services: Map<string, ServiceDefinition>): DependencyGraph {
    const dependencyGraph = new DependencyGraph();
    services.forEach((serviceDefinition, serviceName) => {
        dependencyGraph.addNode(serviceName);
    });

    services.forEach((serviceDefinition, serviceName) => {
        serviceDefinition.dependencies.forEach((dependencyName) => {
            dependencyGraph.addEdge(dependencyName, serviceName);
        });
    });

    return dependencyGraph;
}