import { apiClient } from './client'

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
  productUrl?: string
}

export async function sendContactMessage(data: ContactMessage): Promise<void> {
  await apiClient.post('/contact', data)
}
