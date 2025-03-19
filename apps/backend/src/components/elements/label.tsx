import { cva, RecipeVariantProps } from '../../../styled-system/css'

const label = cva({
  base: {
    color: 'neutral.400',
  },
})

type LabelProps = RecipeVariantProps<typeof label> & React.LabelHTMLAttributes<HTMLLabelElement>

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <label className={label()} {...props}>
      {children}
    </label>
  )
}
