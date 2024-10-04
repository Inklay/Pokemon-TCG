import { CardList } from './CardList'
import fs from 'fs'

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
    this.favourite = 'none'
  }

  public static get(id: string) : User {
    const rawData = fs.readFileSync('data/user.json').toString()
    const data = JSON.parse(rawData) as User[]
    const userData = data.find(x => x.id === id)
    let user = new User(id)
    if (userData) {
      return Object.assign(user, userData)
    }
    user.save()
    return user
  }

  public save() : void {
    const rawData = fs.readFileSync('data/user.json').toString()
    const data = JSON.parse(rawData) as User[]
    const idx = data.findIndex(x => x.id === this.id)
    if (idx !== -1) {
      data[idx] = this
    } else {
      data.push(this)
    }
    fs.writeFileSync('data/user.json', JSON.stringify(data))
  }

  public addHourlyMoney() : boolean {
    const now = Date.now()
    if (now - this.date >= 1000 * 60 * 60) {
      this.money += 10
      this.date = now
      this.save()
      return true
    }
    return false
  }

  public setAutosell(value: boolean) : void {
    this.autoSell = value
    this.save()
  }
}
