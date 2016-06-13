'use strict'

export const identity = data => data;
export const side_effect = (aside: (data: any) => any) => data => (aside(data), data)
export const merge = (promise: (data: any) => any, transform: (data: any) => any = identity, extract: (data: any) => any = identity) =>
    data => Promise.resolve(promise(extract(data)))
        .then(transform)
        .then(result => Object.assign({}, data, result))