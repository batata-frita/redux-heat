import isPromise from 'is-promise'
import isObservable from 'is-observable'
import { fromPromise, of } from 'most'

export default value => {
  return isPromise(value) ? fromPromise(value) : !isObservable(value) ? of(value) : value
}
