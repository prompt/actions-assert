import * as core from '@actions/core'
import {executeTests} from './execute'
import {InputType} from './inputs'

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const type: InputType = types[core.getInput('type')]

    const test = {
      expected: {type, value: expected},
      actual: {type, value: actual},
      assertion: (await import(`./../assertions/${assertion}`)).default
    }

    executeTests([test]).forEach(result => {
      core.info(result.pass.toString())
      result.pass ? core.setFailed(result.message) : core.info(result.message)
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
