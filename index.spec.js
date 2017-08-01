const subscribe = require('.')

describe('subscribe', () => {
  it('calls the heat with a observable of the state and expects that it returns an observable of actions to be dispatched', () => {
    const storeSubscriptions = []
    const storeState = { whatever: true }
    const unsubscriber = jest.fn()
    const store = {
      getState: () => storeState,
      subscribe: jest.fn(effect => {
        storeSubscriptions.push(effect)
        return unsubscriber
      }),
      dispatch: jest.fn(),
    }

    const heat = state$ =>
      state$.filter(({ whatever }) => whatever).map(() => ({
        type: 'ACTION',
      }))

    subscribe(store, heat)
    storeSubscriptions.forEach(subscription => subscription())

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'ACTION' })
  })
})
