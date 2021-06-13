import {Assertion} from './execute'
import {PluginManager} from 'live-plugin-manager'

async function loadAssertionFromNpmPackage(name: string): Promise<Assertion> {
  const manager = new PluginManager()

  await manager.install(name)

  return manager.require(name)
}

const resolvers = {
  npm: loadAssertionFromNpmPackage,
  local: async (name: string, path: string): Promise<Assertion> =>
    eval(`require('${path}/${name}.js')`)
}

export async function resolveAssertion(
  resource: string,
  localPath = ''
): Promise<Assertion> {
  if (!resource.includes('://')) {
    throw new URIError(`Assertion reference is not valid, must include type.`)
  }

  const [source, name] = resource.split('://')

  if (!resolvers.hasOwnProperty(source)) {
    throw new RangeError(`Assertion source ${source} is not supported.`)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return resolvers[source](name, localPath)
}
