const { subscribe } = require('.')

describe('subscribe', () => {
  it('wire the effects to the store, passing the state and dispatching actions', async () => {
    const storeState = { importantData: false }
    const unsubscriber = jest.fn()
    const store = {
      getState: () => storeState,
      subscribe: jest.fn(effect => {
        wiredEffects.push(effect)
        return unsubscriber
      }),
      dispatch: jest.fn(),
    }

    const effect = state$ =>
      state$.filter(state => state.importantData).map(() => {
        type: 'DUMMY_ACTION'
      })

    // Set up the effect in the store
    const unsubscribe = subscribe(store, [effect])
    expect(effectStub).toHaveBeenCalledWith(initialState)

    // Update the state in the store and notify the subscribers
    currentState = nextState
    await wiredEffects[0]()

    expect(initializedEffectStub).toHaveBeenCalledWith(nextState)
    expect(store.dispatch).toHaveBeenCalledWith(action)

    // Set the action returned by the effect to be undefined
    // and notify subscribers
    action = undefined
    await wiredEffects[0]()

    expect(initializedEffectStub).toHaveBeenCalledWith(nextState)
    expect(store.dispatch).toHaveBeenCalledTimes(1)

    // Cleanup
    unsubscribe()

    expect(unsubscriber).toHaveBeenCalled()
  })
})
