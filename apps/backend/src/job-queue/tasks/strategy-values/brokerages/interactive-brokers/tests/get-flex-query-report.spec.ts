import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getInteractiveBrokersFlexQueryReport } from '../index'

describe('getInteractiveBrokersFlexQueryReport', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should parse query report correctly', async () => {
    // Mock successful XML response with sample data
    const mockResponse = `
      <FlexQueryResponse>
        <FlexStatements>
          <FlexStatement toDate="20230615">
            <EquitySummaryInBase>
              <EquitySummaryByReportDateInBase total="10000.50"/>
            </EquitySummaryInBase>
            <CashReport>
              <CashReportCurrency accounttransfers="500.25" depositWithdrawals="200.75"/>
            </CashReport>
          </FlexStatement>
        </FlexStatements>
      </FlexQueryResponse>
    `

    ;(global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await getInteractiveBrokersFlexQueryReport('ref123')

    expect(result.net_liquidation_value).toBe(10000.5)
    expect(result.net_cash_movement).toBe(701) // 500.25 + 200.75
    expect(result.date).toEqual('2023-06-15') // June 15, 2023
  })

  it('should handle missing values with defaults', async () => {
    // XML with missing fields
    const mockResponse = `
      <FlexQueryResponse>
        <FlexStatements>
          <FlexStatement toDate="20230615">
          </FlexStatement>
        </FlexStatements>
      </FlexQueryResponse>
    `

    ;(global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await getInteractiveBrokersFlexQueryReport('ref123')

    expect(result.net_liquidation_value).toBe(0)
    expect(result.net_cash_movement).toBe(0)
    expect(result.date).toEqual('2023-06-15')
  })
})
