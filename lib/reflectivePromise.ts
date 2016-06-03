'use strict';

export class ReflectivePromise {
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