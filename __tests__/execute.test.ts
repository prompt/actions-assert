import {executeTests, Test, Result, InputType, Input} from '../src/execute'

describe('test executor', () => {
  test('performs a test', () => {
    const tests: Test[] = [
      {
        expected: {
          type: InputType.String,
          value: 'hello-world'
        },
        actual: {
          type: InputType.String,
          value: 'hello-world'
        },
        assertion: function (expected: Input, actual: Input): Result {
          return {success: true, message: 'x is y'}
        }
      }
    ]

    const results: Result[] = [
      {
        success: true,
        message: 'x is y'
      }
    ]

    expect(executeTests(tests)).toStrictEqual(results)
  })
})
