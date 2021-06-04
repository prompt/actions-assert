import {Assertion} from './execute'

async function loadAssertionFromFile(filename: string): Promise<Assertion> {
  return eval(`require('${filename}')`)
}

const resolvers = {
  workflows: async (name: string): Promise<Assertion> =>
    loadAssertionFromFile(`./../.github/workflows/assertions/${name}.js`)
}

export async function resolveAssertion(resource: string): Promise<Assertion> {
  if (!resource.includes('://')) {
    throw new URIError(`Assertion reference is not valid, must include type.`)
  }

  const [type, name] = resource.split('://')

  if (!resolvers.hasOwnProperty(type)) {
    throw new RangeError(`Assertion type ${type} is not supported.`)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await resolvers[type](name)
}
