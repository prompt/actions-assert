export enum InputType {
  String
}

export interface Input {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  type: InputType
}

export interface Result {
  success: boolean
  message: string
}

export interface Assertion {
  (expected: Input, actual: Input): Result
}

export interface Test {
  expected: Input
  actual: Input
  assertion: Assertion
}

export function executeTests(tests: Test[]): Result[] {
  return tests.map(function (t: Test): Result {
    return t.assertion(t.expected, t.actual)
  })
}
