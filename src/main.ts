import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    core.setOutput("result", "Action executed successfully")
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
