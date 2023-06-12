import test from 'ava'

import { eschecker } from '../index'

test('test', (t) => {

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
