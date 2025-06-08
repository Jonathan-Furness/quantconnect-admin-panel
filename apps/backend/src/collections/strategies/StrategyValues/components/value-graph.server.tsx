import { UIFieldServerProps } from 'payload'
import { ValuesGraphClient } from './value-graph.client'
import { ChartType, ChartValue } from '@/types/chart'
import { calculateAccountValues, calculatePerformance } from '@/utils/data-utils/chart-data'

export const ValueGraph = async ({ payload, id, req }: UIFieldServerProps) => {
  const end = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const start = req.searchParams.get('start') || sixMonthsAgo.toISOString()
  const endDate = req.searchParams.get('end') || end.toISOString()

  const data = await payload.find({
    collection: 'strategy-values',
    where: {
      strategy: {
        equals: id,
      },
      date: {
        greater_than_equal: new Date(start).toISOString(),
        less_than_equal: new Date(endDate).toISOString(),
      },
    },
    sort: ['date'],
    limit: 0,
  })

  const type = (req.searchParams.get('type') || 'values') as ChartType
  const chartData: ChartValue[] =
    type === 'percent' ? calculatePerformance(data.docs) : calculateAccountValues(data.docs)

  return (
    <ValuesGraphClient type={type} data={chartData} initialStart={start} initialEnd={endDate} />
  )
}
