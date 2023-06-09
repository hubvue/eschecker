import test from 'ava'

import { sum } from '../index'

test('sum from native', (t) => {
  t.is(sum(1, 2), 3)
})


// test('test', (t) => {
//   const foo = () => {
//     console.log('foo fn')
//     return 123
//   }
//   const res = eschecker([foo], {})
//   t.is(res, 123)
// })
