export default function (expected, actual) {
  return {
    success: (actual.value == expected.value),
    message: `compared ${actual} to ${expected}`
  }
}
