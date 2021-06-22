import {hasActionInput} from '../src/utils'
import {env} from 'process'

describe('utils', () => {
  beforeEach(() => {
    env['INPUT_EMPTY_STRING'] = '';
  })

  test('differentiates between absence of value and empty string', () => {
    expect(hasActionInput('empty_string')).toStrictEqual(true)
    expect(hasActionInput('parameter_not_provided')).toStrictEqual(false)
  })

  afterEach(() => {
    delete env['INPUT_EMPTY_STRING'];
  })
})
