const most = require('most')

const infinite500 = most.periodic(500)

const fixed = most.from([1, 2, 3]).flatMap(value => infinite500.map(() => value))

fixed.subscribe({
  next: value => console.log(value),
})
