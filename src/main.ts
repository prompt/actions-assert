import * as core from '@actions/core'
import {executeTests, Test, Assertion} from './execute'
import {InputType} from './inputs'
import {resolveAssertion} from './assertions'

const types = {
  string: InputType.String,
  number: InputType.Number,
  json: InputType.Json
}

async function run(): Promise<void> {
  try {
    const expected: string = core.getInput('expected')
    const actual: string = core.getInput('actual')
    const assertion: string = core.getInput('assertion')
    const type: string = core.getInput('type')
    const each: boolean = core.getBooleanInput('each')

    if (type in types === false) {
      throw new Error(
        `${type} is not a valid type, valid: ${Object.keys(types).join(', ')}`
      )
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const typeOfInput: InputType = types[type]
    const assertionFunction: Assertion = await resolveAssertion(assertion)

    const actualValues: String[] = each === true ? actual.split('\n') : [actual]

    const tests: Test[] = actualValues.map(actualValue => {
      return {
        expected: {type: typeOfInput, value: expected},
        actual: {type: typeOfInput, value: actualValue},
        assertion: assertionFunction
      }
    })

    executeTests(tests).forEach(result => {
      result.pass
        ? core.info(`✅ ${result.message}`)
        : core.setFailed(`❌ ${result.message}`)

      core.setOutput('message', result.message)
      core.setOutput('pass', result.pass.toString())
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
