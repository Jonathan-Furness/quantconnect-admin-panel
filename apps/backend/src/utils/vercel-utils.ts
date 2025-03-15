import { env } from '@/env/server'

export const addProtocol = (url: string | undefined): string | undefined => {
  if (!url) return url
  if (url.startsWith('http')) return url
  return `https://${url}`
}

export const addProtocols = (urls: Array<string | undefined>): string[] => {
  const uniqueUrls = new Set(urls)
  return Array.from(uniqueUrls)
    .map(addProtocol)
    .filter((url) => url !== undefined)
}

export const getEnvironment = (): 'development' | 'preview' | 'production' => {
  if (env.NODE_ENV === 'production') {
    if (env.VERCEL_ENV === 'production') {
      return 'production'
    }
    return 'preview'
  }
  return 'development'
}

export const getServerUrl = (): string => {
  switch (getEnvironment()) {
    case 'production':
      return addProtocol(env.VERCEL_PROJECT_PRODUCTION_URL) || ''
    case 'preview':
      return addProtocol(env.VERCEL_BRANCH_URL) || ''
    case 'development':
      return `http://localhost:${env.PORT}`
    default:
      throw new Error('Unknown environment')
  }
}
