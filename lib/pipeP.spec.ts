import 'mocha';
import {assert} from 'chai';
import {pipeP} from './pipeP';

describe('pipeP()', function () {
    function sum2(a, b): Promise<number> {
        return Promise.resolve(a + b);
    }

    function increment(a): number {
        return a + 1;
    }

    function div_by_zero() {
        throw new Error('div by zero.')
    }

    it('chains promises', function (done) {
        pipeP(sum2, increment, increment, 0, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => done(assert.equal(result, 5)))
            .catch(done);
    });

    it('fails on exceptions', function (done) {
        pipeP(sum2, increment, increment, 0, div_by_zero, console.log, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => {
                console.log('at end')
                done(new Error('at end'))
            })
            .catch((err) => {
                assert(true)
                done()
            });
    })
});