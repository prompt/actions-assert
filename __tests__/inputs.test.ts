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

describe('typescript', () => {
  test('gets coercion by type', () => {
    enum StringInputTypes {
      'string' = InputType.String,
      'number' = InputType.Number,
      'json' = InputType.Json
    }

    expect(StringInputTypes['string']).toStrictEqual(InputType.String)
    expect(StringInputTypes['json']).toStrictEqual(InputType.Json)
    expect(StringInputTypes['number']).toStrictEqual(InputType.Number)
  })
})
