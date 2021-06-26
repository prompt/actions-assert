import * as core from '@actions/core'
import {env} from 'process'

export function hasActionInput(name: string): boolean {
  const key = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`

  if (core.getBooleanInput('convert-empty-to-null') && env[key] == '') {
    return false
  }

  return key in env
}
