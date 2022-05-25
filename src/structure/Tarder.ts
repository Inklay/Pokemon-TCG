import { CommandInteraction } from "discord.js";
import { getUserHandler, UserHandler } from "../commandsHandler/userHandler";
import { Lang } from "./Lang";

export class Trader {
  public user: UserHandler | undefined
  public card: string 
  public id: string
  public confirmed: boolean
  public interaction: CommandInteraction | undefined

  constructor(userId: string, lang: Lang, interaction: CommandInteraction | undefined = undefined) {
    this.id = userId
    this.card = ''
    this.confirmed = false
    this.interaction = interaction
    if (interaction !== undefined)
      this.user = getUserHandler(lang, userId, 'TRADING')
  }
}