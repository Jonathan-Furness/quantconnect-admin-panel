import { Block } from "payload";
import { encryptValue, decryptValue } from "@repo/encryption";

export const BasicStorageBlock: Block = {
  slug: "basic-storage-block",
  interfaceName: "BasicStorageBlock",
  fields: [
    {
      type: "text",
      name: "api_key",
      label: "API Key",
      required: true,
      admin: {
        description:
          "This is the value expected by the API in the X-API-KEY header",
      },
      hooks: {
        beforeChange: [
          async ({ value }) => JSON.stringify(encryptValue(value)),
        ],
        afterRead: [async ({ value }) => decryptValue(JSON.parse(value))],
      },
    },
  ],
};
