import { sva } from '../../../styled-system/css'
import { Card, CardClose, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { LockScroll } from './lock-scroll'

const modalStyles = sva({
  slots: ['backdrop', 'content'],
  base: {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      maxW: 'breakpoint-md',
      w: '100%',
    },
  },
})

export const Modal = async ({
  open,
  title,
  description,
  children,
}: {
  open: boolean
  title: string
  description: string
  children: React.ReactNode
}) => {
  if (!open) return null

  return (
    <>
      <LockScroll />
      <div className={modalStyles().backdrop}>
        <Card css={modalStyles.raw().content}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <CardClose />
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </>
  )
}
