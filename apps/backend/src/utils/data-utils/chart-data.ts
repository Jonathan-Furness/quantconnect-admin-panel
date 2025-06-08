import { StrategyValue } from '@/payload-types'
import { ChartValue } from '@/types/chart'
import { Decimal } from 'decimal.js'

export function calculatePerformance(data: StrategyValue[]): ChartValue[] {
  return data.reduce((acc, curr, index, array) => {
    if (index === 0) {
      acc.push({
        date: Date.parse(curr.date),
        value: 0,
        change: 0,
      })
      return acc
    }

    const prevValue = new Decimal(array[index - 1]?.value || 0)
    const cashMovement = new Decimal(curr.net_cash_movement || 0)
    const currentValue = new Decimal(curr.value)
    const dailyChange = prevValue.equals(0)
      ? new Decimal(0)
      : currentValue.sub(cashMovement).div(prevValue).sub(1)

    const previousCumRet = new Decimal(acc.at(index - 1)?.value || 0).div(100)
    let cumulativeReturn = dailyChange.add(1)
    cumulativeReturn = cumulativeReturn.mul(Decimal.add(1, previousCumRet)).sub(1)

    acc.push({
      date: Date.parse(curr.date),
      value: cumulativeReturn.mul(100).toNumber(),
      change: dailyChange.mul(100).toNumber(),
    })
    return acc
  }, [] as ChartValue[])
}

export function calculateAccountValues(data: StrategyValue[]): ChartValue[] {
  return data.reduce((arr, curr) => {
    arr.push({
      date: Date.parse(curr.date),
      value: curr.value,
      change: curr.net_cash_movement || 0,
    })
    return arr
  }, [] as ChartValue[])
}
