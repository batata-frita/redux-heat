const { onChange, onTransitionTo } = require('.')

describe('onChange', () => {
  it('invokes the callback when the state matching the selector changes', () => {
    const state = { a: false }
    const store = {
      dispatch: jest.fn(),
      getState: () => {
        return state
      },
    }
    const selector = state => state.a
    const callback = store => store.dispatch()

    const effect = onChange(selector, callback)(store)
    expect(store.dispatch).not.toHaveBeenCalled()

    effect()
    expect(store.dispatch).not.toHaveBeenCalled()

    state.a = true
    effect()
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('invokes the callback with the store and the new state', () => {
    const state = { a: false }
    const store = {
      dispatch: jest.fn(),
      getState: () => {
        return state
      },
    }
    const selector = state => state.a
    const callback = jest.fn()
    const effect = onChange(selector, callback)(store)

    state.a = 'value'
    effect()
    expect(callback).toHaveBeenCalledWith(store, 'value')
  })

  it('if the state was changed it returns the value of the callback', () => {
    const state = { a: false }
    const store = {
      dispatch: jest.fn(),
      getState: () => {
        return state
      },
    }
    const selector = state => state.a
    const callback = () => 1
    const effect = onChange(selector, callback)(store)

    expect(effect()).toBe(undefined)
    state.a = 'value'
    expect(effect()).toBe(1)
  })

  describe('when the return value of the callback is a Promise', () => {
    it('dispatches an action with the value that the Promise holds', () => {
      const state = { a: false }
      const store = {
        dispatch: jest.fn(),
        getState: () => {
          return state
        },
      }
      const selector = state => state.a
      const callback = () => new Promise((resolve) => resolve('action'))
      const effect = onChange(selector, callback)(store)

      state.a = 'value'
      return effect()
        .then(() => expect(store.dispatch).toHaveBeenCalledWith('action'))
    })
  })
})

describe('onTransitionTo', () => {
  it('invokes the callback when the state matching the selector changes and is thruthy', () => {
    const state = { a: false }
    const store = {
      dispatch: jest.fn(),
      getState: () => {
        return state
      },
    }
    const selector = state => state.a
    const callback = store => store.dispatch()

    const effect = onTransitionTo(selector, callback)(store)
    expect(store.dispatch).not.toHaveBeenCalled()

    effect()
    expect(store.dispatch).not.toHaveBeenCalled()

    state.a = true
    effect()
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('doesnt invoke the callback when the state matching the selector changes and is falsy', () => {
    const state = { a: true }
    const store = {
      dispatch: jest.fn(),
      getState: () => {
        return state
      },
    }
    const selector = state => state.a
    const callback = store => store.dispatch()

    const effect = onTransitionTo(selector, callback)(store)
    expect(store.dispatch).not.toHaveBeenCalled()

    effect()
    expect(store.dispatch).not.toHaveBeenCalled()

    state.a = false
    effect()
    expect(store.dispatch).not.toHaveBeenCalled()
  })
})
