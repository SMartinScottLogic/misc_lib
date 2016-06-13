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
        .then(merge((data)=>({test2:false}), identity, (data)=>({data})))
        .then((data)=>assert.deepEqual(data, {test:true,data:{test2:false}}))
        .then((data)=>done())
        .catch((err)=>done(err))
    })
})