export interface Expansion {
  name: string
  price: number
  id: string
  image: string
  cardsBaseImage: string
  released: Boolean
  fixNumber: Boolean
  common: number[]
  uncommon: number[]
  rare: number[]
  special: number[]
  ultraRare: number[]
  size: number
  canGetSecret: Boolean
  secret: number[]
}
