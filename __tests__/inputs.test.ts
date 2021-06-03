import {InputType, Input, valueOfInput} from '../src/inputs'

describe('input coercer', () => {
  test('creates String from String', () => {
    const input: Input = {
      type: InputType.String,
      value: 'Hello, World!'
    }

    expect(valueOfInput(input)).toStrictEqual('Hello, World!')
  })

  test('creates Number from String', () => {
    const input: Input = {
      type: InputType.Number,
      value: '1'
    }

    expect(valueOfInput(input)).toStrictEqual(1)
  })

  test('creates JSON Object from String', () => {
    const input: Input = {
      type: InputType.Json,
      value: '{"greeting": "Hello, World!"}'
    }

    expect(valueOfInput(input)).toStrictEqual({greeting: 'Hello, World!'})
  })
})
