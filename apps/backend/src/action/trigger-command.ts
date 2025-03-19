'use server'
import { env } from '@/env/server'
import crypto from 'crypto'
import { z } from 'zod'

const formDataSchema = z.object({
  projectId: z.string({ message: 'Project ID is required' }),
  $type: z.string({ message: 'Command $type is required' }),
})

const createHeaders = () => {
  const API_TOKEN = env.QC_API_TOKEN
  const USER_ID = env.QC_USER_ID

  // Get timestamp
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const timeStampedToken = `${API_TOKEN}:${timestamp}`

  // Get hashed API token
  const hashedToken = crypto.createHash('sha256').update(timeStampedToken).digest('hex')

  // Create authentication string
  const authentication = Buffer.from(`${USER_ID}:${hashedToken}`).toString('base64')

  return {
    Authorization: `Basic ${authentication}`,
    Timestamp: timestamp,
  }
}

export const triggerCommand = async (formData: FormData) => {
  const BASE_URL = 'https://www.quantconnect.com/api/v2'
  const headers = createHeaders()

  const { data, error } = await formDataSchema.safeParse(Object.fromEntries(formData))

  if (error) {
    console.error(error)
    return error
  }

  const { projectId, ...command } = data

  const res = await fetch(`${BASE_URL}/live/commands/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      projectId,
      command,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to trigger command: ${await res.text()}`)
  }

  const resJson = await res.json()

  if (!resJson.success) {
    return resJson.errors
  }
  return data
}
