import { Serie } from '../structure/Serie'
import { Expansion } from '../structure/Expansion'
import { Lang } from '../structure/Lang'
import fs from 'fs'
import { InteractionReply } from '../structure/InteractionReply'
import { User } from '../structure/User'
import { notEnoughMoney } from './moneyHandler'
import { Card, Rarity } from '../structure/Card'
import { CardCount } from '../structure/CardCount'
import { MessageButton, MessageEmbed } from 'discord.js'

/**
 * @enum {number} UserHandlerModeEnum
 * 
 * Enum for the mode of the UserHandler
 * 
 * @readonly
 */
enum UserHandlerModeEnum {
  BUYING,
  VIEWING,
  TRADING
}

/**
 * @typedef {string} UserHandlerMode
 */
export type UserHandlerMode = keyof typeof UserHandlerModeEnum

/**
 * @class UserHandler
 * 
 * @private @property {Serie[]} series - The series loaded in the handler
 * @private @property {number} serieIdx - The index of the current serie in the series array
 * @private @property {Expansion[]} expansions - The expansions loaded in the handler
 * @private @property {number} expansionIdx - The index of the current serie in the expansions array
 * @private @property {Card[]} cards - The cards generated
 * @private @property {number} cardIdx - The index of the current serie in the cards array
 * @private @property {Lang} lang - The lang of the server
 * @private @property {UserHandlerMode} mode - The current mode of the handler
 * @private @property {number} serieMax - The size of the series array 
 * @private @property {number} expansionMax - The size of the expansions array 
 * @private @property {number} cardMax - The size of the cards array 
 * @private @property {User} user - The user object
 * @private @property {number} price - The price of the cards if sold
 * @private @property {User} target - The target user object
 * @private @property {CardCount[]} cardCount - The cardcount of the target
 * @private @property {string} targetNickname - The nickname of the target
 */
export class UserHandler {
  private series: Serie[]
  private serieIdx: number
  private expansions: Expansion[]
  private expansionIdx: number
  private cards: Card[]
  private cardIdx: number
  private lang: Lang
  private mode: UserHandlerMode
  private serieMax: number
  private expansionMax: number
  private cardMax: number
  private user: User
  private price: number
  private target: User
  private cardCount: CardCount[]
  private targetNickname: string

  /**
   * @constructor
   * @param {Lang} lang - The lang of the server
   * @param {UserHandlerMode} mode - The current mode of the handler
   * @param {User} user - The user object
   */
  constructor(lang: Lang, mode: UserHandlerMode, user: User) {
    this.series = []
    JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/series.json`).toString()).forEach((e: Serie) => {
      this.series.push(Object.assign(new Serie, e))
    })
    this.serieIdx = 0
    this.expansions = []
    this.expansionIdx = 0
    this.lang = lang
    this.mode = mode
    this.serieMax = this.series.length - 1
    this.expansionMax = this.expansions.length - 1
    this.user = user
    this.cards = []
    this.cardIdx = 0
    this.cardMax = 0
    this.price = 0
    this.target = this.user
    this.cardCount = []
    this.targetNickname = ""
    this.loadExpansions()
  }

  /**
   * @private @method
   * 
   * Loads the expansions of the current serie
   * 
   * @returns {void} 
   */
  private loadExpansions() : void {
    this.expansions = []
    JSON.parse(fs.readFileSync(`cards/${this.lang.global.dir}/${this.series[this.serieIdx].id}.json`).toString()).forEach((e: Expansion) => {
      if ((this.mode == 'BUYING' || (this.mode == 'VIEWING' && this.target.cards[e.id].length > 0)) && e.released) {
        this.expansions.push(Object.assign(new Expansion, e))
      }
    })
    this.expansionIdx = 0
    this.expansionMax = this.expansions.length - 1
  }

  /**
   * @public @method
   * 
   * Draw the current serie in a Discord embed message
   * 
   * @param {boolean} useFav - Whether or not the favourite expansion should be loaded
   * @returns {InteractionReply} The serie in a Discord embed message
   */
  public drawSerie(useFav: boolean = false) : InteractionReply {
    if (useFav) {
      this.loadFavExpansion()
      return this.drawExpansion()
    }
    return this.series[this.serieIdx].draw(this.expansions, this.serieIdx, this.lang, this.mode, this.serieMax)
  }

  /**
   * @public @method
   * 
   * Draw the current expansion in a Discord embed message
   * 
   * @returns {InteractionReply} The expansion in a Discord embed message
   */
  public drawExpansion() : InteractionReply {
    return this.expansions[this.expansionIdx].draw(this.expansionIdx, this.lang, this.mode, this.expansionMax, this.user.money, this.user.favourite == this.expansions[this.expansionIdx].id)
  }

  /**
   * @public @method
   * 
   * Returns the handler current serie 
   * 
   * @returns {Serie} The handler current serie 
   */
  public getSerie() : Serie {
    return this.series[this.serieIdx]
  }

  /**
   * @public @method
   * 
   * Returns the handler current expansion 
   * 
   * @returns {Expansion} The handler current expansion 
   */
  public getExpansion(): Expansion {
    return this.expansions[this.expansionIdx]
  }

  /**
   * @public @method
   * 
   * Increase the expansion index of the handler
   * 
   * @returns {void}
   */
  public incSerieIdx() : void {
    if (this.serieIdx + 1 <= this.serieMax) {
      this.serieIdx++
      this.loadExpansions()
    }
  }

  /**
   * @public @method
   * 
   * Decrease the serie index of the handler
   * 
   * @returns {void}
   */
  public decSerieIdx() : void {
    if (this.serieIdx - 1 >= 0) {
      this.serieIdx--
      this.loadExpansions()
    }
  }

  /**
   * @public @method
   * 
   * Sets the serie index of the handler
   * 
   * @param {number} idx - The new serie index
   * @returns {void}
   */
  public setSerieIdx(idx: number) : void {
    if (idx <= this.serieMax && idx >= 0) {
      this.serieIdx = idx
      this.loadExpansions()
    }
  }

  /**
   * @public @method
   * 
   * Increase the expansion index of the handler
   * 
   * @returns {void}
   */
  public incExpansionIdx() : void {
    if (this.expansionIdx + 1 <= this.expansionMax) {
      this.expansionIdx++
    }
  }

  /**
   * @public @method
   * 
   * Decrease the expansion index of the handler
   * 
   * @returns {void}
   */
  public decExpansionIdx() : void {
    if (this.expansionIdx - 1 >= 0) {
      this.expansionIdx--
    }
  }

  /**
   * @public @method
   * 
   * Sets the expansion index of the handler
   * 
   * @param {number} idx - The new expansion index
   * @returns {void}
   */
  public setExpansionIdx(idx: number) : void {
    if (idx <= this.expansionMax && idx >= 0) {
      this.expansionIdx = idx
    }
  }

  /**
   * @public @method
   * 
   * Sets the mode of the handler
   * 
   * @param {UserHandlerMode} mode - The new mode of the handler
   * @returns {void} 
   */
  public setMode(mode: UserHandlerMode) : void {
    this.mode = mode
  }

  /**
   * @public @method
   * 
   * Tries to open a booster if the user has enough money
   * 
   * @returns {InteractionReply} Either the booster opening message, or a message telling the user that it doesn't ahve enough money
   */
  public openBooster() : InteractionReply {
    if (this.expansions[this.expansionIdx].price > this.user.money) {
      return notEnoughMoney(this.lang)
    }
    this.user.money -= this.expansions[this.expansionIdx].price
    this.cards = []
    this.cardMax = 9
    this.cardIdx = 0
    this.price = 0
    for (let i: number = 0; i < 5; i++) {
      this.cards.push(Card.generate('COMMON', this.expansions[this.expansionIdx], this.cards))
    }
    for (let i: number = 0; i < 3; i++) {
      this.cards.push(Card.generate('UNCOMMON', this.expansions[this.expansionIdx], this.cards))
    }
    this.cards.push(Card.generate('SPECIAL', this.expansions[this.expansionIdx], this.cards, 'COMMON', true))
    this.cards.push(Card.generate('SECRET', this.expansions[this.expansionIdx], this.cards, 'RARE', true))
    this.checkNewCard()
    this.user.money += this.price
    User.update(this.user)
    return this.cards[0].draw(0, 9, this.lang, this.mode, this.price)
  }

  /**
   * @public @method
   * 
   * Returns the target's cards in a Discord embed message
   * 
   * @returns {InteractionReply} The target's cards
   */
  public view() : InteractionReply {
    this.cards = []
    this.cardCount = this.target.cards[this.expansions[this.expansionIdx].id]
    this.cardCount.forEach(cc => {
      this.cards.push(new Card(this.expansions[this.expansionIdx], cc.cardNumber, 'COMMON', 0))
    })
    this.cardMax = this.cards.length
    this.cardIdx = 0
    this.price = 0
    return this.cards[0].draw(0, this.cardMax, this.lang, this.mode, undefined, this.cardCount[this.cardIdx].quantity, this.targetNickname, this.user == this.target)
  }

  /**
   * @private @method
   * 
   * Check if a generated card is new
   * 
   * @returns {void}
   */
  private checkNewCard() : void {
    this.cards.forEach( c => {
      const counts: CardCount[] = this.user.cards[this.expansions[this.expansionIdx].id]
      const count: CardCount | undefined = counts.find(cc => cc.cardNumber == parseInt(c.number))
      if (count) {
        if (this.user.autoSell) {
          this.price += c.sell()
        } else {
          count.quantity++
        }
      } else {
        const newCount: CardCount = {
          quantity: 1,
          cardNumber: parseInt(c.number)
        }
        c.setNew()
        counts.push(newCount)
      }
    })
  }

  /**
   * @public @method
   * 
   * Increase the card index of the handler
   * 
   * @returns {void}
   */
  public incCardIdx() : void {
    if (this.cardIdx + 1 <= this.cardMax) {
      this.cardIdx++
    }
  }
  
  /**
   * @public @method
   * 
   * Decrease the card index of the handler
   * 
   * @returns {void}
   */
  public decCardIdx() : void {
    if (this.cardIdx - 1 >= 0) {
      this.cardIdx--
    }
  }

  /**
   * @public @method
   * 
   * Draw the current card in a Discord embed message
   * 
   * @returns {InteractionReply} The card in a Discord embed message
   */
  public drawCard() : InteractionReply {
    if (this.mode == 'BUYING') {
      return this.cards[this.cardIdx].draw(this.cardIdx, this.cardMax, this.lang, this.mode, this.price)
    } else {
      return this.cards[this.cardIdx].draw(this.cardIdx, this.cardMax, this.lang, this.mode, undefined, this.cardCount[this.cardIdx].quantity, this.targetNickname, this.user == this.target)
    }
  }

  /**
   * @public @method
   * 
   * Sets the favourite expansion of this user
   * 
   * @returns {InteractionReply} The expansion in a Discord embed message
   */
  public setFavouriteExpansion() : InteractionReply {
    this.user.favourite = this.expansions[this.expansionIdx].id
    User.update(this.user)
    return this.drawExpansion()
  }

  /**
   * @public @method
   * 
   * Unsets the favourite expansion of this user
   * 
   * @returns {InteractionReply} The expansion in a Discord embed message
   */
  public unsetFavouriteExpansion() : InteractionReply {
    this.user.favourite = 'none'
    User.update(this.user)
    return this.drawExpansion()
  }

  /**
   * @public @method
   * 
   * Loads the favourite expansion
   * 
   * @returns {void}
   */
  public loadFavExpansion() : void {
    if (this.user.favourite == 'none') {
      return
    }
    let eIdx: number = 0
    let sIdx: number = 0
    JSON.parse(fs.readFileSync(`cards/${this.lang.global.dir}/series.json`).toString()).forEach((s: Serie) => {
      JSON.parse(fs.readFileSync(`cards/${this.lang.global.dir}/${s.id}.json`).toString()).forEach((e: Expansion) => {
        if (e.id == this.user.favourite) {
          if (sIdx != this.expansionIdx) {
            this.serieIdx = sIdx
            this.loadExpansions()
          }
          this.expansionIdx = eIdx
        }
        eIdx++
      })
      sIdx++
    })
  }

  /**
   * @public @method
   * 
   * Sets the target User object
   * 
   * @param {User} target - The target User object
   * @return {void} 
   */
  public setTarget(target: User, targetNickname: string) : void {
    this.target = target
    this.targetNickname = targetNickname
    this.loadExpansions()
  }

  /**
   * @public @method
   * 
   * Sets the lang User object
   * 
   * @param {Lang} lang - The lang User object
   * @return {void} 
   */
   public setLang(lang: Lang) : void {
    this.lang = lang
  }
}

/**
 * @constant {Map<string, UserHandler>}
 */
export const userHandlers = new Map<string, UserHandler>()

/**
 * @function
 * 
 * Gets a UserHandler by it's user ID
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The ID of the user
 * @param {UserHandlerMode} mode - The current mode of the handler
 * @param {string | undefined} nickname - The target User object 
 * @param {string | undefined} nickname - The target nickname
 * @returns {UserHandler} The user handler
 */
export function getUserHandler(lang: Lang, id: string, mode: UserHandlerMode, targetId: string | undefined = undefined, nickname: string | undefined = undefined) : UserHandler {
  let handler = userHandlers.get(id)
  if (!handler) {
    handler = new UserHandler(lang, mode, User.create(id))
    userHandlers.set(id, handler)
  }
  handler.setMode(mode)
  handler.setLang(lang)
  if (targetId != undefined) {
    handler.setTarget(User.create(targetId), nickname!)
  }
  return handler
}

/**
 * @fonction
 * 
 * Sets autoSell for the specified user
 * 
 * @param {string} id - The user id
 * @param {boolean} autoSell - The value of the autoSell
 * @param {Lang} lang - The lang of the server
 */
export function setAutoSell(id: string, autoSell: boolean, lang: Lang) : InteractionReply {
  const user: User = User.create(id)
  user.autoSell = autoSell
  User.update(user)
  const embed = new MessageEmbed()
  const buttons: MessageButton[] = []
  embed.setTitle(lang.user.settingsUpdated)
  embed.setDescription(lang.user.autoSellSet)
  return new InteractionReply(embed, buttons)
}

/**
 * 
 * @param {string} id - The user id
 * @param {Lang} lang - The lang of the server
 */
export function sellAllDuplicates(id: string, lang: Lang) : InteractionReply {
  const user: User = User.create(id)
  const embed = new MessageEmbed()
  const buttons: MessageButton[] = []
  let money = 0
  JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/series.json`).toString()).forEach((s: Serie) => {
    JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/${s.id}.json`).toString()).forEach((e: Expansion) => {
      if (e.released) {
        money += sellDuplicatesFrom(Object.assign(new Expansion, e), user.cards[e.id])
      }
    })
  })
  user.money += money
  User.update(user)
  embed.setTitle(lang.card.duplicateSold)
  if (money > 0) {
    embed.setDescription(`${lang.card.soldAllFor} ${money}$`)
  } else {
    embed.setDescription(`${lang.card.noDuplicates}`)
  }
  return new InteractionReply(embed, buttons)
}

/**
 * @function
 * 
 * Sell all duplicates from an expansion
 * 
 * @param {Expansion} expansion - The expansion to sell 
 * @param {CardCount[]} count - The list of the card the user has
 * @returns {number} the price of this expansion
 */
function sellDuplicatesFrom(expansion: Expansion, count: CardCount[]) : number {
  let total: number = 0
  count.forEach(cc => {
    if (cc.quantity <= 1) {
      return
    }
    const toRemove = cc.quantity - 1
    cc.quantity = 1
    let price: number = getCardPrice('COMMON', expansion.common, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
    price = getCardPrice('UNCOMMON', expansion.uncommon, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
    price = getCardPrice('RARE', expansion.rare, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
    price = getCardPrice('SPECIAL', expansion.special, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
    price = getCardPrice('ULTRARARE', expansion.ultraRare, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
    price = getCardPrice('SPECIAL', expansion.special, cc.cardNumber, expansion.price) * toRemove
    if (price != 0) {
      total += price
      return
    }
  })
  return total
}

/**
 * 
 * @param {Rarity} rarity - The rarity of the card
 * @param {number[]} arr - The array of cards
 * @param {number} card - The number of the card to sell
 * @param {number} price - The price of the expansion
 * @returns {number} The price of the card
 */
function getCardPrice(rarity: Rarity, arr: number[], card: number, price: number) : number {
  if (arr.find(c => c == card)) {
    return Card.sell(rarity, price)
  }
  return 0
}
