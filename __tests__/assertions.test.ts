import {resolveAssertion} from '../src/assertions'

const isEven = require(`../.github/workflows/assertions/is-even.js`)

describe('assertions resolver', () => {
  describe('local resolution', () => {
    it('resolves to specified assertions directory', () => {
      expect.assertions(1)

      resolveAssertion(
        'local://is-even',
        '../.github/workflows/assertions'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEven.toString())
      )
    })
  })

  it('throws error when no source is provided', () => {
    expect.assertions(1)
    return resolveAssertion('without-source').catch(e =>
      expect(e instanceof URIError).toBe(true)
    )
  })

  it('throws error when source does not have resolver', () => {
    expect.assertions(1)
    return resolveAssertion('invalid-source://example').catch(e =>
      expect(e instanceof RangeError).toBe(true)
    )
  })
})
