var most = require('most')

module.exports = function subscribe(store, heats) {
  var state$ = new most.Stream({
    run: (sink, scheduler) => {
      var unsubscribe = store.subscribe(function() {
        sink.event(scheduler.now(), store.getState())
      })

      return {
        dispose: function() {
          unsubscribe()
        },
      }
    },
  })

  var action$ = most.mergeArray(
    heats.map(function(heat) {
      return heat(state$)
    })
  )

  var subscription = action$.subscribe({
    next: function(action) {
      store.dispatch(action)
    },
  })

  return function() {
    subscription.unsubscribe()
  }
}
