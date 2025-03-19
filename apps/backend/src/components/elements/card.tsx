import React from 'react'
import { css, cva, Styles } from '../../../styled-system/css'
import Link from 'next/link'
import { XIcon } from '@payloadcms/ui'

export const card = cva({
  base: {
    position: 'relative',
    rounded: 'lg',
    border: 'base',
    bg: 'black',
    shadow: 'sm',
  },
})

export const cardHeader = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    spaceY: '1.5',
    p: '6',
  },
})

export const cardTitle = cva({
  base: {
    textStyle: '2xl',
    fontWeight: 'semibold',
  },
})

export const cardDescription = cva({
  base: {
    textStyle: 'md',
    color: 'neutral.300',
  },
})

export const cardContent = cva({
  base: {
    p: '6',
    pt: '0',
  },
})

export const cardFooter = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    p: '6',
    pt: '0',
  },
})

export const cardClose = cva({
  base: {
    display: 'flex',
    position: 'absolute',
    top: '6',
    right: '6',
  },
})

interface WithCss {
  css?: Styles
}

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <div className={css(card.raw(), cssProps)} {...props} ref={ref} />
})

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <div className={css(cardHeader.raw(), cssProps)} {...props} ref={ref} />
})

CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <h3 className={css(cardTitle.raw(), cssProps)} {...props} ref={ref} />
})

CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <p className={css(cardDescription.raw(), cssProps)} {...props} ref={ref} />
})

CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <div className={css(cardContent.raw(), cssProps)} {...props} ref={ref} />
})

CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return <div className={css(cardFooter.raw(), cssProps)} {...props} ref={ref} />
})

CardFooter.displayName = 'CardFooter'

export const CardClose = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & WithCss
>(({ css: cssProps, ...props }, ref) => {
  return (
    <Link href={{ search: '?' }} className={css(cardClose.raw(), cssProps)} {...props} ref={ref}>
      <XIcon />
    </Link>
  )
})

CardClose.displayName = 'CardClose'
