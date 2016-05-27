'use strict';

export function pipeP(head, ...promises): any {
    const context = this;
    return function () {
        let result = head;
        if(typeof head === 'function') {
            result = head.call(context, ...arguments)
        }
        
        return Promise.resolve(result).then((result) => {
            if (promises.length == 0) {
                return result
            } else {
                const [next, ...tail] = promises;

                return pipeP(next, ...tail)(result)
            }
        })
    }
}

/**
function sum2(a, b): Promise<number> {
    console.log('sum2', a, b)
    return Promise.resolve(a + b);
}

function increment(a): Promise<number> {
    return a + 1;
}

pipeP(sum2, increment, increment, 7, increment, increment, increment, increment, increment)(1, 3).then((result) => console.log(result)).catch((err) => console.trace(err))
**/