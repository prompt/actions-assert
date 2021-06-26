import {hasActionInput} from '../src/utils'
import {env} from 'process'

describe('utils', () => {
  beforeEach(() => {
    env['INPUT_EMPTY-STRING'] = ''
    env['INPUT_FILLED-STRING'] = 'example'
    env['INPUT_CONVERT-EMPTY-TO-NULL'] = 'true'
  })

  test('an empty input is treated as absent when conversion is enabled', () => {
    env['INPUT_CONVERT-EMPTY-TO-NULL'] = 'true'
    expect(hasActionInput('empty-string')).toStrictEqual(false)
  })

  test('an empty input is not treated as absent when conversion is disabled', () => {
    env['INPUT_CONVERT-EMPTY-TO-NULL'] = 'false'
    expect(hasActionInput('empty-string')).toStrictEqual(true)
  })

  test('a filled input is always treated as present', () => {
    env['INPUT_CONVERT-EMPTY-TO-NULL'] = 'true'
    expect(hasActionInput('filled-string')).toStrictEqual(true)
    env['INPUT_CONVERT-EMPTY-TO-NULL'] = 'false'
    expect(hasActionInput('filled-string')).toStrictEqual(true)
  })

  afterEach(() => {
    delete env['INPUT_EMPTY-STRING']
    delete env['INPUT_FILLED-STRING']
    delete env['INPUT_CONVERT-EMPTY-TO-NULL']
  })
})
