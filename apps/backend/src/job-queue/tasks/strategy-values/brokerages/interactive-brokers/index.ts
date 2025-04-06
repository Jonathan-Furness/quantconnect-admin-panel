import { env } from '@/env/server'
import { Strategy } from '@/payload-types'
import { FlexQueryReport, ReferenceCodeResponse } from '@/types/interactive-brokers'
import { xmlToJson } from '@/utils/xml-to-json'
import { Payload } from 'payload'

interface IGetFlexQueryFromInteractiveBrokers {
  payload: Payload
  strategy_id: Strategy['id']
  flex_query_id: string
}

export const storeInteractiveBrokersAccountValues = async ({
  payload,
  strategy_id,
  flex_query_id,
}: IGetFlexQueryFromInteractiveBrokers) => {
  const referenceCode = await getInteractiveBrokersReferenceCode(flex_query_id)
  const { date, net_liquidation_value, net_cash_movement } =
    await getInteractiveBrokersFlexQueryReport(referenceCode)

  const existingValue = await payload.find({
    collection: 'strategy-values',
    where: {
      strategy: {
        equals: strategy_id,
      },
      date: {
        equals: date,
      },
    },
  })

  if (existingValue.totalDocs > 0) {
    throw new Error('Strategy value already exists')
  }

  await payload.create({
    collection: 'strategy-values',
    data: {
      strategy: strategy_id,
      date,
      value: net_liquidation_value,
      net_cash_movement,
    },
  })
}

const IB_FLEX_SERVICE_URL = 'https://ndcdyn.interactivebrokers.com/AccountManagement/FlexWebService'

export const getInteractiveBrokersReferenceCode = async (
  flex_query_id: string,
): Promise<string> => {
  const IB_API_KEY = env.IB_API_KEY
  const SEND_REQUEST_URL = `${IB_FLEX_SERVICE_URL}/SendRequest?t=${IB_API_KEY}&q=${flex_query_id}&v=3`
  const response = await fetch(SEND_REQUEST_URL)
  const xml = await response.text()

  const { FlexStatementResponse } = xmlToJson(xml) as ReferenceCodeResponse

  if (FlexStatementResponse.Status === 'Fail') throw new Error(FlexStatementResponse.ErrorMessage)

  return FlexStatementResponse.ReferenceCode
}

export const getInteractiveBrokersFlexQueryReport = async (
  reference_code: string,
): Promise<{
  date: string
  net_liquidation_value: number
  net_cash_movement: number
}> => {
  const IB_API_KEY = env.IB_API_KEY
  const GET_REPORT_URL = `${IB_FLEX_SERVICE_URL}/GetStatement?t=${IB_API_KEY}&q=${reference_code}&v=3`
  const response = await fetch(GET_REPORT_URL)
  const xml = await response.text()

  const { FlexQueryResponse } = xmlToJson(xml) as FlexQueryReport

  const netLiquidationValue = Number(
    FlexQueryResponse?.FlexStatements?.FlexStatement?.EquitySummaryInBase
      ?.EquitySummaryByReportDateInBase?.['@_total'] || 0,
  )
  const accountTransfers = Number(
    FlexQueryResponse?.FlexStatements?.FlexStatement?.CashReport?.CashReportCurrency?.[
      '@_accounttransfers'
    ] || 0,
  )
  const cashMovements = Number(
    FlexQueryResponse?.FlexStatements?.FlexStatement?.CashReport?.CashReportCurrency?.[
      '@_depositWithdrawals'
    ] || 0,
  )

  const dateStr = FlexQueryResponse?.FlexStatements?.FlexStatement?.['@_toDate']
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  const date = `${year}-${month}-${day}`

  return {
    date,
    net_liquidation_value: netLiquidationValue,
    net_cash_movement: accountTransfers + cashMovements,
  }
}
