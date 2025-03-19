import { CommandForm } from '@/components/form/command-form'
import { Modal } from '../elements/modal'
import { ServerComponentProps } from 'payload'
import { Command } from '@/payload-types'

export const CommandModal = async (
  props: ServerComponentProps & { searchParams: Record<string, string> },
) => {
  const { searchParams, payload } = props

  const open = searchParams?.modal === 'command'
  const id = searchParams?.commandId || ''

  if (!id || !open) return null

  const command = (await payload.findByID({
    collection: 'commands',
    id,
    depth: 1,
    populate: {
      strategies: {
        project_id: true,
      },
    },
  })) as Command & { strategy: { project_id: string } }

  return (
    <Modal open={open} title={command?.name} description={command?.description}>
      <CommandForm projectId={command?.strategy?.project_id} {...command} />{' '}
    </Modal>
  )
}
