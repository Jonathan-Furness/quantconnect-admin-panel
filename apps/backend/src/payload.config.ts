import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { env } from '@/env/server'
import { env as clientEnv } from '@/env/client'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Strategies } from '@/collections/strategies/Strategies'
import { Commands } from './collections/strategies/Command'
import { getServerUrl } from './utils/vercel-utils'
import { StrategyValues } from './collections/strategies/StrategyValues'
import { StorageMethods } from './collections/strategies/StorageMethods'

import { queueAccountValueTasks } from './job-queue/tasks/strategy-values/queue-account-value-tasks'
import { storeStrategyValues } from './job-queue/tasks/strategy-values/store-strategy-values'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerUrl(),
  routes: {
    admin: '/',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      header: [
        {
          path: './components/modals/command-modal.tsx',
          exportName: 'CommandModal',
        },
      ],
    },
    ...(env.NODE_ENV === 'development' && {
      autoLogin: {
        email: clientEnv.NEXT_PUBLIC_DEV_EMAIL,
        password: clientEnv.NEXT_PUBLIC_DEV_PASSWORD,
      },
    }),
  },
  collections: [Strategies, StrategyValues, StorageMethods, Commands, Users, Media],
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
  jobs: {
    tasks: [queueAccountValueTasks, storeStrategyValues],
    workflows: [],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      return {
        ...defaultJobsCollection,
        admin: {
          ...defaultJobsCollection.admin,
          components: {
            listMenuItems: [],
          },
          hidden: false,
        },
      }
    },
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${env.CRON_SECRET}`
      },
    },
  },
  sharp,
  onInit: async (payload) => {
    await payload.jobs.queue({
      task: 'queue-account-value-tasks',
      input: {
        frequency: 'daily',
      },
    })
  },
})
