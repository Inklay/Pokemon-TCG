import { ApplicationCommandData, ButtonInteraction, CommandInteraction } from "discord.js";
import { Lang } from '../structure/Lang'

export interface Command {
  commandData: ApplicationCommandData
  execute(interaction: CommandInteraction, lang: Lang) : void
  handleButtons(interaction: ButtonInteraction, lang: Lang) : void
}