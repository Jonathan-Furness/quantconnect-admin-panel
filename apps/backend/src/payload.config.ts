import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { env } from '@/env/server'
import { env as clientEnv } from '@/env/client'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Strategies } from '@/collections/strategies/Strategies'
import { StrategyValues } from './collections/strategies/StrategyValues'
import { Commands } from './collections/strategies/Commands'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // serverURL: process.env.PAYLOAD_SERVER_URL || 'http://localhost:3000',
  routes: {
    admin: '/',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    ...(env.NODE_ENV === 'development' && {
      autoLogin: {
        email: clientEnv.NEXT_PUBLIC_DEV_EMAIL,
        password: clientEnv.NEXT_PUBLIC_DEV_PASSWORD,
      },
    }),
  },
  collections: [Strategies, StrategyValues, Commands, Users, Media],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      database: env.DB_NAME || '',
      password: env.DB_PASSWORD || '',
      user: env.DB_USER || '',
      host: env.DB_HOST || '',
      port: env.DB_PORT,
    },
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
