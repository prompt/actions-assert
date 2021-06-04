import {resolveAssertion} from '../src/assertions'

describe('assertions resolver', () => {
  describe('workflows resolution', () => {
    it('resolves to workflows assertions directory', () => {
      const isEven = require(`../.github/workflows/assertions/is-even`)

      resolveAssertion('workflows://is-even').then(assertion =>
        expect(assertion).toBe(isEven)
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
