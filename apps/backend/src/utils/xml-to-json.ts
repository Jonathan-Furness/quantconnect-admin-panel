import { XMLParser } from 'fast-xml-parser'

export const xmlToJson = (xml: string): any => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_', // Prefix for attribute names (customizable)
    allowBooleanAttributes: true,
  }
  const parser = new XMLParser(options)
  return parser.parse(xml)
}
