import { Expansion } from './Expansion'
import fs from 'fs'
import path from 'path'
import { InteractionReply } from './InteractionReply'
import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { Lang } from './Lang'
import { CardViewerMode } from './CardViewer'
import { LocalizedString } from './LocalizedString'

export const series: Serie[] = []

export class Serie {
  name: LocalizedString
  id: string
  expansions: Expansion[]

  constructor(name: LocalizedString, id: string) {
    this.name = name
    this.id = id
    this.expansions = Expansion.load(id)
  }

  public static load() {
    const filePath = path.join(__dirname, '../../cards/series.json')
    const rawData = fs.readFileSync(filePath).toString()
    const data = JSON.parse(rawData) as Serie[]
    data.forEach(serie => {
      series.push(new Serie(serie.name, serie.id))
    })
  }

  public draw(lang: Lang, idx: number, max: number, mode: CardViewerMode) : InteractionReply {
    const buttons = this.createButton(lang, idx, max, mode)
    const embed = new EmbedBuilder()
      .setTitle(this.name[lang.global.dir])
      .setAuthor({name: lang.serie.selectSerie})
      .setFooter({text: `${idx + 1}/${max}`})

    let description = ''
    this.expansions.forEach(e => {
      description += `• ${e.name[lang.global.dir]}\n`
    })
    embed.setDescription(description)
    return new InteractionReply(embed, buttons)
  }

  private createButton(lang: Lang, idx: number, max: number, mode: CardViewerMode) : ButtonBuilder[] { 
    const buttons : ButtonBuilder[] = []

    buttons.push(new ButtonBuilder()
      .setCustomId('seriePrev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(idx == 0)
    )

    buttons.push(new ButtonBuilder()
      .setCustomId('serieNext')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(idx + 1 == max)
    )

    if (this.expansions.length > 0) {
      buttons.push(new ButtonBuilder()
        .setLabel(lang.serie.select)
        .setCustomId('serieSelect')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✔️')
      )
    }

    if (mode === 'TRADING') {
      buttons.push(new ButtonBuilder()
        .setLabel(lang.global.back)
        .setCustomId('tradeCancel')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('❌')
      )
    }

    return buttons
  }
}
