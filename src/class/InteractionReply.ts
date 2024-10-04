import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js'

export class InteractionReply {
  embed: EmbedBuilder
  buttons: ActionRowBuilder<ButtonBuilder>[]

  constructor(embed: EmbedBuilder, buttons: ButtonBuilder[]) {
    this.embed = embed
    this.buttons = []
    let j: number = -1
    for (let i: number = 0; i < buttons.length; i++) {
      if (i % 5 == 0) {
        this.buttons.push(new ActionRowBuilder())
        j++
      }
      this.buttons[j].addComponents(buttons[i])
    }
  }

  hasButton() : boolean {
    return this.buttons.length > 0
  }
}
