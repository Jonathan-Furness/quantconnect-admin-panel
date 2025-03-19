'use client'

import { useId } from 'react'
import { css } from '../../../styled-system/css'
import { Input } from '../elements/input'
import { Label } from '../elements/label'

type FormInputProps = {
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function FormInput({ label, ...props }: FormInputProps) {
  const id = useId()
  const uniqueId = `${id}-${props.id || props.name}`
  return (
    <div className={css({ spaceY: 4 })}>
      {label && (
        <Label htmlFor={uniqueId} className={css({ textTransform: 'capitalize' })}>
          {label}
        </Label>
      )}
      <Input {...props} id={uniqueId} />
    </div>
  )
}
