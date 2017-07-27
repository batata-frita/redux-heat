function subscribe(Observable, store, effects) {
  const state$ = new Observable(observer => {
    const unsubscribe = store.subscribe(() => observer.next(store.getState()))
    return unsubscribe
  })

  const unsubscribers = effects.map(effect => effect(state$).subscribe(store.dispatch))

  return function() {
    unsubscribers.forEach(unsubscriber => unsubscriber())
  }
}

module.exports = { subscribe: subscribe }

// using it...

const effect = state$ => state.$filter(selector).map(() => actionCreator())

subscribe(Observable, store, [effect])
