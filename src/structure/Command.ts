import { ApplicationCommandData, ButtonInteraction, CommandInteraction } from "discord.js";
import { Lang } from '../structure/Lang'

export abstract class Command {
  abstract commandData: ApplicationCommandData
  abstract execute(interaction: CommandInteraction, lang: Lang) : void
  abstract handleButtons(interaction: ButtonInteraction, lang: Lang) : void
}