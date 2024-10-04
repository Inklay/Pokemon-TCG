import { SlashCommandBuilder, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js'
import { Lang } from './Lang'
import { User } from './User'

export interface Command {
  data: SlashCommandBuilder
  execute(interaction: ChatInputCommandInteraction, lang: Lang, user: User) : void
  handleButtons(interaction: ButtonInteraction, lang: Lang, user: User) : void
}
