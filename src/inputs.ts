import {string, number, create, coerce, unknown} from 'superstruct'

export enum InputType {
  String,
  Number,
  Json
}

export interface Input {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  type: InputType
}

export const coercions = {
  [InputType.String]: coerce(string(), string(), value => value),
  [InputType.Number]: coerce(number(), string(), value => Number(value)),
  [InputType.Json]: coerce(unknown(), string(), value => JSON.parse(value))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function valueOfInput(input: Input): any {
  if (input.value === null) {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return create(input.value, coercions[input.type])
}
