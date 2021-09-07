import { Serie } from '../structure/Serie'
import { Expansion } from '../structure/Expansion'
import { Lang } from '../structure/Lang'
import fs from 'fs'
import { InteractionReply } from '../structure/InteractionReply'

export enum userHandlerMode {
  BUYING,
  VIEWING
}

export class userHandler {
  private series: Serie[]
  private serieIdx: number
  private expansions: Expansion[]
  private expansionIdx: number
  private buying: boolean
  private lang: Lang
  private mode: userHandlerMode
  private serieMax: number
  private expansionMax: number

  constructor(lang: Lang, mode: userHandlerMode, buying = true) {
    this.series = []
    JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/series.json`).toString()).forEach((e: Serie) => {
      this.series.push(Object.assign(new Serie, e))
    })
    this.serieIdx = 0
    this.expansions = []
    JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/${this.series[0].id}.json`).toString()).forEach((e: Expansion) => {
      this.expansions.push(Object.assign(new Expansion, e))
    })
    this.expansionIdx = 0
    this.buying = buying
    this.lang = lang
    this.mode = mode
    this.serieMax = this.series.length - 1
    this.expansionMax = this.expansions.length - 1
  }

  private loadExpansions() {
    this.expansions = []
    JSON.parse(fs.readFileSync(`cards/${this.lang.global.dir}/${this.series[this.serieIdx].id}.json`).toString()).forEach((e: Expansion) => {
      this.expansions.push(Object.assign(new Expansion, e))
    })
    this.expansionIdx = 0
    this.expansionMax = this.expansions.length
  }

  drawSerie() : InteractionReply {
    return this.series[this.serieIdx].draw(this.expansions, this.serieIdx, this.lang, this.mode, this.serieMax)
  }

  drawExpansion() : InteractionReply {
    return this.expansions[this.expansionIdx].draw(this.expansionIdx, this.lang, this.mode, this.expansionMax)
  }

  getSerie() : Serie {
    return this.series[this.serieIdx]
  }

  getExpansion(): Expansion {
    return this.expansions[this.expansionIdx]
  }

  isBuying() : boolean {
    return this.buying
  }

  incSerieIdx() {
    if (this.serieIdx + 1 <= this.serieMax) {
      this.serieIdx++
      this.loadExpansions()
    }
  }

  decSerieIdx() {
    if (this.serieIdx - 1 >= 0) {
      this.serieIdx--
      this.loadExpansions()
    }
  }

  setSerieIdx(idx: number) {
    if (idx <= this.serieMax && idx >= 0) {
      this.serieIdx = idx
      this.loadExpansions()
    }
  }

  incExpansionIdx() {
    if (this.expansionIdx + 1 <= this.expansionMax) {
      this.expansionIdx++
    }
  }

  decExpansionIdx() {
    if (this.expansionIdx - 1 >= 0) {
      this.expansionIdx--
    }
  }

  setExpansionIdx(idx: number) {
    if (idx <= this.expansionMax && idx >= 0) {
      this.expansionIdx = idx
    }
  }

  setMode(mode: userHandlerMode) {
    this.mode = mode
  }
}

export let userHandlers = new Map<string, userHandler>()

export function getUserHandler(lang: Lang, id: string, mode: userHandlerMode) : userHandler{
  let handler = userHandlers.get(id)
  if (!handler) {
    handler = new userHandler(lang, mode)
    userHandlers.set(id, handler)
  }
  handler.setMode(mode)
  return handler
}
