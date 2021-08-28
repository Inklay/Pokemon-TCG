import { MessageButton, MessageEmbed } from "discord.js";

export class InteractionReply {
  embed: MessageEmbed
  buttons: MessageButton[]

  constructor(embed: MessageEmbed, buttons: MessageButton[]) {
    this.embed = embed
    this.buttons = buttons
  }
}