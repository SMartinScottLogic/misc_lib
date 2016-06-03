'use strict';
import {assert} from 'chai';
import {ReflectivePromise} from './reflectivePromise'

describe('Reflective Promise', function () {
    it('annotates promises with status indicating resolved state', function (done) {
        const reflectivePromise = ReflectivePromise.all()
        const promises = []
        promises.push(Promise.resolve(true))
        promises.push(Promise.resolve(1))
        promises.push(Promise.resolve('hello'))
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => resolve({ text: 'hello' }), 200)
        }))
        promises.push(Promise.reject(true))
        promises.push(Promise.reject(1))
        promises.push(Promise.reject('hello'))
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => reject({ text: 'hello' }), 200)
        }))

        reflectivePromise(promises)
            .then((results) => {
                assert.equal(results.length, 8)
                assert.deepEqual(results[0], { status: 'resolve' })
                assert.deepEqual(results[1], { status: 'resolve' })
                assert.deepEqual(results[2], { '0': 'h', '1': 'e', '2': 'l', '3': 'l', '4': 'o', status: 'resolve' });
                assert.deepEqual(results[3], { text: 'hello', status: 'resolve' })

                assert.deepEqual(results[4], { status: 'reject' })
                assert.deepEqual(results[5], { status: 'reject' })
                assert.deepEqual(results[6], { '0': 'h', '1': 'e', '2': 'l', '3': 'l', '4': 'o', status: 'reject' });
                assert.deepEqual(results[7], { text: 'hello', status: 'reject' })
                done();
            })
            .catch((err) => (console.log(err), done(err)))
    })

    it('supports custom label and values for resolved states', function (done) {
        const reflectivePromise = ReflectivePromise.all('finally', { code: 200, description: 'succeeded' }, { code: 404, description: 'failed' })
        const promises = []
        promises.push(Promise.resolve(true))
        promises.push(Promise.resolve(1))
        promises.push(Promise.resolve('hello'))
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => resolve({ text: 'hello' }), 200)
        }))
        promises.push(Promise.reject(true))
        promises.push(Promise.reject(1))
        promises.push(Promise.reject('hello'))
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => reject({ text: 'hello' }), 200)
        }))

        reflectivePromise(promises)
            .then((results) => {
                assert.equal(results.length, 8)
                assert.deepEqual(results[0], { 'finally': { code: 200, description: 'succeeded' } })
                assert.deepEqual(results[1], { 'finally': { code: 200, description: 'succeeded' } })
                assert.deepEqual(results[2], { '0': 'h', '1': 'e', '2': 'l', '3': 'l', '4': 'o', 'finally': { code: 200, description: 'succeeded' } });
                assert.deepEqual(results[3], { text: 'hello', 'finally': { code: 200, description: 'succeeded' } })

                assert.deepEqual(results[4], { 'finally': { code: 404, description: 'failed' } })
                assert.deepEqual(results[5], { 'finally': { code: 404, description: 'failed' } })
                assert.deepEqual(results[6], { '0': 'h', '1': 'e', '2': 'l', '3': 'l', '4': 'o', 'finally': { code: 404, description: 'failed' } });
                assert.deepEqual(results[7], { text: 'hello', 'finally': { code: 404, description: 'failed' } })
                done();
            })
            .catch((err) => (console.log(err), done(err)))
    })
})