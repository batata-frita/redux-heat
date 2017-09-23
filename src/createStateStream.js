import { Stream } from 'most'

export default function createStateStream(store) {
  return new Stream({
    run: (sink, scheduler) => {
      const unsubscribe = store.subscribe(() => {
        sink.event(scheduler.now(), store.getState())
      })

      return {
        dispose: () => unsubscribe(),
      }
    },
  })
}
