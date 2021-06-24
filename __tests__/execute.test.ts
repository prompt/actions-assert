import {executeTests, Test, Result, AggregateResult} from '../src/execute'
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

describe('AggregateResult', () => {
  it('passes when all results passed', () => {
    const aggregateResult = new AggregateResult([
      {pass: true, message: 'Example'},
      {pass: true, message: 'Example'},
      {pass: true, message: 'Example'}
    ])

    expect(aggregateResult.pass).toStrictEqual(true)
  })

  it('does not pass when one result of many did not pass', () => {
    const aggregateResult = new AggregateResult([
      {pass: true, message: ''},
      {pass: false, message: ''},
      {pass: true, message: ''}
    ])

    expect(aggregateResult.pass).toStrictEqual(false)
  })

  it('does not pass when only result did not pass', () => {
    const aggregateResult = new AggregateResult([
      {pass: false, message: ''},
    ])

    expect(aggregateResult.pass).toStrictEqual(false)
  })

  it('passed when only result passed', () => {
    const aggregateResult = new AggregateResult([
      {pass: true, message: ''},
    ])

    expect(aggregateResult.pass).toStrictEqual(true)
  })

  it('joins results messages in order with new lines', () => {
    const aggregateResult = new AggregateResult([
      {pass: true, message: 'Message a'},
      {pass: true, message: 'Message b'},
      {pass: true, message: 'Message c'}
    ])

    const expectedMessage = 'Message a\nMessage b\nMessage c';

    expect(aggregateResult.message).toStrictEqual(expectedMessage)
  })
})
