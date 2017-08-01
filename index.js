const most = require('most')

module.exports = function subscribe(store, ...heats) {
  const state$ = new most.Stream({
    run: (sink, scheduler) => {
      const unsubscribe = store.subscribe(() => {
        sink.event(scheduler.now(), store.getState())
      })

      return {
        dispose: () => {
          unsubscribe()
        },
      }
    },
  })

  const action$ = most.mergeArray(heats.map(heat => heat(state$)))

  const subscription = action$.subscribe({
    next: action => store.dispatch(action),
  })

  return () => subscription.unsubscribe()
}
