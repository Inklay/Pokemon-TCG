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
 * @public @property {number} number - The number of the card in the expansion
 */
export class Card {
  private image: string
  private isNew: boolean
  private expansion: Expansion
  public number: string

  /**
   * @constructor
   * @param {Expansion} expansion - The expansion of the card
   * @param {number} number - The number of the card in the expansion
   */
  constructor(expansion: Expansion, number: number) {
    this.expansion = expansion
    this.number = expansion.fixNumber ? this.fixNumber(number) : number.toString()
    this.image = `${expansion.cardsBaseImage}${number}.png`
    this.isNew = false
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
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @returns {InteractionReply} The reply of the interaction
   */
  public draw(idx: number, max: number, lang: Lang, mode: UserHandlerMode) : InteractionReply {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx,max, lang, mode)
    embed.setTitle(`${lang.card.openingOf} ${this.expansion.name}`)
    if (this.isNew) {
      embed.setAuthor(lang.card.new)
    }
    embed.setFooter(`${idx + 1}/${max + 1}`)
    embed.setImage(this.image)
    return new InteractionReply(embed, buttons)
  }

  /**
   * @private @method
   * 
   * Creates button for the embed message
   * 
   * @param {number} idx - The index of this card in the card array
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @returns {MessageButton[]} The buttons to add to the message
   */
  private createButton(idx: number, max: number, lang: Lang, mode: UserHandlerMode) : MessageButton[] {
    const buttons : MessageButton[] = []
    if (idx != 0) {
      buttons.push(new MessageButton({
        customId: 'cardPrev',
        style: "PRIMARY",
        emoji: '⬅️'
      }))
    }
    if (idx != max) {
      buttons.push(new MessageButton({
        customId: 'cardNext',
        style: "PRIMARY",
        emoji: '➡️'
      }))
    }
    if (idx == max && mode == 'TRADING') {
      buttons.push(new MessageButton({
        label: lang.expansion.select,
        customId: 'cardSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'cardBack',
      style: "DANGER",
      emoji: '❌'
    }))
    return buttons
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
          return new Card(expansion, this.generateCard(expansion.common, cards))
        case 'UNCOMMON':
          return new Card(expansion, this.generateCard(expansion.uncommon, cards))
        case 'RARE':
          return new Card(expansion, this.generateCard(expansion.rare, cards))
        case 'SPECIAL':
          return new Card(expansion, this.generateCard(expansion.special, cards))
        case 'ULTRARARE':
          return new Card(expansion, this.generateCard(expansion.ultraRare, cards))
        case 'SECRET':
          return new Card(expansion, this.generateCard(expansion.secret, cards))
      }
    } else {
      const rand: number = Math.random()
      if (rarity >= 'SECRET' && rand <= 1/2000) {
        return new Card(expansion, this.generateCard(expansion.secret, cards))
      } else if (rarity >= 'ULTRARARE' && rand <= 1/500 && rarityMin <= 'ULTRARARE') {
        return new Card(expansion, this.generateCard(expansion.ultraRare, cards))
      } else if (rarity >= 'SPECIAL' && rand <= 1/300 && rarityMin <= 'SPECIAL') {
        return new Card(expansion, this.generateCard(expansion.special, cards))
      } else if (rarity >= 'RARE' && rand <= 1/20 && rarityMin <= 'RARE') {
        return new Card(expansion, this.generateCard(expansion.rare, cards))
      } else if (rarity >= 'UNCOMMON' && rand <= 1/10 && rarityMin <= 'UNCOMMON') {
        return new Card(expansion, this.generateCard(expansion.uncommon, cards))
      } else {
        return new Card(expansion, this.generateCard(expansion.common, cards))
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
