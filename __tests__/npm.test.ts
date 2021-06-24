import {resolveAssertion} from '../src/assertions'

describe('assertions resolver', () => {
  describe('npm resolution', () => {
    it('resolves npm package to module with default version 1', () => {
      expect.assertions(1)

      const isEqual = require('test-fixture-1')

      return resolveAssertion(
        'npm://@assertions/test-fixture'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEqual.toString())
      )
    })

    it('resolves npm package with explicit major version to module', () => {
      expect.assertions(1)

      const isEqual = require('test-fixture-0')

      return resolveAssertion(
        'npm://@assertions/test-fixture:v0'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEqual.toString())
      )
    })

    it('resolves npm package with explicit minor version to module', () => {
      expect.assertions(1)

      const isEqual = require('test-fixture-2')

      return resolveAssertion(
        'npm://@assertions/test-fixture:v2.4.1'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEqual.toString())
      )
    })

    it('resolves npm package with version in non-prefixed format', () => {
      expect.assertions(1)

      const isEqual = require('test-fixture-2')

      return resolveAssertion(
        'npm://@assertions/test-fixture:2'
      ).then(assertion =>
        expect(assertion.toString()).toStrictEqual(isEqual.toString())
      )
    })
  })
})
