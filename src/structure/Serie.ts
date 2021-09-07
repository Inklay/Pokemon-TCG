import { MessageButton, MessageEmbed } from 'discord.js'
import { Expansion } from './Expansion'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'
import { userHandlerMode } from '../commandsHandler/userHandler'

export class Serie {
  name = ""
  id = ""

  draw(expansions: Expansion[], idx: number, lang: Lang, mode : userHandlerMode, max: number) : InteractionReply {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx, max, mode, lang)
    embed.setTitle(this.name)
    let description = ''
    expansions.forEach(e => {
      description += `• ${e.name}\n`
    })
    embed.description = description
    embed.setAuthor(lang.serie.selectSerie)
    embed.setFooter(`${idx + 1}/${max + 1}`)
    return new InteractionReply(embed, buttons)
  }

  private createButton(idx: number, max: number, mode: userHandlerMode, lang: Lang) : MessageButton[] {
    const buttons : MessageButton[] = []
    if (idx != 0) {
      buttons.push(new MessageButton({
        customId: 'seriePrev',
        style: "PRIMARY",
        emoji: '⬅️'
      }))
    }
    if (idx != max) {
      buttons.push(new MessageButton({
        customId: 'serieNext',
        style: "PRIMARY",
        emoji: '➡️'
      }))
    }
    if (mode == userHandlerMode.BUYING) {
      buttons.push(new MessageButton({
        label: lang.serie.embed.select,
        customId: 'serieSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'serieBack',
      style: "DANGER",
      emoji: '❌'
    }))
    return buttons
  }
}
