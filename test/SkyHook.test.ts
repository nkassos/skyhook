import { assert } from 'chai';
import { Skyhook } from '../src/Skyhook';
import { SimpleGraph } from '../../potpourri';
import { getOrder } from '../src/util/getDependencyOrder';

describe('Skyhook', () => {
    interface Hello {
        hello(): string
    }

    interface World {
        helloWorld(): string
    }

    interface SkyhookTestInterface {
        test1: Hello
        test2: World
    }

    it('should create the correct order', () => {
        const g = new SimpleGraph();
        g.addNode('node-1');
        g.addNode('node-2');
        g.addNode('node-3');

        g.addEdge('node-1', 'node-3');
        g.addEdge('node-3', 'node-2');

        const order = getOrder(g);
        assert.ok(order);
        assert.equal(order.next().value, 'node-1');
        assert.equal(order.next().value, 'node-3');
        assert.equal(order.next().value, 'node-2');

        const next = order.next();
        assert.equal(next.value, undefined);
        assert.equal(next.done, true);
    });

    it('should create a service with no dependencies', (cb) => {
        const skyhook = new Skyhook<SkyhookTestInterface>();
        skyhook.addService('test1', () => {
            return {
                hello(): string {
                    return 'Hello';
                }
            };
        });

        skyhook.initialize().then((context) => {
            const test1: Hello = context.get('test1');
            const result = test1.hello();
            assert.equal(result, 'Hello');
            cb();
        }).catch((err) => {
            cb(err);
        });
    });

    it('should create a service with dependencies', (cb) => {
        const skyhook = new Skyhook<SkyhookTestInterface>();
        skyhook.addService('test1', () => {
            return {
                hello() {
                    return 'Hello';
                }
            };
        });

        skyhook.addService("test2", (test1: Hello) => {
            return {
                helloWorld() {
                    return `${test1.hello()} World`;
                }
            };
        }, ['test1']);

        skyhook.initialize().then((context) => {
            const test2: World = context.get('test2');
            assert.equal(test2.helloWorld(), 'Hello World');
            cb();
        }).catch((err) => {
            cb(err);
        });
    });

    it('should return an error if service initialization fails', async () => {
        const skyhook = new Skyhook<SkyhookTestInterface>();
        skyhook.addService('test1', () => {
            throw new Error('failed');
        });

        try {
            const context = await skyhook.initialize();
            assert.fail('should have failed');
        } catch (err) {
            assert.equal(err.message, 'failed');
        }
    });
});
