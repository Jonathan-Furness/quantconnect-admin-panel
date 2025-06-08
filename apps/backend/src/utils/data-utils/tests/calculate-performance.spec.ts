import { StrategyValue } from '@/payload-types'
import { calculatePerformance } from '../chart-data'
import { describe, it, expect } from 'vitest'

describe('calculatePerformance', () => {
  it('should handle an emtpy array', () => {
    const data: StrategyValue[] = []

    const result = calculatePerformance(data)

    expect(result).toEqual([])
  })

  it('should calculate daily change', () => {
    const data = [
      {
        id: 1,
        date: new Date(2025, 6, 1).toISOString(),
        value: 100_000,
        net_cash_movement: 100_000,
      },
      {
        id: 2,
        date: new Date(2025, 6, 2).toISOString(),
        value: 105_000,
        net_cash_movement: 0,
      },
      {
        id: 3,
        date: new Date(2025, 6, 3).toISOString(),
        value: 110_000,
        net_cash_movement: 0,
      },
      {
        id: 4,
        date: new Date(2025, 6, 4).toISOString(),
        value: 105_000,
        net_cash_movement: -5_000,
      },
      {
        id: 5,
        date: new Date(2025, 6, 5).toISOString(),
        value: 110_000,
        net_cash_movement: 0,
      },
    ] as StrategyValue[]

    const result = calculatePerformance(data)

    expect(result.at(0)?.change).toBe(0)
    expect(result.at(1)?.change).toBe(5)
    expect(result.at(2)?.change).toBeCloseTo(4.76)
    expect(result.at(3)?.change).toBeCloseTo(0)
    expect(result.at(4)?.change).toBeCloseTo(4.76)
  })

  it('should calculate cumulative performance', () => {
    const data = [
      {
        id: 1,
        date: new Date(2025, 6, 1).toISOString(),
        value: 100_000,
        net_cash_movement: 100_000,
      },
      {
        id: 2,
        date: new Date(2025, 6, 2).toISOString(),
        value: 105_000,
        net_cash_movement: 0,
      },
      {
        id: 3,
        date: new Date(2025, 6, 3).toISOString(),
        value: 110_000,
        net_cash_movement: 0,
      },
      {
        id: 4,
        date: new Date(2025, 6, 4).toISOString(),
        value: 105_000,
        net_cash_movement: -5_000,
      },
      {
        id: 5,
        date: new Date(2025, 6, 5).toISOString(),
        value: 110_000,
        net_cash_movement: 0,
      },
    ] as StrategyValue[]

    const result = calculatePerformance(data)

    expect(result.at(0)?.value).toBe(0)
    expect(result.at(1)?.value).toBe(5)
    expect(result.at(2)?.value).toBe(10)
    expect(result.at(3)?.value).toBe(10)
    expect(result.at(4)?.value).toBeCloseTo(15.238)
  })
})
