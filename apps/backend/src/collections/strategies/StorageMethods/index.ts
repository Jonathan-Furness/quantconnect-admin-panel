import { CollectionConfig } from 'payload'
import { BasicStorageBlock } from './blocks/basic-storage'
import { InteractiveBrokersStorage } from './blocks/interactive-brokers-storage'

export const StorageMethods: CollectionConfig = {
  slug: 'strategy-storage-methods',
  admin: {
    defaultColumns: ['methods', 'updatedAt'],
    hidden: true,
  },
  fields: [
    {
      type: 'relationship',
      label: 'Strategy',
      name: 'strategy',
      relationTo: 'strategies',
      hasMany: false,
      required: true,
      unique: true,
    },
    {
      type: 'select',
      name: 'frequency',
      label: 'Frequency',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
      ],
      defaultValue: 'daily',
    },
    {
      type: 'blocks',
      name: 'methods',
      label: 'Storage Methods',
      blocks: [BasicStorageBlock, InteractiveBrokersStorage],
      minRows: 1,
      required: true,
      validate: (value) => {
        const typedValue = value as Array<{ blockType: string }>
        const uniqueMethods = new Set(typedValue.map((method) => method.blockType))
        return uniqueMethods.size === typedValue.length || 'Only unique storage methods are allowed'
      },
    },
  ],
}
