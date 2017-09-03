import createStateStream from './createStateStream'
import render from './render'
import { from, mergeArray } from 'most'

export default function subscribe(store, heats) {
  const state$ = createStateStream(store)

  const streams = heats.map(heat => {
    const effect$ = state$.map(heat)
    const action$ = render(effect$)
    return action$
  })

  const action$ = mergeArray(streams)

  const subscription = action$.subscribe({
    next: action => store.dispatch(action),
    error: error => console.log('error', error),
    complete: () => console.log('completed'),
  })

  return () => subscription.unsubscribe()
}
