import { Strategy } from '@/payload-types'
import { TaskConfig } from 'payload'

export const queueAccountValueTasks: TaskConfig<'queue-account-value-tasks'> = {
  slug: 'queue-account-value-tasks',
  inputSchema: [
    {
      name: 'frequency',
      type: 'text',
      required: true,
    },
  ],
  retries: {
    shouldRestore: false,
  },
  handler: async ({ input, req }) => {
    const { frequency } = input
    const payload = req.payload

    const storageOptions = await payload.find({
      collection: 'strategy-storage-methods',
      where: {
        frequency: {
          equals: frequency,
        },
      },
      select: {
        strategy: true,
        methods: true,
      },
    })

    if (storageOptions.totalDocs === 0 || !storageOptions.docs) {
      payload.logger.error('No storage options found for frequency', frequency)
      return {
        output: {},
      }
    }

    const existingQueue = await payload.find({
      collection: 'payload-jobs',
      where: {
        queue: {
          equals: frequency,
        },
        taskSlug: {
          equals: 'store-strategy-values',
        },
      },
    })

    for (let i = 0; i < storageOptions.docs.length; i++) {
      const doc = storageOptions.docs[i]
      const methods = doc?.methods || []

      for (let j = 0; j < methods.length; j++) {
        const method = methods[j]

        const input = {
          storage_method: method?.blockType as any,
          strategy_id: (doc?.strategy as Strategy)?.id as any,
          method_options: method as any,
          frequency,
        }

        if (
          existingQueue.docs.some(
            (job) =>
              job.input &&
              (job.input as any)?.strategy_id === input.strategy_id &&
              (job.input as any)?.storage_method === input.storage_method,
          )
        ) {
          continue
        }

        await payload.jobs.queue({
          task: 'store-strategy-values',
          queue: frequency,
          input,
        })
      }
    }

    return {
      output: {},
    }
  },
}
