import { Stream } from 'most'

export default function createStateStream(store) {
  return new Stream({
    run: (sink, scheduler) => {
      // console.log('VAHAHAHAH', store)
      const unsubscribe = store.subscribe(() => {
        // console.log('new subscribe event')
        sink.event(scheduler.now(), store.getState())
      })

      return {
        dispose: () => unsubscribe(),
      }
    },
  })
}
