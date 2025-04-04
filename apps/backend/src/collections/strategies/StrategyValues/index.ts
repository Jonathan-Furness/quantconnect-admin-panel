import type { CollectionConfig } from 'payload'
import { storeEndpoint } from './endpoints/store'
import { convertCentsToDollars, convertDollarsToCents } from './hooks/precision-hooks'

export const StrategyValues: CollectionConfig = {
  slug: 'strategy-values',
  admin: {
    group: 'Strategies',
    defaultColumns: ['date', 'value', 'net_cash_movement'],
  },
  endpoints: [storeEndpoint],
  fields: [
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      label: 'Value',
      name: 'value',
      type: 'number',
      required: true,
      defaultValue: 0,
      hooks: {
        beforeChange: [convertDollarsToCents],
        afterRead: [convertCentsToDollars],
      },
      admin: {
        components: {
          Cell: {
            path: './collections/strategies/StrategyValues/components/value-cell',
            exportName: 'ValueCell',
          },
        },
      },
    },
    {
      label: 'Net Cash Movement',
      name: 'net_cash_movement',
      type: 'number',
      defaultValue: 0,
      hooks: {
        beforeChange: [convertDollarsToCents],
        afterRead: [convertCentsToDollars],
      },
      admin: {
        components: {
          Cell: {
            path: './collections/strategies/StrategyValues/components/value-cell',
            exportName: 'ValueCell',
          },
        },
      },
    },
    {
      name: 'strategy',
      type: 'relationship',
      relationTo: 'strategies',
      required: true,
    },
  ],
}
