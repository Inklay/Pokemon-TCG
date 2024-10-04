import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { CardViewerMode } from './CardViewer'
import { Expansion } from './Expansion'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'

enum RarityEnum {
  COMMON    = 0,
  UNCOMMON  = 1,
  RARE      = 2,
  ULTRARARE = 3,
  SECRET    = 4
}

export type Rarity = keyof typeof RarityEnum

export class Card {
  private image: string
  private isNew: boolean
  private expansion: Expansion
  private rarity: Rarity
  private expPrice: number
  public number: string

  constructor(expansion: Expansion, number: number, rarity: Rarity, expPrixe: number) {
    this.expansion = expansion
    this.number = expansion.fixNumber ? this.fixNumber(number) : number.toString()
    this.image = `${expansion.cardsBaseImage}${number}.png`
    this.isNew = false
    this.rarity = rarity
    this.expPrice = expPrixe
  }

  private fixNumber(number: number) : string {
    if (number < 10) {
      return `00${number}`
    } else if (number < 100) {
      return `0${number}`
    }
    return number.toString()
  }

  public setNew() : void {
    this.isNew = true
  }

  public draw(lang: Lang, idx: number, max: number, mode: CardViewerMode, price: number | undefined = undefined, quantity: number | undefined = undefined, nickname: string | undefined = undefined, selfViewing: boolean = true, cardsSeen: number = 0, cardsMax: number = 0, cardsSecret: number = 0) : InteractionReply {
    const embed = new EmbedBuilder()
    const buttons = this.createButton(lang, idx, max, mode, quantity)
    let description = ''
    if (price) {
      description += (`${lang.card.soldFor} ${price}$\n`)
    }
    if (mode == 'BUYING') {
      if (this.isNew) {
        embed.setAuthor({name: lang.card.new})
      }
      embed.setTitle(`${lang.card.openingOf} ${this.expansion.name}`)
    } else if (mode == 'VIEWING') {
      if (selfViewing) {
        embed.setTitle(`${lang.card.yourCollection} - ${this.expansion.name}`)
        description += (`${lang.global.youHave} ${lang.card.thisCard} ${quantity} ${lang.card.times}`)
      } else {
        embed.setTitle(`${lang.card.collection.replace('<NICKNAME>', nickname!)} - ${this.expansion.name}`)
        description += (`${nickname} ${lang.card.has} ${lang.card.thisCard} ${quantity} ${lang.card.times}`)
      }
      description += `\n\n${lang.card.progression}: ${cardsSeen}/${cardsMax}`
      if (cardsSecret > 0) {
        description += `\n${lang.card.secret}: ${cardsSecret}`
      }
    }
    embed.setFooter({text: `${idx + 1}/${max}`})
    embed.setImage(this.image)
    embed.setDescription(description)
    return new InteractionReply(embed, buttons)
  }

  private createButton(lang: Lang, idx: number, max: number, mode: CardViewerMode, quantity: number | undefined) : ButtonBuilder[] {
    const buttons : ButtonBuilder[] = []

    buttons.push(new ButtonBuilder()
      .setCustomId('cardPrev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(idx == 0)
    )

    buttons.push(new ButtonBuilder()
      .setCustomId('cardNext')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(idx + 1 === max)
    )

    if (idx == max) {
      buttons.push(new ButtonBuilder()
        .setCustomId('cardSelect')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✔️')
        .setLabel(lang.expansion.select)
      )
    } else if (mode == 'TRADING') {
      buttons.push(new ButtonBuilder()
        .setCustomId('cardSelect')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✔️')
        .setLabel(lang.trade.selectCard)
      )
    }

    buttons.push(new ButtonBuilder()
      .setCustomId('cardBack')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('✖️')
      .setLabel(lang.global.back)
    )

    if (mode == 'VIEWING') {
      if (quantity! > 1) {
        buttons.push(new ButtonBuilder()
          .setCustomId('cardSellOne')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💵')
          .setLabel(lang.card.sellOneDuplicate)
        )
      }
      if (quantity! > 2) {
        buttons.push(new ButtonBuilder()
          .setCustomId('cardSellAll')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💰')
          .setLabel(lang.card.sellAllDuplicate)
        )
      }
    }

    buttons.push(new ButtonBuilder()
      .setURL(this.expansion.expUrl)
      .setStyle(ButtonStyle.Link)
      .setLabel(lang.expansion.info)
    )

    return buttons
  }

  // public sell() : number {
  //   switch (this.rarity) {
  //     case 'UNCOMMON':
  //       return Math.floor(2 * this.expPrice) / 10
  //     case 'RARE':
  //       return Math.floor(5 * this.expPrice) / 10
  //     case 'SPECIAL':
  //       return Math.floor(10 * this.expPrice) / 10
  //     case 'ULTRARARE':
  //       return Math.floor(25 * this.expPrice) / 10
  //     case 'SPECIAL':
  //       return Math.floor(50 * this.expPrice) / 10
  //     default:
  //       return Math.floor(1 * this.expPrice) / 10
  //   }
  // }


  // public static sell(rarity: Rarity, expPrice: number) : number {
  //   switch (rarity) {
  //     case 'UNCOMMON':
  //       return Math.floor(2 * expPrice) / 10
  //     case 'RARE':
  //       return Math.floor(5 * expPrice) / 10
  //     case 'SPECIAL':
  //       return Math.floor(10 * expPrice) / 10
  //     case 'ULTRARARE':
  //       return Math.floor(25 * expPrice) / 10
  //     case 'SPECIAL':
  //       return Math.floor(50 * expPrice) / 10
  //     default:
  //       return Math.floor(1 * expPrice) / 10
  //   }
  // }

  // public static generate(rarity: Rarity, expansion:Expansion, cards: Card[], rarityMin: Rarity = 'COMMON', backwardRarity: boolean = false) : Card {
  //   if (!backwardRarity) {
  //     switch (rarity) {
  //       case 'COMMON':
  //         return new Card(expansion, this.generateCard(expansion.common, cards), 'COMMON', expansion.price)
  //       case 'UNCOMMON':
  //         return new Card(expansion, this.generateCard(expansion.uncommon, cards), 'UNCOMMON', expansion.price)
  //       case 'RARE':
  //         return new Card(expansion, this.generateCard(expansion.rare, cards), 'RARE', expansion.price)
  //       case 'SPECIAL':
  //         return new Card(expansion, this.generateCard(expansion.special, cards), 'SPECIAL', expansion.price)
  //       case 'ULTRARARE':
  //         return new Card(expansion, this.generateCard(expansion.ultraRare, cards), 'ULTRARARE', expansion.price)
  //       case 'SECRET':
  //         return new Card(expansion, this.generateCard(expansion.secret, cards), 'SECRET', expansion.price)
  //     }
  //   } else {
  //     const rand: number = Math.random()
  //     if (rarity >= 'SECRET' && rand <= 1/2000 && expansion.canGetSecret) {
  //       return new Card(expansion, this.generateCard(expansion.secret, cards), 'SECRET', expansion.price)
  //     } else if (rarity >= 'ULTRARARE' && rand <= 1/500 && rarityMin <= 'ULTRARARE') {
  //       return new Card(expansion, this.generateCard(expansion.ultraRare, cards), 'ULTRARARE', expansion.price)
  //     } else if (rarity >= 'SPECIAL' && rand <= 1/300 && rarityMin <= 'SPECIAL') {
  //       return new Card(expansion, this.generateCard(expansion.special, cards), 'SPECIAL', expansion.price)
  //     } else if (rarity >= 'RARE' && rand <= 1/20 && rarityMin <= 'RARE') {
  //       return new Card(expansion, this.generateCard(expansion.rare, cards), 'RARE', expansion.price)
  //     } else if (rarity >= 'UNCOMMON' && rand <= 1/10 && rarityMin <= 'UNCOMMON') {
  //       return new Card(expansion, this.generateCard(expansion.uncommon, cards), 'UNCOMMON', expansion.price)
  //     } else {
  //       return new Card(expansion, this.generateCard(expansion.common, cards), 'COMMON', expansion.price)
  //     }
  //   }
  // }

  // private static generateCard(array: number[], cards: Card[]) : number {
  //   let rand: number  = Math.floor(Math.random() * array.length)
  //   while (cards.find(c => c.number == array[rand].toString())) {
  //     rand = Math.floor(Math.random() * array.length)
  //   }
  //   return array[rand]
  // }
}
