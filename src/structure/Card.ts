import { MessageButton, MessageEmbed } from 'discord.js'
import { UserHandlerMode } from '../commandsHandler/userHandler'
import { Expansion } from './Expansion'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'

/**
 * @enum {number} RarityEnum
 * 
 * Enum for the rarity of a card
 * 
 * @readonly
 */
enum RarityEnum {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  SPECIAL = 3,
  ULTRARARE = 4,
  SECRET = 5
}

/**
 * @typedef {string} Rarity
 */
export type Rarity = keyof typeof RarityEnum

/**
 * @class Card
 * 
 * The Card object
 * 
 * @private @property {string} image - The URL of the card image
 * @private @property {boolean} isNew - Whether or not the user already has this card
 * @private @property {Expansion} expansion - The expansion of the card
 * @private @property {Rarity} rarity - The card's rarity
 * @private @property {number} expPrice - The expansion's price
 * @public @property {number} number - The number of the card in the expansion
 */
export class Card {
  private image: string
  private isNew: boolean
  private expansion: Expansion
  private rarity: Rarity
  private expPrice: number
  public number: string

  /**
   * @constructor
   * @param {Expansion} expansion - The expansion of the card
   * @param {number} number - The number of the card in the expansion
   */
  constructor(expansion: Expansion, number: number, rarity: Rarity, expPrixe: number) {
    this.expansion = expansion
    this.number = expansion.fixNumber ? this.fixNumber(number) : number.toString()
    this.image = `${expansion.cardsBaseImage}${number}.png`
    this.isNew = false
    this.rarity = rarity
    this.expPrice = expPrixe
  }

  /**
   * @private @method
   * 
   * Adds 0 before the real number
   * 
   * @param {number} number - The number of the card in this expansion 
   * @returns {string} The fixed number
   */
  private fixNumber(number: number) : string {
    if (number < 10) {
      return `00${number}`
    } else if (number < 100) {
      return `0${number}`
    }
    return number.toString()
  }

  /**
   * @public @method
   * 
   * Marks this card as new
   * 
   * @returns {void}
   */
  public setNew() : void {
    this.isNew = true
  }

  /**
   * @public @method
   * 
   * Draws a card in a Discord embed message
   * 
   * @param {number} idx - The index of this card in the card array
   * @param {number} max - The size of the card expansion array
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @param {number| undefined} price - The price of the cards if sold
   * @param {number| undefined} quantity - The number of time the user has this card
   * @param {string| undefined} nickname - The nickname of the user collection
   * @param {boolean} selfViewing - Whether or not the target is the user running the comand
   * @param {number} cardSeen - The number of cards seen on this expansion
   * @param {number} cardMax - The number of card of this expansion
   * @param {number} cardSecret - The number of secret cards seen
   * @param {boolean} isNeg - Whether or not the amount of money is to be subtracted from the total
   * @returns {InteractionReply} The reply of the interaction
   */
  public draw(idx: number, max: number, lang: Lang, mode: UserHandlerMode, price: number | undefined = undefined, quantity: number | undefined = undefined, nickname: string | undefined = undefined, selfViewing: boolean = true, cardsSeen: number = 0, cardsMax: number = 0, cardsSecret: number = 0, isNeg: boolean = true) : InteractionReply {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx, max, lang, mode, quantity, isNeg)
    embed.description = ''
    if (price != undefined && price > 0) {
      embed.description += (`${lang.card.soldFor} ${price}$\n`)
    }
    if (mode == 'BUYING') {
      if (this.isNew) {
        embed.setAuthor(lang.card.new)
      }
      embed.setTitle(`${lang.card.openingOf} ${this.expansion.name}`)
    } else if (mode == 'VIEWING') {
      if (selfViewing) {
        embed.setTitle(`${lang.card.yourCollection} - ${this.expansion.name}`)
        embed.description += (`${lang.global.youHave} ${lang.card.thisCard} ${quantity} ${lang.card.times}`)
      } else {
        embed.setTitle(`${lang.card.collectionPrefix}${nickname}${lang.card.collectionSufix} - ${this.expansion.name}`)
        embed.description += (`${nickname} ${lang.card.has} ${lang.card.thisCard} ${quantity} ${lang.card.times}`)
      }
      embed.description += `\n\n${lang.card.progression}: ${cardsSeen}/${cardsMax}`
      if (cardsSecret > 0) {
        embed.description += `\n${lang.card.secret}: ${cardsSecret}`
      }
    } else if (mode == 'TRADING') {
      
    }
    embed.setFooter({text: `${idx + 1}/${max}`})
    embed.setImage(this.image)
    return new InteractionReply(embed, buttons)
  }

  /**
   * @private @method
   * 
   * Creates button for the embed message
   * 
   * @param {number} idx - The index of this card in the card array
   * @param {number} max - The size of the card expansion array
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @param {number| undefined} quantity - The number of time the user has this card
   * @param {boolean} isNeg - Whether or not the amount of money is to be subtracted from the total
   * @returns {MessageButton[]} The buttons to add to the message
   */
  private createButton(idx: number, max: number, lang: Lang, mode: UserHandlerMode, quantity: number | undefined, isNeg?: boolean) : MessageButton[] {
    const buttons : MessageButton[] = []
    buttons.push(new MessageButton({
      customId: 'cardPrev',
      style: 'PRIMARY',
      emoji: '⬅️',
      disabled: idx === 0
    }))
    buttons.push(new MessageButton({
      customId: 'cardNext',
      style: 'PRIMARY',
      emoji: '➡️',
      disabled: idx + 1 === max
    }))
    if (idx == max) {
      buttons.push(new MessageButton({
        label: lang.expansion.select,
        customId: 'cardSelect',
        style: 'SUCCESS',
        emoji: '✔️'
      }))
    } else if (mode == 'TRADING') {
      buttons.push(new MessageButton({
        label: lang.trade.selectCard,
        customId: 'cardSelect',
        style: 'SUCCESS',
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'cardBack',
      style: 'DANGER',
      emoji: '❌'
    }))
    if (mode == 'VIEWING') {
      if (quantity! > 1) {
        buttons.push(new MessageButton({
          label: lang.card.sellOneDuplicate,
          customId: 'cardSellOne',
          style: 'SECONDARY',
          emoji: '💵'
        }))
      }
      if (quantity! > 2) {
        buttons.push(new MessageButton({
          label: lang.card.sellAllDuplicate,
          customId: 'cardSellAll',
          style: 'SECONDARY',
          emoji: '💰'
        }))
      }
    }
    buttons.push(new MessageButton({
      label: lang.card.moreInfo,
      style: 'LINK',
      url: `${this.expansion.infoBaseUrl}${this.number}/`
    }))
    return buttons
  }
  
  /**
   * @public @method
   * 
   * Returns the price the card
   * 
   * @returns {number} The price of the card
   */
  public sell() : number {
    switch (this.rarity) {
      case 'UNCOMMON':
        return Math.floor(2 * this.expPrice) / 10
      case 'RARE':
        return Math.floor(5 * this.expPrice) / 10
      case 'SPECIAL':
        return Math.floor(10 * this.expPrice) / 10
      case 'ULTRARARE':
        return Math.floor(25 * this.expPrice) / 10
      case 'SPECIAL':
        return Math.floor(50 * this.expPrice) / 10
      default:
        return Math.floor(1 * this.expPrice) / 10
    }
  }

  /**
   * @public @static @method
   * 
   * Returns the price the card
   * 
   * @param {Rarity} rarity - The rarity of the card
   * @param {number} expPrice - The price of the expansion
   * @returns {number} The price of the card
   */
  public static sell(rarity: Rarity, expPrice: number) : number {
    switch (rarity) {
      case 'UNCOMMON':
        return Math.floor(2 * expPrice) / 10
      case 'RARE':
        return Math.floor(5 * expPrice) / 10
      case 'SPECIAL':
        return Math.floor(10 * expPrice) / 10
      case 'ULTRARARE':
        return Math.floor(25 * expPrice) / 10
      case 'SPECIAL':
        return Math.floor(50 * expPrice) / 10
      default:
        return Math.floor(1 * expPrice) / 10
    }
  }

  /**
   * @public @static @method
   * 
   * Generates a card with the chosen rarity
   * 
   * @param {Rarity} rarity - The rarity of the card
   * @param {Crad[]} cards - The cards already generated, to avoid duplicates
   * @param {Expansion} expansion - The expansion of the card to generate
   * @param {Rarity} rarityMin - The minimum rarity of the card
   * @param {boolean} backwardRarity - Whether or not the rarity can decrease
   * @returns {Card} The generated card
   */
  public static generate(rarity: Rarity, expansion:Expansion, cards: Card[], rarityMin: Rarity = 'COMMON', backwardRarity: boolean = false) : Card {
    if (!backwardRarity) {
      switch (rarity) {
        case 'COMMON':
          return new Card(expansion, this.generateCard(expansion.common, cards), 'COMMON', expansion.price)
        case 'UNCOMMON':
          return new Card(expansion, this.generateCard(expansion.uncommon, cards), 'UNCOMMON', expansion.price)
        case 'RARE':
          return new Card(expansion, this.generateCard(expansion.rare, cards), 'RARE', expansion.price)
        case 'SPECIAL':
          return new Card(expansion, this.generateCard(expansion.special, cards), 'SPECIAL', expansion.price)
        case 'ULTRARARE':
          return new Card(expansion, this.generateCard(expansion.ultraRare, cards), 'ULTRARARE', expansion.price)
        case 'SECRET':
          return new Card(expansion, this.generateCard(expansion.secret, cards), 'SECRET', expansion.price)
      }
    } else {
      const rand: number = Math.random()
      if (rarity >= 'SECRET' && rand <= 1/2000 && expansion.canGetSecret) {
        return new Card(expansion, this.generateCard(expansion.secret, cards), 'SECRET', expansion.price)
      } else if (rarity >= 'ULTRARARE' && rand <= 1/500 && rarityMin <= 'ULTRARARE') {
        return new Card(expansion, this.generateCard(expansion.ultraRare, cards), 'ULTRARARE', expansion.price)
      } else if (rarity >= 'SPECIAL' && rand <= 1/300 && rarityMin <= 'SPECIAL') {
        return new Card(expansion, this.generateCard(expansion.special, cards), 'SPECIAL', expansion.price)
      } else if (rarity >= 'RARE' && rand <= 1/20 && rarityMin <= 'RARE') {
        return new Card(expansion, this.generateCard(expansion.rare, cards), 'RARE', expansion.price)
      } else if (rarity >= 'UNCOMMON' && rand <= 1/10 && rarityMin <= 'UNCOMMON') {
        return new Card(expansion, this.generateCard(expansion.uncommon, cards), 'UNCOMMON', expansion.price)
      } else {
        return new Card(expansion, this.generateCard(expansion.common, cards), 'COMMON', expansion.price)
      }
    }
  }

  /**
   * @private @static @method
   * 
   * Generate a card of a specific rarity
   * 
   * @param {number} array - The array of number to use for generating this card
   * @param {Cards[]} cards - The cards already generated, to avoid duplicates
   * @returns {number} The number of the card
   */
  private static generateCard(array: number[], cards: Card[]) : number {
    let rand: number  = Math.floor(Math.random() * array.length)
    while (cards.find(c => c.number == array[rand].toString())) {
      rand = Math.floor(Math.random() * array.length)
    }
    return array[rand]
  }
}
