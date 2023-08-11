# Assert

A GitHub Action for asserting **actual** is **expected** in GitHub Workflows,
designed for GitHub Action integration tests and robust build pipelines.

- Cast action input values from strings to `type` for type safety
- Distribute reusable assertions via npm
- Write local Javascript assertions to meet project-specific testing needs
- Run tests against multiple values using `each`

```yaml
jobs:
  test-actor:
    runs-on: ubuntu-latest
    steps:
      - name: Test actor is @shrink
        uses: prompt/actions-assert@v4
        with:
          assertion: npm://@assertions/is-equal:v1
          actual: "${{ github.actor }}"
          expected: shrink
```

[Jump to complete examples &darr;](#examples)

## Outputs

| Name      | Description                                     | Example                                      |
| :-------- | :---------------------------------------------- | :------------------------------------------- |
| `message` | Human readable result of the assertion          | `Value is equal to expected "Hello, World!"` |
| `passed`  | Boolean describing whether the assertion passed | `true`                                       |
| `failed`  | Boolean describing whether the assertion failed | `false`                                      |

## Inputs

| Name                                  | Description                                                                                                   | Default                 | Examples                                                      |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------ | :---------------------- | :------------------------------------------------------------ |
| **`assertion`**                       | **Reference to a supported [assertion](#assertions) in `source://name` format**                               |                         | **`npm://@assertions/is-equal:v1`**<br/>**`local://is-even`** |
| `expected`                            | Value the assertion is looking for                                                                            |                         | `Hello, World!`                                               |
| `actual`                              | Value the assertion will test against the expected value                                                      |                         | `${{steps.fields.outputs.greeting}}`                          |
| `error-message`                       | Error message to output when assertion fails                                                                  |                         | `Commit does not include a distributable build`               |
| `type`                                | A supported [data type](#data-types) that `actual` and `expected` will be cast to before performing assertion | `string`                | `string` `json` `number`                                      |
| `each`                                | Parse multi-line `actual` into many values and perform assertion against each                                 | `false`                 | `true` `false`                                                |
| `local-path`                          | Path to directory containing `local` assertion                                                                | `${{github.workspace}}` | `.github/workflows/assertions`                                |
| `error-on-fail`                       | Report error in step when assertion fails                                                                     | `true`                  | `false`                                                       |
| `convert-empty-to-null`<sup>[1]</sup> | Convert empty input values to null                                                                            | `true`                  | `false`                                                       |

[1] `convert-empty-to-null` is a workaround for a
[GitHub Actions Runner bug #924][runner/empty-input-bug]

### Data Types

| Name     | Description                                                                               |
| :------- | :---------------------------------------------------------------------------------------- |
| `string` | A Javascript [`String`<sup>&neArr;</sup>][javascript/string]                              |
| `number` | A Javascript [`Number`<sup>&neArr;</sup>][javascript/number]                              |
| `json`   | JavaScript value or object from [`JSON.parse()`<sup>&neArr;</sup>][javascript/json/parse] |

### Each

When `each` is enabled, the Action splits `actual` by new-line into multiple
values and asserts against each value. The final result is an aggregate of each
result: all individual assertions must pass for the aggregate to pass.

### Assertions

An `assertion` is a Javascript function that accepts `expected` and `actual`
parameters and then returns a `Result`. A `Result` has a boolean `pass`
parameter and a `message` string.

```javascript
module.exports = function (expected, actual) {
  return {
    pass: actual === expected,
    message: `compared ${actual} to ${expected}`
  }
}
```

#### Sources

The test builder resolves assertion references using `source` and `name`
accepted in `source://name` format.

| Source  | Resolved To                                                                                                                  | Example                         |
| :------ | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `npm`   | An [npm<sup>&neArr;</sup>][npm] package with an assertion as the [main exported module<sup>&neArr;</sup>][package.json/main] | `npm://@assertions/is-equal:v1` |
| `local` | A Javascript file (on the runner's filesystem) that exports an assertion as default                                          | `local://is-equal`              |

##### `npm`

###### Version Pinning

:pushpin: An npm assertion reference **should** include a valid npm package
version. Unlike npm itself, an npm assertion reference without a version will
default to `v1` instead of `latest`.

```yaml
ℹ️ assertion: npm://@assertions/is-equal
✅ assertion: npm://@assertions/is-equal:1
✅ assertion: npm://@assertions/is-equal:v1
✅ assertion: npm://@assertions/is-equal:v1.0.0
✅ assertion: npm://@assertions/is-equal:latest
```

###### @assertions

A collection of first-party assertions is available on npm within the
[`@assertions`<sup>&neArr;</sup>][npm/@assertions] organisation.

| Package                         | Test                                              |
| :------------------------------ | :------------------------------------------------ |
| [@assertions/is-equal]          | `actual` is equal in value to `expected`          |
| [@assertions/is-strictly-equal] | `actual` is equal in value and type to `expected` |
| [@assertions/starts-with]       | `actual` starts with `expected`                   |
| [@assertions/directory-exists]  | path `expected` exists and is a directory         |

Third-party assertions are discoverable via
[:mag_right: `actions-assert` on npm][npm/search].

###### Distributing Assertions

Add :bookmark: `actions-assert` to
[package.json `keywords`<sup>&neArr;</sup>][package.json/keywords] for an
assertion to be discoverable via [npm search<sup>&neArr;</sup>][npm/search].

## Examples

### SemVer Aliases Are Prefixed

[prompt/actions-semver-aliases] generates aliases for a Semantic Version with an
optional prefix, in this example, the job tests that the optional prefix is
applied to each alias.

```yaml
on: push

jobs:
  test-aliases-are-prefixed:
    runs-on: ubuntu-latest
    steps:
      - name: Generate SemVer aliases with prefix
        id: prefixed
        uses: prompt/actions-semver-aliases@v1
        with:
          version: "3.14.1"
          prefix: "v"
          major: true
          minor: false
      - name: Assert alias is prefixed
        uses: prompt/actions-assert@v4
        with:
          assertion: npm://@assertions/starts-with:v1
          each: true
          actual: "${{ steps.prefixed.outputs.list }}"
          expected: "v"
          error-message: "SemVer Alias is not prefixed with v"
```

A complete test Workflow for [prompt/actions-semver-aliases] using multiple
assertions is available in
[`.github/workflows/test.yml`][prompt/actions-semver-aliases/tests].

### Delete Invalid Tags

A repository may restrict tags to commits that include a specific file; in this
example, the job deletes a newly created tag if the distributable directory
(`dist`) does not exist.

```yaml
on:
  push:
    tags:
      - "**"

jobs:
  validate-tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: prompt/actions-assert@v4
        with:
          assertion: npm://@assertions/directory-exists:v1
          expected: dist
          error-message: "A commit without a dist is not allowed to be tagged"
      - if: failure()
        name: Delete tag
        uses: prompt/actions-delete-tag@v1
```

## Automatic Release Packaging

A Workflow packages the Action automatically when a collaborator created a new
tag. Any reference to this Action in a Workflow must use a [tag][tags] (mutable)
or the commit hash of a tag (immutable).

```yaml
✅ uses: prompt/actions-assert@v2
✅ uses: prompt/actions-assert@v2.0.0
✅ uses: prompt/actions-assert@0d888b7601af756fff1ffc9d0d0dca8fcc214f0a
❌ uses: prompt/actions-assert@main
```

The blog post
[Package GitHub Actions automatically with GitHub Actions][blog/package-automatically]
describes how this achieved.

[javascript/string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[javascript/number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[javascript/json/parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[prompt/actions-semver-aliases]: https://github.com/prompt/actions-semver-aliases
[npm]: https://npmjs.com
[npm/search]: https://www.npmjs.com/search?q=keywords%3Aactions-assert
[package.json/main]: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main
[package.json/keywords]: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#keywords
[@assertions/is-equal]: https://npmjs.com/package/@assertions/is-equal
[@assertions/is-strictly-equal]: https://npmjs.com/package/@assertions/is-strictly-equal
[@assertions/starts-with]: https://npmjs.com/package/@assertions/starts-with
[@assertions/directory-exists]: https://npmjs.com/package/@assertions/directory-exists
[npm/@assertions]: https://www.npmjs.com/org/assertions
[workflows/workspace]: https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context
[blog/package-automatically]: https://medium.com/prompt/package-github-actions-automatically-with-github-actions-a70b9f7bae4
[tags]: https://github.com/prompt/actions-assert/tags
[prompt/actions-semver-aliases/tests]: https://github.com/prompt/actions-semver-aliases/blob/main/.github/workflows/test.yml
[runner/empty-input-bug]: https://github.com/actions/runner/issues/924
