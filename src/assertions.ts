import {Assertion} from './execute'
import {PluginManager} from 'live-plugin-manager'

async function loadAssertionFromFile(filename: string): Promise<Assertion> {
  return eval(`require('${filename}')`)
}

async function loadAssertionFromNpmPackage(name: string): Promise<Assertion> {
  const manager = new PluginManager()

  await manager.install(name)

  return manager.require(name)
}

const resolvers = {
  npm: loadAssertionFromNpmPackage,
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
  return resolvers[type](name)
}
