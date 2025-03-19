import type { CollectionConfig } from 'payload'

export const StrategyValues: CollectionConfig = {
  slug: 'strategy-values',
  admin: {
    group: 'Strategies',
    defaultColumns: ['date', 'strategy', 'value'],
    hidden: true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      hooks: {
        beforeChange: [
          async ({ data }) => {
            // Store values as integers to avoid precision issues
            return data ? Math.round(data.value * 100) : null
          },
        ],
        afterRead: [
          async ({ data }) => {
            // Convert back to float for display
            return data ? data.value / 100 : null
          },
        ],
      },
      admin: {
        components: {
          Cell: './collections/strategies/StrategyValues/components/value-cell.tsx',
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
