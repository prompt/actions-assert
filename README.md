# Assert

A GitHub Action for asserting **actual** is **expected** in GitHub Workflows.
Designed for GitHub Action integration tests and robust build pipelines.

* Cast action input values from strings to `type` for type safety
* Distribute reusable assertions via npm
* Write local Javascript assertions to meet project-specific testing needs
* Run tests against multiple values using `each`

```yaml
jobs:
  test-actor:
    runs-on: ubuntu-latest
    steps:
      - name: Test actor is @shrink
        uses: pr-mpt/actions-assert@v2
        with:
          assertion: npm://@assertions/is-equal
          actual: "${{ github.actor }}"
          expected: shrink
```

:package: [Automatic Release Packaging](#automatic-release-packaging) is used by
this action, please reference by tag or commit hash in your Workflows.

## Inputs

| Name | Description | Default | Examples |
| :--- | :---------- | :------ | :------- |
| **`assertion`** | **Reference to a supported [assertion](#assertions) in `source://name` format** | | **`npm://@assertions/is-equal`**<br/>**`local://is-even`** |
| `expected` | Value the assertion is looking for | | `Hello, World!` |
| `actual` | Value the assertion will test against the expected value | | `${{steps.fields.outputs.greeting}}` |
| `type` | A supported [data type](#data-types) that `actual` and `expected` will be cast to before performing assertion | `string` | `string` `json` `number` |
| `each` | Parse multi-line `actual` into many values and test each | `false` | `true` `false` |
| `local-path` | Path to directory containing `local` assertion | `${{github.workspace}}` | `.github/workflows/assertions` |

### Assertions

An `assertion` is a Javascript function that accepts `expected` and `actual`
parameters then returns a `Result`. A `Result` has a boolean `pass` parameter
and a `message` string.

```javascript
module.exports = function (expected, actual) {
  return {
    pass: (actual === expected),
    message: `compared ${actual} to ${expected}`
  }
}
```

Assertion references are resolved using `source` and `name` accepted in
`source://name` format.

#### Sources

| Source | Resolved To | Example |
| :--- | :---------- | :------ |
| `npm` | An [npm<sup>&neArr;</sup>][npm] package with an assertion as the [main exported module<sup>&neArr;</sup>][package.json/main] | `npm://@assertions/is-equal` |
| `local` | A Javascript file (on the runner's filesystem) that exports an assertion as default | `local://is-equal` |

##### `npm`

A collection of first-party assertions is available on npm within the
[`@assertions`<sup>&neArr;</sup>][npm/@assertions] organisation.

| Package | Test |
| :------ | :---------- |
| [@assertions/is-equal] | `actual` is equal in value to `expected` |
| [@assertions/is-strictly-equal] | `actual` is equal in value and type to `expected` |
| [@assertions/starts-with] | `actual` starts with `expected` |
| [@assertions/directory-exists] | path `expected` exists and is a directory |

Third-party assertions are discoverable via
[:mag_right: `actions-assert` on npm][npm/search].

###### Distributing Assertions

Add :bookmark: `actions-assert` to
[package.json `keywords`<sup>&neArr;</sup>][package.json/keywords] for an
assertion to be discoverable via [npm search<sup>&neArr;</sup>][npm/search].

### Data Types

| Name | Description |
| :--- | :---------- |
| `string` | A Javascript [`String`<sup>&neArr;</sup>][javascript/string] |
| `number` | A Javascript [`Number`<sup>&neArr;</sup>][javascript/number] |
| `json` | JavaScript value or object from [`JSON.parse()`<sup>&neArr;</sup>][javascript/json/parse] |

## Outputs

| Name | Description | Example |
| :--- | :---------- | :-------|
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
        uses: pr-mpt/actions-semver-aliases@v1
        with:
          version: "3.14.1"
          prefix: "v"
          major: true
          minor: false
      - name: Assert alias is prefixed
        uses: pr-mpt/actions-assert@v2
        with:
          assertion: npm://@assertions/starts-with
          each: true
          actual: "${{ steps.prefixed.outputs.list }}"
          expected: "v"
```

## Automatic Release Packaging

Packaging (creation of `dist`) happens automatically when a new tag is created.
Any reference to this Action in a Workflow must use a [tag][tags] (mutable) or
the commit hash of a tag (immutable).

```yaml
✅ uses: pr-mpt/actions-assert@v2
✅ uses: pr-mpt/actions-assert@v2.0.0
✅ uses: pr-mpt/actions-assert@0d888b7601af756fff1ffc9d0d0dca8fcc214f0a
❌ uses: pr-mpt/actions-assert@main
```

The blog post
[Package GitHub Actions automatically with GitHub Actions][blog/package-automatically]
describes how this achieved.

[javascript/string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[javascript/number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[javascript/json/parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[pr-mpt/actions-semver-aliases]: https://github.com/pr-mpt/actions-semver-aliases
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
[tags]: https://github.com/pr-mpt/actions-assert/tags
