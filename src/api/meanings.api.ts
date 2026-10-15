import { apiClient } from './client'

export interface Meaning {
  _id: string
  name: string
}

export async function getMeanings(): Promise<Meaning[]> {
  const res = await apiClient.get<{ data: { meanings: Meaning[] } }>('/meanings')
  return res.data.data.meanings
}
