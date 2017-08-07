const most = require('most')

const send = id => ({ type: 'SEND_MESSAGES', payload: id })

const chatHeat = state$ => {
  return state$
    .map(({ messages }) => messages)
    .map(messages =>
      send(messages.filter(message => message.status === 'NOT_SENT').map(({ id }) => id))
    )
}

it('should filter the messages that needs sending and return an action with their ids to be updated in the store', done => {
  const state = {
    messages: [
      { id: 0, timestamp: 0, content: 'Hello there', status: 'READ' },
      { id: 1, timestamp: 1, content: 'Are you ok?', status: 'RECEIVED' },
      { id: 2, timestamp: 2, content: 'Answer me!!!', status: 'SENDING' },
      { id: 3, timestamp: 3, content: 'Please!!!', status: 'NOT_SENT' },
      { id: 4, timestamp: 4, content: 'Crying...', status: 'NOT_SENT' },
    ],
  }

  chatHeat(most.of(state))
    .tap(action => expect(action).toEqual({ type: 'SEND_MESSAGES', payload: [3, 4] }))
    .subscribe({
      error: done.fail,
      complete: done,
    })
})
