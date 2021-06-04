import {resolveAssertion} from '../src/assertions'

describe('assertions resolver', () => {
  describe('workflows resolution', () => {
    it('resolves to workflows assertions directory', () => {
      expect.assertions(1)

      const isEven = require('../.github/workflows/assertions/is-even')

      resolveAssertion('workflows://is-even').then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEven.toString())
      )
    })
  })

  describe('npm resolution', () => {
    it('resolves npm package to module', () => {
      expect.assertions(1)

      const isEqual = require('@pr-mpt/assertions-is-equal')

      return resolveAssertion(
        'npm://@pr-mpt/assertions-is-equal'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEqual.toString())
      )
    })
  })

  it('throws error when no type is provided', () => {
    expect.assertions(1)
    return resolveAssertion('without-type').catch(e =>
      expect(e instanceof URIError).toBe(true)
    )
  })

  it('throws error when type does not have resolver', () => {
    expect.assertions(1)
    return resolveAssertion('invalid-type://example').catch(e =>
      expect(e instanceof RangeError).toBe(true)
    )
  })
})
