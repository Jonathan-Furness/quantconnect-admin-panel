import Link from 'next/link'
import { DefaultCellComponentProps } from 'payload'

export default function CommandActionButton(props: DefaultCellComponentProps) {
  return (
    <Link
      href={{
        search: '?commandId=' + props.rowData.id + '&modal=command',
      }}
    >
      Execute
    </Link>
  )
}
