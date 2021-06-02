export default function (expected, actual) {
  return {
    pass: (actual == expected),
    message: `compared ${actual} to ${expected}`
  }
}
