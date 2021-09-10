import { get, save, update } from '../dataManager/user'
import { CardList } from './CardList'

export class User {
  id: string
  money: number
  date: number
  cards: CardList

  constructor(id: string) {
    this.id = id
    this.money = 50
    this.date = Date.now()
    this.cards = new CardList()
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
