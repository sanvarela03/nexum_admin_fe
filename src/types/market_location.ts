export interface MarketLocation {
  city: string
  state: string
  state_code: string
  city_code: string
  country: string
  country_code: string
  flag_emoji: string
  phone_code: string
  service_area: ServiceArea
  population: number
  time_zone: string
  currency_code: string
  is_active: boolean
}

export interface ServiceArea {
  type: string
  features: Feature[]
}

export interface Feature {
  type: string
  properties: Record<string, never>
  geometry: Geometry
}

export interface Geometry {
  coordinates: number[][][]
  type: string
}

export type MarketLocationList = MarketLocationItemList[]

export interface MarketLocationItemList {
  id: number
  city: string
  cityCode: string
  state: string
  stateCode: string
  country: string
  countryCode: string
  population: number
  phoneCode: string
  flagEmoji: string
  timeZone: string
  currencyCode: string
  isActive: boolean
  serviceArea: ServiceAreaForItemList
}

export interface ServiceAreaForItemList {
  type: string
  coordinates: number[][][]
  crs: Crs
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}
