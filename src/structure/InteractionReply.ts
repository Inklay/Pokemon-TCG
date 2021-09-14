import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export class InteractionReply {
  embed: MessageEmbed
  buttons: MessageActionRow[]

  constructor(embed: MessageEmbed, buttons: MessageButton[]) {
    this.embed = embed
    this.buttons = []
    let j: number = -1
    for (let i: number = 0; i < buttons.length; i++) {
      if (i % 5 == 0) {
        this.buttons.push(new MessageActionRow())
        j++
      }
      this.buttons[j].addComponents(buttons[i])
    }
  }

  hasButton() : boolean {
    return this.buttons.length > 0
  }
}
