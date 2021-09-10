import { MessageButton, MessageEmbed } from "discord.js"
import { UserHandlerMode } from "../commandsHandler/userHandler"
import { InteractionReply } from "./InteractionReply"
import { Lang } from "./Lang"

export class Expansion {
  name: string = ''
  price: number = 0
  id: string = ''
  image: string = ''
  cardsBaseImage: string = ''
  infoBaseUrl: string = ''
  released: Boolean = false
  fixNumber: Boolean = true
  common: number[] = []
  uncommon: number[] = []
  rare: number[] = []
  special: number[] = []
  ultraRare: number[] = []
  size: number = 0
  canGetSecret: Boolean = false
  secret: number[] = []

  draw(idx: number, lang: Lang, mode : UserHandlerMode, max: number) {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx, max, mode, lang)
    embed.setTitle(this.name)
    embed.setFooter(`${idx + 1}/${max + 1}`)
    embed.setAuthor(lang.expansion.selectExpansion)
    if (mode == 'BUYING') {
      embed.setImage(this.image)
    }
    return new InteractionReply(embed, buttons)  
  }

  private createButton(idx: number, max: number, mode: UserHandlerMode, lang: Lang) : MessageButton[] {
    const buttons : MessageButton[] = []
    if (idx != 0) {
      buttons.push(new MessageButton({
        customId: 'expansionPrev',
        style: "PRIMARY",
        emoji: '⬅️'
      }))
    }
    if (idx != max) {
      buttons.push(new MessageButton({
        customId: 'expansionNext',
        style: "PRIMARY",
        emoji: '➡️'
      }))
    }
    if (mode == 'BUYING') {
      buttons.push(new MessageButton({
        label: lang.expansion.select,
        customId: 'expansionSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'expansionBack',
      style: "DANGER",
      emoji: '❌'
    }))
    return buttons
  }
}