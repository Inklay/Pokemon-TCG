import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { Card } from './Card'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'
import { series } from './Serie'
import { User } from './User'
import { CardCount } from './CardCount'

const viewers: Map<string, CardViewer> = new Map()

enum CardViewerModeEnum {
  BUYING,
  VIEWING,
  TRADING,
  OTHER
}

export type CardViewerMode = keyof typeof CardViewerModeEnum

export class CardViewer {
  user: User
  serieIdx: number
  expansionIdx: number
  cardIdx: number
  oldSerieIdx: number
  resellPrice: number
  mode: CardViewerMode
  wentBack: boolean
  cards: Card[]

  constructor (user: User) {
    this.user = user
    this.serieIdx = 0
    this.expansionIdx = 0
    this.cardIdx = 0
    this.oldSerieIdx = 0
    this.mode = 'BUYING'
    this.resellPrice = 0
    this.wentBack = false
    this.cards = []
  }

  drawSerie(lang: Lang) : InteractionReply {
    return series[this.serieIdx].draw(lang, this.serieIdx, series.length, this.mode)
  }

  prevSerie(lang: Lang) : InteractionReply {
    if (this.serieIdx > 0) {
      this.serieIdx--
    }
    return this.drawSerie(lang)
  }

  nextSerie(lang: Lang) : InteractionReply {
    if (this.serieIdx + 1 < series.length) {
      this.serieIdx++
    }
    return this.drawSerie(lang)
  }

  backCard(lang: Lang) : InteractionReply {
    this.resellPrice = 0
    return this.drawExpansion(lang)
  }

  drawExpansion(lang: Lang) : InteractionReply {
    if (this.serieIdx !== this.oldSerieIdx && this.wentBack) {
      this.expansionIdx = 0
      this.wentBack = false
    }
    return series[this.serieIdx].expansions[this.expansionIdx]
      .draw(lang, this.expansionIdx, series[this.serieIdx].expansions.length, this.mode, this.user, this.resellPrice)
  }

  prevExpansion(lang: Lang) : InteractionReply {
    if (this.expansionIdx > 0) {
      this.expansionIdx--
    }
    return this.drawExpansion(lang)
  }

  nextExpansion(lang: Lang) : InteractionReply {
    if (this.expansionIdx + 1 < series[this.serieIdx].expansions.length) {
      this.expansionIdx++
    }
    return this.drawExpansion(lang)
  }

  openBooster(lang: Lang) : InteractionReply {
    const expansion = series[this.serieIdx].expansions[this.expansionIdx]
    if (expansion.price > this.user.money)
      return this.notEnoughMoney(lang)

    this.user.money -= expansion.price
    this.cards = []
    this.cardIdx = 0
    for (let i: number = 0; i < 4; i++) {
      this.cards.push(Card.generate('COMMON', expansion, this.cards))
    }
    for (let i: number = 0; i < 3; i++) {
      this.cards.push(Card.generate('UNCOMMON', expansion, this.cards))
    }
    this.cards.push(Card.generate('SECRET', expansion, this.cards, 'RARE', true))
    for (let i: number = 0; i < 2; i++) {
      this.cards.push(Card.generate('SECRET', expansion, this.cards, 'COMMON', true))
    }
    this.checkNewCard()
    this.user.money += this.resellPrice
    this.user.save()

    return this.cards[0].draw(lang, 0, 10, this.mode, this.resellPrice)
  }

  prevCard(lang: Lang) : InteractionReply {
    if (this.cardIdx > 0) {
      this.cardIdx--
    }
    return this.cards[this.cardIdx].draw(lang, this.cardIdx, this.cards.length, this.mode, this.resellPrice)
  }

  nextCard(lang: Lang) : InteractionReply {
    if (this.cardIdx + 1 < this.cards.length) {
      this.cardIdx++
    }
    return this.cards[this.cardIdx].draw(lang, this.cardIdx, this.cards.length, this.mode, this.resellPrice)
  }

  backExpansion(lang: Lang) : InteractionReply {
    this.oldSerieIdx = this.serieIdx
    this.wentBack = true
    return this.drawSerie(lang)
  }

  unfavExpansion(lang: Lang) : InteractionReply {
    this.user.favourite = 'none'
    this.user.save()
    return this.drawExpansion(lang)
  }
  
  favExpansion(lang: Lang) : InteractionReply {
    this.user.favourite = series[this.serieIdx].expansions[this.expansionIdx].id
    this.user.save()
    return this.drawExpansion(lang)
  }

  viewExpansion(lang: Lang) : InteractionReply {
    return this.drawExpansion(lang)
  }

  sellExpansion(lang: Lang) : InteractionReply {
    return this.drawExpansion(lang)
  }

  notEnoughMoney(lang: Lang) : InteractionReply {
    const embed = new EmbedBuilder()
    const buttons : ButtonBuilder[] = []
    embed.setTitle(lang.money.notEnough)
    embed.setDescription(lang.money.dontHaveEnough)
    buttons.push(new ButtonBuilder()
      .setCustomId('moneyGoBack')
      .setStyle(ButtonStyle.Success)
    )
    return new InteractionReply(embed, buttons)
  }

  private checkNewCard() : void {
    this.resellPrice = 0
    this.cards.forEach( c => {
      const counts = this.user.cards[series[this.serieIdx].expansions[this.expansionIdx].id]
      const countIdx = counts.findIndex(cc => cc.cardNumber == parseInt(c.number))
      if (countIdx !== -1) {
        if (this.user.autoSell) {
          this.resellPrice += c.sell()
        } else {
          counts[countIdx].quantity++
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

  static get(user: User) : CardViewer {
    let viewer = viewers.get(user.id)
    if (viewer) {
      return viewer
    }
    viewer = new CardViewer(user)
    viewers.set(user.id, viewer)
    return viewer
  }
}
