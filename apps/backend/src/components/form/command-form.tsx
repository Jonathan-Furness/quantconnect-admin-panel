'use client'

import Form from 'next/form'
import { triggerCommand } from '../../action/trigger-command'
import { Command } from '@/payload-types'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/elements/button'
import { FormInput } from '@/components/form/form-input'

type CommandFormProps = Omit<Command, 'strategy'> & { projectId: string }

export function CommandForm({ schema, projectId }: CommandFormProps) {
  return (
    <Form
      action={triggerCommand}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      {schema?.map((field) => (
        <FormInput
          key={field.id}
          label={field.key}
          id={field.key}
          name={field.key}
          {...(field.key === '$type'
            ? { value: field.default?.toString(), readOnly: true }
            : {
                defaultValue: field.default?.toString(),
              })}
        />
      ))}
      <SubmitButton />
    </Form>
  )
}

const SubmitButton = () => {
  const status = useFormStatus()
  return (
    <Button type="submit" disabled={status.pending} style={{ marginTop: '20px' }}>
      {status.pending ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
