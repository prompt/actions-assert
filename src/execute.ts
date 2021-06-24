import {Input, valueOfInput} from './inputs'

export interface Result {
  pass: boolean
  message: string
}

export interface Assertion {
  (expected: unknown, actual: unknown): Result
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

export class AggregateResult implements Result {
  pass: boolean
  message: string

  constructor(results: Result[]) {
    this.pass = results.filter(result => result.pass).length === results.length
    this.message = results.map(result => result.message).join('\n')
  }
}
