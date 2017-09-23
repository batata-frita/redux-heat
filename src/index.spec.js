import { createStore } from 'redux'
import subscribe from '.'

it('should work', done => {
  const initialState = { fire: false }

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LIGHTNING_STRIKE':
        return { ...state, fire: true }

      case 'NOTIFY_FIRE_DEPARTMENT_ON_ITS_WAY':
        return { ...state, fireDepartment: 'on_its_way' }

      default:
        return state
    }
  }

  const notifyFireDepartmentOnItsWay = () => ({ type: 'NOTIFY_FIRE_DEPARTMENT_ON_ITS_WAY' })

  const store = createStore(reducer)

  const api = {
    callFireDepartment: () => Promise.resolve(),
  }

  const callFireDepartmentHeat = state =>
    state.fire && {
      fn: api.callFireDepartment,
      onValue: notifyFireDepartmentOnItsWay,
    }

  const finishTestHeat = state =>
    state.fireDepartment === 'on_its_way' && {
      fn: done,
    }

  subscribe(store, [callFireDepartmentHeat, finishTestHeat])

  store.dispatch({ type: 'LIGHTNING_STRIKE' })
})
