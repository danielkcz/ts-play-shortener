import * as functions from 'firebase-functions'

export type TFunctionsConfig = {
  playground: {
    readonly baseurl: string
  }
  redirector: {
    readonly baseurl: string
  }
}

export function getConfig<TG extends keyof TFunctionsConfig, TK extends keyof TFunctionsConfig[TG]>(
  groupKey: TG,
  valueKey: TK,
): TFunctionsConfig[TG][TK] {
  const cfg = readConfig()
  const group = cfg[groupKey]
  if (!group) {
    throw new Error(`Missing config group ${groupKey}`)
  }
  const value = group[valueKey]
  if (!group) {
    throw new Error(`Missing config value ${valueKey} in group ${groupKey}`)
  }
  return value
}

function readConfig() {
  if (process.env.FUNCTIONS_EMULATOR) {
    return require('../../.runtimeconfig.json')
  }
  return functions.config()
}
