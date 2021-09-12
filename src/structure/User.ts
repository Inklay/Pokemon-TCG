import { get, save, update } from '../dataManager/user'
import { CardList } from './CardList'

export class User {
  id: string
  money: number
  date: number
  cards: CardList
  autoSell: boolean
  favourite: string

  constructor(id: string) {
    this.id = id
    this.money = 50
    this.date = Date.now()
    this.cards = new CardList()
    this.autoSell = false
    this.favourite = "non"
    save(this)
  }

  static update(user: User) {
    update(user)
  }

  static create(id: string) {
    const user = get(id)
    if (user) {
      return user
    }
    return new User(id)
  }
}
