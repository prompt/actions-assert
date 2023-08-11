// This file (`is-null.js`) is a simple example assertion used as part of the
// integration tests for the Action, it is not an assertion to be used by
// Action consumers.

// Please see the documentation for available assertions
// https://github.com/prompt/actions-assert#assertions

module.exports = function (expected, actual) {
  return {
    pass: (expected === null && actual === null),
    message: `tested ${typeof expected} ${expected} + ${typeof actual} ${actual}`
  }
}
