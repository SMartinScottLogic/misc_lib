'use strict';
import {assert} from 'chai';
import {identity, side_effect, merge} from './singlelinePromise'

describe('side_effect', function(){
    it('returns original value, in presence of side effects', function(done) {
        Promise.resolve(true)
        .then(side_effect((data)=>false))
        .then((result)=>(assert.isTrue(result),result))
        .then((result)=>done())
        .catch((err)=>done(new Error()))
    })
})

describe('merge', function() {
    it('merges results into promise results', function(done) {
        Promise.resolve({})
        .then(merge((data)=>({test:true})))
        .then(merge((data)=>({test2:false})))
        .then((data)=>assert.deepEqual(data, {test:true,test2:false}))
        .then((data)=>done())
        .catch((err)=>done(err))
    })
    it('merges results into transformed promise results', function(done) {
        Promise.resolve({})
        .then(merge((data)=>({test:true})))
        .then(merge((data)=>({test2:false}), (data)=>({data})))
        .then((data)=>assert.deepEqual(data, {test:true,data:{test2:false}}))
        .then((data)=>done())
        .catch((err)=>done(err))
    })

    it('merges results into transformed promise results (with overwriting)', function(done) {
        Promise.resolve({test2: '1234'})
        .then(merge((data)=>({test: true})))
        .then((result) => (assert.deepEqual(result, {test:true, test2: '1234'}),result))
        .then(merge((data)=>({test:false}), ({test})=>({test2:test})))
        .then((result)=>assert.deepEqual(result, {test:true,test2:false}))
        .then((data)=>done())
        .catch((err)=>done(err))
    })
})