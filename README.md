# Assert

A GitHub Action for asserting `actual` is `expected` in GitHub Workflows.
Designed for GitHub Action integration tests and build pipelines.

* Cast action input values from strings to `type` for robust assertions
* Add custom Javascript assertions to your project to meet unique testing requirements
* Run tests against multiple values using `each`

[Jump to examples &darr;](#examples)

## Inputs

| Name | Description | Default | Examples |
| :- | :---------- | :------ | :------- |
| **`assertion`** | **Name of a supported [assertion](#assertions)** | | **`is-equal`** |
| **`actual`** | **Dynamic value to perform test on** | | **`${{steps.m.outputs.greeting}}`** |
| `expected` | Value that `actual` should match | | `Hello, World!` |
| `type` | A supported [data type](#data-types) that `actual` and `expected` will be cast to before performing assertion | `string` | `string` `json` `number` |
| `each` | Parse multi-line `actual` into many values and test each | `false` | `true` `false` |

### Assertions

#### `is-equal`

Assert that `expected` is equal to `actual` using strict comparison of type and
value.

### Data Types

| Name | Description |
| :--- | :---------- |
| `string` | A Javascript [`String`][javascript/string] |
| `number` | A Javascript [`Number`][javascript/number] |
| `json` | JavaScript value or object from [`JSON.parse()`][javascript/json/parse] |

## Outputs

| Name | Description | Example |
| :- | :---------- | :-------|
| `message` | Human readable result of the assertion | `Value is Hello, World!` |
| `pass` | Boolean describing whether the assertion passed | `true` |

## Examples

### SemVer Aliases Are Prefixed

[pr-mpt/actions-semver-aliases] generates aliases for a Semantic Version with an
optional prefix, here we test that this prefix is applied to each alias.

```yaml
jobs:
  test-aliases-are-prefixed:
    runs-on: ubuntu-latest
    steps:
      - name: Generate SemVer aliases with prefix
        id: prefixed
        uses: pr-mpt/actions-semver-aliases@v0
        with:
          version: "3.14.1"
          prefix: "v"
          major: true
          minor: false
      - name: Assert alias is prefixed
        uses: pr-mpt/actions-assert@v1
        with:
          assertion: is-equal
          actual: "${{ steps.prefixed.outputs.csv }}"
          expected: "v3"
```

[javascript/string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[javascript/number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[javascript/json/parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[pr-mpt/actions-semver-aliases]: https://github.com/pr-mpt/actions-semver-aliases
