import { eschecker } from '@eschecker/internal-core'

export const runEschecker = () => {
  const foo = () => {
    console.log('foo fn')
    return 123
  }
  const res = eschecker([foo], {})
  console.log('res', res)
}


export const sum = (a: number, b: number) => a + b


