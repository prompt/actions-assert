import * as core from '@actions/core'
import {executeTests, InputType} from './execute'

async function run(): Promise<void> {
  try {
    const expected: string = core.getInput('expected', {required: false})
    const actual: string = core.getInput('expected', {required: true})
    const assertion: string = core.getInput('assertion', {required: true})

    const test = {
      expected: {type: InputType.String, value: expected},
      actual: {type: InputType.String, value: actual},
      assertion: await import(`../assertions/${assertion}`)
    }

    executeTests([test])

    core.setOutput('result', 'Action executed successfully')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
