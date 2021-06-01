import * as core from '@actions/core'
import {executeTests, InputType} from './execute'

async function run(): Promise<void> {
  try {
    const expected: string = core.getInput('expected')
    const actual: string = core.getInput('actual')
    const assertion: string = core.getInput('assertion')

    const test = {
      expected: {type: InputType.String, value: expected},
      actual: {type: InputType.String, value: actual},
      assertion: (await import(`./../assertions/${assertion}`)).default
    }

    // eslint-disable-next-line no-console
    console.log(executeTests([test]))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
