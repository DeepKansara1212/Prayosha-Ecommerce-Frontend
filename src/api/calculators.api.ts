import { apiClient } from './client'
import type { ApiProduct } from './products.api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectedLocation {
  displayName: string
  name: string
  state?: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
}

export interface CalculatorPayload {
  name: string
  dob: string
  tob?: string
  birthLocation: SelectedLocation
  mobile: string
}

export interface RudrakshaCalculatorPayload extends CalculatorPayload {
  purpose: string
}

export interface CalculatorResult {
  requiresBirthTime?: boolean
  recommendedProducts?: ApiProduct[]
}

export interface Purpose {
  _id: string
  name: string
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function searchLocations(place: string): Promise<SelectedLocation[]> {
  const res = await apiClient.get<{ data: { locations: SelectedLocation[] } }>('/location/search', {
    params: { place },
  })
  return res.data.data.locations
}

export async function submitBraceletCalculator(payload: CalculatorPayload): Promise<CalculatorResult> {
  const res = await apiClient.post<{ data: CalculatorResult }>('/calculators/bracelet', payload)
  return res.data.data
}

export async function submitRudrakshaCalculator(payload: RudrakshaCalculatorPayload): Promise<CalculatorResult> {
  const res = await apiClient.post<{ data: CalculatorResult }>('/calculators/rudraksha', payload)
  return res.data.data
}

export async function getPurposes(): Promise<Purpose[]> {
  const res = await apiClient.get<{ data: { purposes: Purpose[] } }>('/purposes')
  return res.data.data.purposes
}
