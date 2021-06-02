import {executeTests, Test, Result} from '../src/execute'
import {InputType, Input} from '../src/inputs'

const helloWorldStringAssertion = function (
  expected: any,
  actual: any
): Result {
  const pass: boolean =
    expected === 'Hello, World!' && actual === 'Hello, World!'
  return {pass, message: pass ? 'Pass' : 'Fail'}
}

const helloWorldStringInput: Input = {
  type: InputType.String,
  value: 'Hello, World!'
}

const goodbyeWorldStringInput: Input = {
  type: InputType.String,
  value: 'Goodbye, World!'
}

const helloWorldPassResult: Result = {
  pass: true,
  message: 'Pass'
}

const helloWorldFailResult: Result = {
  pass: false,
  message: 'Fail'
}

describe('test executor', () => {
  test('performs a passing test', () => {
    const test: Test = {
      expected: helloWorldStringInput,
      actual: helloWorldStringInput,
      assertion: helloWorldStringAssertion
    }

    const results: Result[] = [helloWorldPassResult]

    expect(executeTests([test])).toStrictEqual(results)
  })

  test('performs a failing test', () => {
    const test: Test = {
      expected: helloWorldStringInput,
      actual: goodbyeWorldStringInput,
      assertion: helloWorldStringAssertion
    }

    const results: Result[] = [helloWorldFailResult]

    expect(executeTests([test])).toStrictEqual(results)
  })

  test('performs multiple tests', () => {
    const tests: Test[] = [
      {
        expected: helloWorldStringInput,
        actual: helloWorldStringInput,
        assertion: helloWorldStringAssertion
      },
      {
        expected: helloWorldStringInput,
        actual: goodbyeWorldStringInput,
        assertion: helloWorldStringAssertion
      }
    ]

    const results: Result[] = [helloWorldPassResult, helloWorldFailResult]

    expect(executeTests(tests)).toStrictEqual(results)
  })
})
