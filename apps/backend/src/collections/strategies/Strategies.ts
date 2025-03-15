import type { CollectionConfig } from 'payload'

export const Strategies: CollectionConfig = {
  slug: 'strategies',
  admin: {
    group: 'Strategies',
    useAsTitle: 'name',
    defaultColumns: ['name', 'date_created', 'base_currency'],
    description: '',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'project_id',
          label: 'Project ID',
          type: 'text',
          required: true,
          admin: {
            description: 'This is the Project ID for the strategy in QuantConnect.',
            components: {
              // TODO: Add a component to check strategy is running
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date_created',
          label: 'Date Created',
          type: 'date',
          defaultValue: new Date(),
          required: true,
        },
        {
          name: 'base_currency',
          label: 'Base Currency',
          type: 'select',
          required: true,
          defaultValue: 'USD',
          options: [
            {
              label: 'USD',
              value: 'USD',
            },
            {
              label: 'GBP',
              value: 'GBP',
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Strategy Values',
          fields: [
            {
              label: 'Strategy Values',
              name: 'strategy_values',
              type: 'join',
              collection: 'strategy-values',
              on: 'strategy',
              defaultLimit: 10,
              defaultSort: '-date',
              admin: {
                allowCreate: true,
              },
            },
          ],
        },
        {
          label: 'Commands',
          fields: [
            {
              label: 'Commands',
              name: 'commands',
              type: 'join',
              collection: 'commands',
              on: 'strategy',
              defaultLimit: 10,
              defaultSort: '-date',
              admin: {
                allowCreate: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
