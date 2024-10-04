import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'
import { series } from './Serie'
import { User } from './User'

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
  seriesIdx: number
  expansionIdx: number
  oldSerieIdx: number
  resellPrice: number
  mode: CardViewerMode
  wentBack: boolean

  constructor (user: User) {
    this.user = user
    this.seriesIdx = 0
    this.expansionIdx = 0
    this.oldSerieIdx = 0
    this.mode = 'BUYING'
    this.resellPrice = 0
    this.wentBack = false
  }

  drawSerie(lang: Lang) : InteractionReply {
    return series[this.seriesIdx].draw(lang, this.seriesIdx, series.length, this.mode)
  }

  prevSerie(lang: Lang) : InteractionReply {
    if (this.seriesIdx > 0) {
      this.seriesIdx--
    }
    return this.drawSerie(lang)
  }

  nextSerie(lang: Lang) : InteractionReply {
    if (this.seriesIdx + 1 < series.length) {
      this.seriesIdx++
    }
    return this.drawSerie(lang)
  }

  drawExpansion(lang: Lang) : InteractionReply {
    if (this.seriesIdx !== this.oldSerieIdx && this.wentBack) {
      this.expansionIdx = 0
      this.wentBack = false
    }
    return series[this.seriesIdx].expansions[this.expansionIdx]
      .draw(lang, this.expansionIdx, series[this.seriesIdx].expansions.length, this.mode, this.user, this.resellPrice)
  }

  prevExpansion(lang: Lang) : InteractionReply {
    if (this.expansionIdx > 0) {
      this.expansionIdx--
    }
    return this.drawExpansion(lang)
  }

  nextExpansion(lang: Lang) : InteractionReply {
    if (this.expansionIdx + 1 < series[this.seriesIdx].expansions.length) {
      this.expansionIdx++
    }
    return this.drawExpansion(lang)
  }

  selectExpansion(lang: Lang) : InteractionReply {
    return this.drawExpansion(lang)
  }

  backExpansion(lang: Lang) : InteractionReply {
    this.oldSerieIdx = this.seriesIdx
    this.wentBack = true
    return this.drawSerie(lang)
  }

  unfavExpansion(lang: Lang) : InteractionReply {
    this.user.favourite = 'none'
    this.user.save()
    return this.drawExpansion(lang)
  }
  
  favExpansion(lang: Lang) : InteractionReply {
    this.user.favourite = series[this.seriesIdx].expansions[this.expansionIdx].id
    this.user.save()
    return this.drawExpansion(lang)
  }

  viewExpansion(lang: Lang) : InteractionReply {
    return this.drawExpansion(lang)
  }

  sellExpansion(lang: Lang) : InteractionReply {
    return this.drawExpansion(lang)
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
