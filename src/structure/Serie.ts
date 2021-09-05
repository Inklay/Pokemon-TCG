import { MessageButton, MessageEmbed } from 'discord.js'
import { Expansion } from './Expansion'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'
import { serieMax, serieMin } from '../commandsHandler/UserHandler'

export class Serie {
  name = ""
  id = ""

  draw(expansions: Expansion[], idx: number, lang: Lang) : InteractionReply {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = []
    embed.setTitle(this.name)
    let description = ''
    expansions.forEach(e => {
      description += `• ${e.name}\n`
    })
    embed.setDescription(description)
    embed.setAuthor(lang.serie.selectSerie)
    embed.setFooter(`${idx + 1}/${serieMax + 1}`)
    if (!this.isFirst(idx)) {
      buttons.push(new MessageButton({
        label: lang.serie.embed.previous,
        customId: 'seriePrev',
        style: "PRIMARY"
      }))
    }
    if (!this.isLast(idx)) {
      buttons.push(new MessageButton({
        label: lang.serie.embed.next,
        customId: 'serieNext',
        style: "PRIMARY"
      }))
    }
    return new InteractionReply(embed, buttons)
  }

  private isFirst(idx: number): Boolean {
    return idx == serieMin
  }

  private isLast(idx: number): Boolean {
    return idx == serieMax
  }
}
