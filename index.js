function onChange(selector, callback) {
  return function(store) {
    let currentState = selector(store.getState())

    return function() {
      let newState = selector(store.getState())

      if (newState !== currentState) {
        currentState = newState
        return callback(store, newState)
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
