import equals from 'ramda/src/equals'
import pick from 'ramda/src/pick'
import toObservable from './toObservable'
import { of } from 'most'

const noop = () => {}

export default effect$ =>
  effect$
    .filter(x => x)
    .map(pick(['fn', 'args', 'onValue', 'onError']))
    .skipRepeatsWith(equals)
    .flatMap(({ fn, args = [], onValue = noop, onError = noop }) =>
      toObservable(fn.apply(null, args))
        .map(onValue)
        .recoverWith(e => of(onError(e)))
    )
    .filter(x => x)
