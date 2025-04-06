import { withPayload } from '@payloadcms/next/withPayload'
import { validateEnvs } from './src/env/validate-envs.js'

validateEnvs()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
