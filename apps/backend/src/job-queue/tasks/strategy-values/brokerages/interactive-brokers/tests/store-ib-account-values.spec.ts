import { describe, it, expect, beforeEach, afterAll, afterEach, beforeAll, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { storeInteractiveBrokersAccountValues } from '../index'
import { Payload } from 'payload'

// Mock env variables
vi.mock('@/env/server', () => ({
  env: {
    IB_API_KEY: 'test-api-key',
  },
}))

// Define the base URL for easier reference
const IB_FLEX_SERVICE_URL = 'https://ndcdyn.interactivebrokers.com/AccountManagement/FlexWebService'

// Create MSW server with handlers for Interactive Brokers API endpoints
const server = setupServer(
  // Mock the SendRequest endpoint (for reference code)
  http.get(`${IB_FLEX_SERVICE_URL}/SendRequest`, () => {
    return HttpResponse.text(`
        <FlexStatementResponse>
          <Status>Success</Status>
          <ReferenceCode>mock-reference</ReferenceCode>
        </FlexStatementResponse>
      `)
  }),

  // Mock the GetStatement endpoint (for flex query report)
  http.get(`${IB_FLEX_SERVICE_URL}/GetStatement`, () => {
    return HttpResponse.text(`
        <FlexQueryResponse>
          <FlexStatements>
            <FlexStatement toDate="20230615">
              <EquitySummaryInBase>
                <EquitySummaryByReportDateInBase total="10000.5" />
              </EquitySummaryInBase>
              <CashReport>
                <CashReportCurrency accounttransfers="500" depositWithdrawals="201" />
              </CashReport>
            </FlexStatement>
          </FlexStatements>
        </FlexQueryResponse>
      `)
  }),
)

describe('storeInteractiveBrokersAccountValues', () => {
  let mockPayload: Partial<Payload>

  // Start MSW server before tests
  beforeAll(() => server.listen())

  // Reset handlers between tests
  afterEach(() => server.resetHandlers())

  // Close server after all tests
  afterAll(() => server.close())

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock Payload methods
    mockPayload = {
      find: vi.fn(),
      create: vi.fn(),
    }
  })

  it('should store values when no existing entry exists', async () => {
    ;(mockPayload.find as any).mockResolvedValue({ totalDocs: 0 })

    await storeInteractiveBrokersAccountValues({
      payload: mockPayload as Payload,
      strategy_id: 5,
      flex_query_id: 'flex123',
    })

    // Check payload.find was called correctly
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'strategy-values',
      where: {
        strategy: { equals: 5 },
        date: { equals: expect.any(String) },
      },
    })

    // Check payload.create was called with the right data
    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: 'strategy-values',
      data: {
        strategy: 5,
        date: expect.any(String),
        value: 10000.5,
        net_cash_movement: 701, // 500 + 201 from the XML
      },
    })

    // Verify the date parsed correctly
    const createdData = (mockPayload.create as any).mock.calls[0][0].data
    expect(parseInt(createdData.date.substring(0, 4), 10)).toBe(2023)
    expect(parseInt(createdData.date.substring(5, 7), 10)).toBe(6)
    expect(parseInt(createdData.date.substring(8, 10), 10)).toBe(15)
  })

  it('should throw error when value for that date already exists', async () => {
    ;(mockPayload.find as any).mockResolvedValue({ totalDocs: 1 })

    await expect(
      storeInteractiveBrokersAccountValues({
        payload: mockPayload as Payload,
        strategy_id: 6,
        flex_query_id: 'flex123',
      }),
    ).rejects.toThrow('Strategy value already exists')

    expect(mockPayload.create).not.toHaveBeenCalled()
  })

  it('should throw an error when the API returns a failure', async () => {
    // Override the handler for this test only
    server.use(
      http.get(`${IB_FLEX_SERVICE_URL}/SendRequest`, () => {
        return HttpResponse.text(`
            <FlexStatementResponse>
              <Status>Fail</Status>
              <ErrorMessage>Invalid query ID</ErrorMessage>
            </FlexStatementResponse>
          `)
      }),
    )

    await expect(
      storeInteractiveBrokersAccountValues({
        payload: mockPayload as Payload,
        strategy_id: 7,
        flex_query_id: 'invalid-query',
      }),
    ).rejects.toThrow('Invalid query ID')
  })
})
