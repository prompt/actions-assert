import {Assertion} from './execute'

export async function resolveAssertion(name: string): Promise<Assertion> {
  return eval(`require('./../assertions/${name}.js')`)
}
