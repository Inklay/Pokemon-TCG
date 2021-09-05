export abstract class Expansion {
  abstract name: string
  abstract price: number
  abstract id: string
  abstract image: string
  abstract cardsBaseImage: string
  abstract released: Boolean
  abstract fixNumber: Boolean
  abstract common: number[]
  abstract uncommon: number[]
  abstract rare: number[]
  abstract special: number[]
  abstract ultraRare: number[]
  abstract size: number
  abstract canGetSecret: Boolean
  abstract secret: number[]
}
