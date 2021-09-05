import { Serie } from '../structure/Serie'
import { Expansion } from '../structure/Expansion'
import { Lang } from '../structure/Lang'
import fs from 'fs'
import { InteractionReply } from '../structure/InteractionReply'

export const serieMin = 0
export const serieMax = 1

export class userHandler {
  private series: Serie[]
  private serieIdx: number
  private expansions: Expansion[]
  private expansionIdx: number
  private buying: boolean
  private lang: Lang

  constructor(lang: Lang, buying = true) {
    this.series = []
    JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/series.json`).toString()).forEach((e: Serie) => {
      this.series.push(Object.assign(new Serie, e))
    })
    this.serieIdx = 0
    this.expansions = JSON.parse(fs.readFileSync(`cards/${lang.global.dir}/${this.series[0].id}.json`).toString()) as Expansion[]
    this.expansionIdx = 0
    this.buying = buying
    this.lang = lang
  }

  private loadExpansions() {
    this.expansions = JSON.parse(fs.readFileSync(`cards/${this.lang.global.dir}/${this.series[this.serieIdx].id}.json`).toString()) as Expansion[]
  }

  drawSerie() : InteractionReply {
    return this.series[this.serieIdx].draw(this.expansions, this.serieIdx, this.lang)
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
    if (this.serieIdx + 1 <= serieMax) {
      this.serieIdx++
      this.loadExpansions()
    }
  }

  decSerieIdx() {
    if (this.serieIdx - 1 >= serieMin) {
      this.serieIdx--
      this.loadExpansions()
    }
  }

  setSerieIdx(idx: number) {
    if (idx <= serieMax && idx >= serieMin) {
      this.serieIdx = idx
      this.loadExpansions()
    }
  }
}

export let userHandlers = new Map<string, userHandler>()

export function getUserHandler(lang: Lang, id: string) : userHandler{
  let handler = userHandlers.get(id)
  if (!handler) {
    handler = new userHandler(lang)
    userHandlers.set(id, handler)
  }
  return handler
}
