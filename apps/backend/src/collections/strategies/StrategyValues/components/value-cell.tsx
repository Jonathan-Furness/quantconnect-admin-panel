import { DefaultServerCellComponentProps } from 'payload'

export default async function ValueCell({
  rowData,
  payload,
  cellData,
}: DefaultServerCellComponentProps) {
  const strategy = await payload.findByID({ collection: 'strategies', id: rowData.id })
  const currency = strategy.base_currency
  const formatter = (value: number) =>
    Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
  return <div className="value-cell">{formatter(cellData)}</div>
}
