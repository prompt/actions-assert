import {Input, valueOfInput} from './inputs'

export interface Result {
  pass: boolean
  message: string
}

export interface Assertion {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (expected: any, actual: any): Result
}

export interface Test {
  expected: Input
  actual: Input
  assertion: Assertion
}

export function executeTests(tests: Test[]): Result[] {
  return tests.map(function (t: Test): Result {
    return t.assertion(valueOfInput(t.expected), valueOfInput(t.actual))
  })
}
