function onChange(selector, callback) {
  return function(store) {
    let currentState = selector(store.getState())

    return function() {
      let newState = selector(store.getState())

      if (newState !== currentState) {
        currentState = newState
        let maybePromise = callback(store, newState)

        if (maybePromise instanceof Promise) {
          return maybePromise.then(action => store.dispatch(action))
        } else {
          return maybePromise
        }
      }
    }
  }
}

function onTransitionTo(selector, callback) {
  return onChange(selector, function(store, value) {
    if (value) return callback(store, value)
  })
}

module.exports = { onTransitionTo: onTransitionTo, onChange: onChange }
