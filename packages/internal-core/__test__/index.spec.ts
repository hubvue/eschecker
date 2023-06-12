import test from 'ava'

import { sum, eschecker } from '../index'

test('sum from native', (t) => {
  t.is(sum(1, 2), 3)
})


test('test', (t) => {
  const foo = () => {
    console.log('foo fn')
    return 123
  }

  const source = {
    path: './index.js',
    content: 'function foo(a, b) {}'
  }
  const res = eschecker([source], {
    esVersion: 6,
    rules: {
      'FunctionDeclaration': 'FunctionDeclaration'
    }
  })
  t.is(res, null)
})
