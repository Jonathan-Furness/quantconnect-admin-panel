import { createJiti } from 'jiti'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const jiti = createJiti(currentDir)

export const validateEnvs = () => {
  jiti
    .import('./server')
    .then((_) => console.log('ENV (server) - Validated'))
    .catch((err) => {
      console.error(err)
      throw err
    })
  jiti
    .import('./client')
    .then((_) => console.log('ENV (client) - Validated'))
    .catch((err) => {
      console.error(err)
      throw err
    })
}
