import React from 'react'
import { cva, RecipeVariantProps } from '../../../styled-system/css'

const input = cva({
  base: {
    width: '100%',
    borderRadius: 'md',
    padding: '10px',
    bg: 'neutral.800',
    color: 'white',
    border: '1px solid',
    borderColor: 'neutral.600',
    _disabled: {
      color: 'neutral.400',
      cursor: 'not-allowed',
    },
  },
})

type InputProps = RecipeVariantProps<typeof input> & React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ color = 'red', ...props }, ref) => {
    return <input ref={ref} className={input({ color })} {...props} />
  },
)

Input.displayName = 'Input'
