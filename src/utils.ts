import {env} from 'process'

export function hasActionInput(name: string): boolean {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}` in env
}
