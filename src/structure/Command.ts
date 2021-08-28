import { ApplicationCommandData, BaseCommandInteraction } from "discord.js";
import { Lang } from '../structure/Lang'

export abstract class Command {
  abstract commandData: ApplicationCommandData
  abstract execute(interaction: BaseCommandInteraction, lang: Lang) : void
}