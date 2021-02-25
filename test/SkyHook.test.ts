import { assert } from 'chai';
import Skyhook from '../src/Skyhook';

describe('Skyhook', () => {
    it('should create a service with no dependencies', (cb) => {
        class TestService {
            saySomething() {
                return 'something';
            }
        };

        let skyhook = new Skyhook();
        skyhook.addService("test1", () => {
            return new TestService();
        });

        skyhook.initialize().then((context) => {
            let test1: any = context.get('test1');
            let result = test1.saySomething();
            assert.equal(result, 'something');
            cb();
        }).catch((err) => {
            cb(err);
        });
    });

    it('should create a service with dependencies', (cb) => {
        let skyhook = new Skyhook();
        skyhook.addService("test1", () => {
            return {
                saySomething() {
                    return 'something';
                }
            };
        });

        skyhook.addService("test2", (test1) => {
            return {
                saySomething() {
                    return 'I said: ' + test1.saySomething();
                }
            };
        }, ['test1']);

        skyhook.initialize().then((context) => {
            let test2: any = context.get('test2');
            assert.equal(test2.saySomething(), 'I said: something');
            cb();
        }).catch((err) => {
            cb(err);
        });
    });

    it('should return an error if service initialization fails', (cb) => {
        let skyhook = new Skyhook();
        skyhook.addService('test1', () => {
            throw new Error('failed');
        });

        skyhook.initialize().then((context) => {
            assert.fail('should have failed');
            cb();
        }).catch((err) => {
            assert.equal(err.message, 'failed');
            cb();
        });
    });
});
