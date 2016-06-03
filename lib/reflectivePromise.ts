'use strict';

/**  */
export class ReflectivePromise {
    /** 
     * Create a function which waits for all promises to be completed, annotates the results with a custom key with a value describing the completion state
     * @param {string} label_key - key to merge into each result
     * @param {string} resolve_label - value to assign to the label_key, when the promise has successfully completed
     * @param {string} reject_label - value to assign to the label_key, when the promise has not successfully completed (e.g. explicit error, throws)
     * @return {function} 
     */
    static all<T>(label_key: string = 'status', resolve_label: any = 'resolve', reject_label: any = 'reject'): (promises: Array<Promise<T>>) => Promise<Array<T>> {
        return function (promises: Array<Promise<T>>): Promise<Array<T>> {
            return Promise.all(<Array<any>>
                promises.map(
                    (promise) => promise.then(
                        (value) => Object.assign({}, value, { [label_key]: resolve_label }),
                        (err) => Object.assign({}, err, { [label_key]: reject_label })
                    )
                )
            )
        }
    }
}