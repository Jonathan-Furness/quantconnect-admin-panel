import { TaskConfig } from 'payload'
import { storeInteractiveBrokersAccountValues } from './brokerages/interactive-brokers'
import { z } from 'zod'
import { IBMethodOptionsSchema } from './brokerages/interactive-brokers/input-schema'

const InputSchema = z.object({
  storage_method: z.string().min(1),
  strategy_id: z.number().min(1),
  method_options: IBMethodOptionsSchema,
  frequency: z.string().min(1),
})

export const storeStrategyValues: TaskConfig<'store-strategy-values'> = {
  slug: 'store-strategy-values',
  inputSchema: [
    {
      name: 'storage_method',
      type: 'text',
      required: true,
    },
    {
      name: 'strategy_id',
      type: 'number',
      required: true,
    },
    {
      name: 'method_options',
      type: 'json',
      required: true,
    },
    {
      name: 'frequency',
      type: 'text',
      required: true,
    },
  ],
  retries: {
    shouldRestore: true,
  },
  handler: async ({ input, req }) => {
    const payload = req.payload
    const { data, error } = InputSchema.safeParse(input)

    if (error) {
      throw new Error(error.message)
    }

    try {
      const { storage_method, strategy_id, method_options } = data

      switch (storage_method) {
        case 'ib-storage-block':
          await storeInteractiveBrokersAccountValues({
            payload,
            strategy_id,
            flex_query_id: method_options.flex_query_id,
          })
          break
        default:
          break
      }
    } catch (err) {
      payload.logger.error(err)
    }

    await payload.jobs.queue({
      task: 'store-strategy-values',
      queue: data.frequency,
      input,
    })

    return { output: {} }
  },
}
