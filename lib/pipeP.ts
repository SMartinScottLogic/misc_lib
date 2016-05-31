'use strict';

// ((a → Promise b), (b → Promise c), …, (y → Promise z)) → (a → Promise z)
export function pipeP_R(head, ...promises): (...any) => Promise<any> {
    const context = this;
    return function (): Promise<any> {
        try {
            let result = head;
            if (typeof head === 'function') {
                result = head.call(context, ...arguments)
            }

            return Promise.resolve(result).then((result) => {
                if (promises.length == 0) {
                    return result
                } else {
                    const [next, ...tail] = promises;

                    return pipeP_R(next, ...tail)(result)
                }
            })
        } catch (err) {
            return Promise.reject(err.message);
        }
    }
}

export function pipeP_I(head, ...promises): (...any) => Promise<any> {
    const context = this;
    return function (): Promise<any> {
        let result = head
        if (typeof head === 'function') {
            try {
                result = head.call(context, ...arguments)
            } catch (err) {
                return Promise.reject(err.message);
            }
        }

        return promises.reduce(
            (prev, promise) => {
                return prev.then((result) => (typeof (promise) === 'function') ? promise.call(context, result) : promise, (err)=>Promise.reject(err))
            }
            , Promise.resolve(result)
        )
    }
}