module.exports = function (expected, actual) {
  return {
    pass: (actual % 2 === 0),
    message: `tested ${actual} is even`
  }
}
