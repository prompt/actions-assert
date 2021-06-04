// This file (`is-equal.js`) is a simple example assertion used as part of the
// integration tests for the Action, it is not an assertion to be used by
// Action consumers.

// Please see the documentation for available assertions
// https://github.com/pr-mpt/actions-assert#assertions

module.exports = function (expected, actual) {
  return {
    pass: (actual == expected),
    message: `compared ${actual} to ${expected}`
  }
}
