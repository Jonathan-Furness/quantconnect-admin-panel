type ReferenceCodeSuccessReponse = {
  Status: 'Success'
  ReferenceCode: string
}

type ReferenceCodeErrorResponse = {
  Status: 'Fail'
  ErrorCode: number
  ErrorMessage: string
}

export type ReferenceCodeResponse = {
  FlexStatementResponse: ReferenceCodeSuccessReponse | ReferenceCodeErrorResponse
}

export interface FlexQueryReport {
  FlexQueryResponse: {
    FlexStatements: {
      FlexStatement: {
        '@_toDate': string
        '@_accountId': string
        '@_fromDate': string
        '@_toDate': string
        '@_period': string
        '@_whenGenerated': string
        EquitySummaryInBase: {
          EquitySummaryByReportDateInBase: {
            '@_total': string
          }
        }
        CashReport: {
          CashReportCurrency: {
            '@_depositWithdrawals': string
            '@_depositwithdrawalssec': string
            '@_depositwithdrawalscom': string
            '@_depositwithdrawalsmtd': string
            '@_depositwithdrawalsytd': string
            '@_accounttransfers': string
            '@_accounttransferssec': string
            '@_accounttransferscom': string
            '@_accounttransfersmtd': string
            '@_accounttransfersytd': string
            '@_internaltransfers': string
            '@_internaltransferssec': string
            '@_internaltransferscom': string
            '@_internaltransfersmtd': string
            '@_internaltransfersytd': string
          }
        }
      }
    }
  }
}
