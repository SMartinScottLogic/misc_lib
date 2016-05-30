import 'mocha';
import {assert} from 'chai';
import {pipeP_R, pipeP_I} from './pipeP';

let num_calls: number
function sum2(a, b): Promise<number> {
    const c = a + b
    num_calls++
    //console.log('sum2', a, b, c)

    return Promise.resolve(c);
}

function increment(a): number {
    const b = a + 1
    num_calls++

    //console.log('increment', a, b)
    return b;
}

function div_by_zero() {
    num_calls++

    throw new Error('div by zero')
}

function reject() {
    num_calls++
    //console.log('reject', num_calls)
    return Promise.reject(`reject: ${num_calls}`)
}

describe('pipeP_R()', function () {
    beforeEach(function () {
        num_calls = 0
    })

    it('runs one method', function (done) {
        pipeP_R(sum2)(1, 3)
            .then((result) => done(assert.equal(result, 4)))
            .catch(done);
    })

    it('resolves on a constant', function (done) {
        pipeP_R(42)()
            .then((result) => done(assert.equal(result, 42)))
            .catch(done);
    })

    it('resolves on a constant', function (done) {
        pipeP_R({ count: 0 })()
            .then((result) => done(assert.deepEqual(result, { count: 0 })))
            .catch(done);
    })

    it('chains promises', function (done) {
        pipeP_R(sum2, increment, increment, 0, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => done(assert.equal(result, 5)))
            .catch(done);
    });

    it('early exits on rejections', function (done) {
        pipeP_R(sum2, increment, increment, reject, 0, div_by_zero, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => {
                assert.equal(result, 5);
                assert.equal(num_calls, 10);
                done()
            })
            .catch((err) => {
                assert.equal(num_calls, 4)
                //console.log('catch', err);
                done()
            });
    })

    it('fails on exceptions', function (done) {
        pipeP_R(sum2, increment, increment, 0, div_by_zero, console.log, increment, increment, increment, increment, increment)(1, 3)
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

describe('pipeP_I()', function () {
    beforeEach(function () {
        num_calls = 0
    })

    it('runs one method', function (done) {
        pipeP_I(sum2)(1, 3)
            .then((result) => done(assert.equal(result, 4)))
            .catch(done);
    })

    it('resolves on a constant', function (done) {
        pipeP_I(42)()
            .then((result) => done(assert.equal(result, 42)))
            .catch(done);
    })

    it('resolves on a constant', function (done) {
        pipeP_I({ count: 0 })()
            .then((result) => done(assert.deepEqual(result, { count: 0 })))
            .catch(done);
    })

    it('chains promises', function (done) {
        pipeP_I(sum2, increment, increment, 0, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => done(assert.equal(result, 5)))
            .catch(done);
    });

    it('early exits on rejections', function (done) {
        pipeP_I(sum2, increment, increment, reject, 0, div_by_zero, increment, increment, increment, increment, increment)(1, 3)
            .then((result) => {
                assert.equal(result, 5);
                assert.equal(num_calls, 10);
                done(assert(false))
            })
            .catch((err) => {
                assert.equal(num_calls, 4)
                //console.log('catch', err)
                done()
            });
    })

    it('fails on exceptions', function (done) {
        pipeP_I(sum2, increment, increment, 0, div_by_zero, console.log, increment, increment, increment, increment, increment)(1, 3)
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