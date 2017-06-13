function onChange(selector, callback) {
  var currentSelectorValue

  return function(state) {
    currentSelectorValue = selector(state)

    return function(state) {
      var newSelectorValue = selector(state)

      if (newSelectorValue !== currentSelectorValue) {
        currentSelectorValue = newSelectorValue
        return callback(state, newSelectorValue)
      } else {
        return Promise.resolve()
      }
    }
  }
}

function onChangeToTruthy(selector, callback) {
  return onChange(selector, function(state, selectorValue) {
    if (selectorValue) return callback(state, selectorValue)
    else return Promise.resolve()
  })
}

function subscribe(store, effects) {
  const unsubscribers = effects
    .map(function(effect) {
      return effect(store.getState())
    })
    .map(function(effectWithInitialState) {
      return store.subscribe(function() {
        return effectWithInitialState(store.getState()).then(action => {
          if (action != null) store.dispatch(action)
        })
      })
    })

  return function() {
    unsubscribers.forEach(unsubscriber => unsubscriber())
  }
}

module.exports = { onChange: onChange, onChangeToTruthy: onChangeToTruthy, subscribe: subscribe }
