import { ApplicationCommandData, ButtonInteraction, CommandInteraction } from 'discord.js'
import { TradeHandler } from '../commandsHandler/tradeHandler'
import { UserHandlerMode } from '../commandsHandler/userHandler'
import { Command } from '../class/Command'
import { InteractionReply } from '../class/InteractionReply'
import { Lang } from '../class/Lang'

/**
 * @class slashCommand
 * @implements Command
 * 
 * A slash command
 * 
 * @public @property {ApplicationCommandData} commandData - The data to send to the Discord API
 * @protected @property {UserHandlerMode} mode - The mode of the UserHandler
 */
export class slahCommand implements Command {
	public commandData: ApplicationCommandData
  protected mode: UserHandlerMode = 'TRADING' 

  /**
   * @constructor
   */
	constructor() {
		this.commandData = {
			name: 'trade_deny',
			description: 'Deny the trade invitation if any'
		}
	}

  /**
   * @public @async @method
   * 
   * Executes the command itself
   * 
   * @param {CommandInteraction} interaction - The user interaction
   * @param {Lang} lang - The lang of the server 
   * @returns {Promise<void>}
   */
	public async execute(interaction: CommandInteraction, lang: Lang) : Promise<void> {
    let reply: InteractionReply = TradeHandler.denyTrade(interaction.user.id, lang)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
			ephemeral: true
		})
	}

  /**
   * @public @method
   * 
   * Not used on this class
   * 
   * @returns {void}
   */
  public handleButtons(_: ButtonInteraction, __: Lang): void {}
}
