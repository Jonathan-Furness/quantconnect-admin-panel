import { FieldHook } from 'payload'

export const convertDollarsToCents: FieldHook = ({ value }) => Math.floor(value * 100)

export const convertCentsToDollars: FieldHook = ({ value }) => value / 100
