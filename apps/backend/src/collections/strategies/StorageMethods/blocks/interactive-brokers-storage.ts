import { encryptValue, decryptValue } from '@repo/encryption'
import { Block } from 'payload'

export const InteractiveBrokersStorage: Block = {
  slug: 'ib-storage-block',
  labels: {
    singular: 'Interactive Brokers Storage',
    plural: 'Interactive Brokers Storage',
  },
  interfaceName: 'InteractiveBrokersStorageBlock',
  fields: [
    {
      type: 'text',
      name: 'flex_query_id',
      label: 'Flex Query Id',
      admin: {
        description:
          'Set up a flex query in Interactive Brokers that returns the Net Liquidation Value and Net Cash Movement',
      },
      hooks: {
        beforeChange: [async ({ value }) => JSON.stringify(encryptValue(value))],
        afterRead: [async ({ value }) => decryptValue(JSON.parse(value))],
      },
    },
  ],
}
