import 'mocha';
import {assert} from 'chai';
import {pipeP} from './pipeP';

describe('pipeP()', function () {
    function sum2(a, b): Promise<number> {
        console.log('sum2', a, b)
        return Promise.resolve(a + b);
    }

    function increment(a): Promise<number> {
        return a + 1;
    }

    it('chains promises', function (done) {
        pipeP(sum2, increment, increment, 0, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => done(assert.equal(result, 5)))
            .catch(done);
    });
});