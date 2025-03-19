import { CollectionConfig } from 'payload'

export const Commands: CollectionConfig = {
  slug: 'commands',
  admin: {
    group: 'Strategies',
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'action-button'],
    hidden: true,
  },
  fields: [
    {
      name: 'strategy',
      type: 'relationship',
      relationTo: 'strategies',
      required: true,
      hasMany: false,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        placeholder: 'What does this command do?',
      },
    },
    {
      name: 'schema',
      type: 'array',
      maxRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              label: 'Key',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              label: 'Type',
              type: 'select',
              required: true,
              options: [
                { label: 'String', value: 'string' },
                { label: 'Number', value: 'number' },
                { label: 'Boolean', value: 'boolean' },
              ],
            },
            {
              name: 'default',
              label: 'Default',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
      defaultValue: [
        {
          key: '$type',
          type: 'string',
          default: 'The Name of the Command',
        },
      ],
    },
    {
      type: 'ui',
      name: 'action-button',
      admin: {
        components: {
          Cell: './collections/strategies/Command/components/action-button.tsx',
        },
      },
    },
  ],
}
