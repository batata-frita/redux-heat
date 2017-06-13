const { onChange, onChangeToTruthy, subscribe } = require('.')

describe('onChange', () => {
  describe('when the result of the selector changed', () => {
    it('calls the callback and returns the promise within it', async () => {
      const initialState = {
        value: 1,
      }
      const nextState = {
        value: 5,
      }
      const selector = ({ value }) => value
      const effect = onChange(selector, async ({ value }) => ({
        type: 'NEXT_VALUE',
        payload: value,
      }))

      const initializedEffect = effect(initialState)

      const action = await initializedEffect(nextState)

      expect(action).toEqual({ type: 'NEXT_VALUE', payload: 5 })
    })
  })

  describe('when the result of the selector didn’t change', () => {
    it('does not run the callback, and returns an empty Promise', async () => {
      const initialState = {
        value: 1,
      }
      const nextState = {
        value: 1,
      }
      const selector = ({ value }) => value
      const effect = onChange(selector, async ({ value }) => ({
        type: 'NEXT_VALUE',
        payload: value,
      }))

      const initializedEffect = effect(initialState)

      const action = await initializedEffect(nextState)

      expect(action).toEqual(undefined)
    })
  })
})

describe('onChangeToTruthy', () => {
  describe('when the result of the selector changes to truthy', () => {
    it('calls the callback and returns the promise within it', async () => {
      const initialState = {
        value: false,
      }
      const nextState = {
        value: true,
      }
      const selector = ({ value }) => value
      const effect = onChangeToTruthy(selector, async ({ value }) => ({
        type: 'NEXT_VALUE',
        payload: value,
      }))

      const initializedEffect = effect(initialState)

      const action = await initializedEffect(nextState)

      expect(action).toEqual({ type: 'NEXT_VALUE', payload: true })
    })
  })

  describe('when the result of the selector changes to falsy', () => {
    it('does not run the callback, and returns an empty Promise', async () => {
      const initialState = {
        value: true,
      }
      const nextState = {
        value: false,
      }
      const selector = ({ value }) => value
      const effect = onChangeToTruthy(selector, async ({ value }) => ({
        type: 'NEXT_VALUE',
        payload: value,
      }))

      const initializedEffect = effect(initialState)

      const action = await initializedEffect(nextState)

      expect(action).toEqual(undefined)
    })
  })

  describe('when the result of the selector does not change', () => {
    it('does not run the callback, and returns an empty Promise', async () => {
      const initialState = {
        value: true,
      }
      const nextState = {
        value: true,
      }
      const selector = ({ value }) => value
      const effect = onChangeToTruthy(selector, async ({ value }) => ({
        type: 'NEXT_VALUE',
        payload: value,
      }))

      const initializedEffect = effect(initialState)

      const action = await initializedEffect(nextState)

      expect(action).toEqual(undefined)
    })
  })
})

describe('subscribe', () => {
  it('wire the effects to the store', async () => {
    const initialState = { value: 1 }
    const nextState = { value: 2 }
    let currentState = initialState
    const wiredEffects = []
    const unsubscriber = jest.fn()
    const store = {
      getState: () => currentState,
      subscribe: jest.fn(effect => {
        wiredEffects.push(effect)
        return unsubscriber
      }),
      dispatch: jest.fn(),
    }
    let action = { type: 'DUMMY_ACTION' }

    const initializedEffectStub = jest.fn(async () => action)
    const effectStub = jest.fn(() => initializedEffectStub)

    // Set up the effect in the store
    const unsubscribe = subscribe(store, [effectStub])

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
