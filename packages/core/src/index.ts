import { eschecker } from '@eschecker/internal-core'

export const runEschecker = () => {
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
  console.log('res', res)
}

export const sum = (a: number, b: number) => a + b
