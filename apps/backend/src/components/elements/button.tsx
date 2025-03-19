'use client'

import { cva, RecipeVariantProps } from 'styled-system/css'

const button = cva({
  base: {
    padding: '10px',
    borderRadius: 'md',
    boxShadow: 'md',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  variants: {
    variant: {
      primary: {
        bg: 'neutral.200',
        color: 'neutral.900',
        _hover: {
          backgroundColor: 'neutral.100',
        },
      },
      secondary: {
        backgroundColor: 'secondary',
        color: 'white',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = RecipeVariantProps<typeof button> & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className={button()}>
      {children}
    </button>
  )
}
