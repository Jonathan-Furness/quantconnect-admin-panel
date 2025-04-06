import { Strategy, StrategyStorageMethod } from '@/payload-types'
import { Endpoint } from 'payload'
import { z } from 'zod'
import { BasicStorageBlock } from '../../StorageMethods/blocks/basic-storage'

const bodySchema = z.object({
  project_id: z.string(),
  date: z.string().date(),
  value: z.number().min(0),
  net_cash_movement: z.number().default(0),
})

export const storeEndpoint: Endpoint = {
  method: 'post',
  path: '/store',
  handler: async (req) => {
    try {
      const body = await req?.json?.()

      const apiKey = req.headers.get('x-api-key')

      if (!apiKey && !req.user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const { data, error } = bodySchema.safeParse(body)

      if (error) {
        console.error(error)
        return Response.json({ message: 'Bad request' }, { status: 400 })
      }

      const { project_id, date, value, net_cash_movement } = data

      const { docs, totalDocs } = await req.payload.find({
        collection: 'strategies',
        depth: 5,
        limit: 1,
        where: {
          project_id: {
            equals: project_id,
          },
        },
      })

      if (!totalDocs) {
        return Response.json({ message: 'Strategy not found' }, { status: 404 })
      }

      const strategy = docs[0] as Strategy
      const storageMethods = strategy?.strategy_values?.options?.docs?.at(
        0,
      ) as StrategyStorageMethod

      const basicStorageStrategy = storageMethods?.methods?.find(
        (strategy) => strategy.blockType === 'basic-storage-block',
      )

      if (!basicStorageStrategy) {
        return Response.json({ message: 'Storage strategy not found' }, { status: 404 })
      }

      if (basicStorageStrategy.api_key !== apiKey) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
      }

      await req.payload.create({
        collection: 'strategy-values',
        data: {
          strategy: strategy.id,
          date,
          value,
          net_cash_movement,
        },
      })

      return Response.json({ message: 'success' })
    } catch (err) {
      console.error(err)
      return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
  },
}
