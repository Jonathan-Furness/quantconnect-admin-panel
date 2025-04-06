import { expect, describe, it, beforeEach, vi } from 'vitest'
import { getInteractiveBrokersReferenceCode, getInteractiveBrokersFlexQueryReport } from '../index'

describe('getInteractiveBrokersReferenceCode', () => {
  beforeEach(() => {
    // Mock fetch API
    global.fetch = vi.fn()
  })

  it('should return reference code on successful response', async () => {
    // Mock successful XML response
    const mockResponse = `
      <FlexStatementResponse>
        <Status>Success</Status>
        <ReferenceCode>a12345678</ReferenceCode>
      </FlexStatementResponse>
    `

    ;(global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await getInteractiveBrokersReferenceCode('query123')
    expect(result).toBe('a12345678')
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('query123'))
  })

  it('should throw error when status is Fail', async () => {
    // Mock failed XML response
    const mockResponse = `
      <FlexStatementResponse>
        <Status>Fail</Status>
        <ErrorMessage>Invalid query ID</ErrorMessage>
      </FlexStatementResponse>
    `

    ;(global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve(mockResponse),
    })

    await expect(getInteractiveBrokersReferenceCode('query123')).rejects.toThrow('Invalid query ID')
  })
})
