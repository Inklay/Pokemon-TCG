import { ApplicationCommandData, ButtonInteraction, CommandInteraction } from 'discord.js'
import { TradeHandler } from '../commandsHandler/tradeHandler'
import { UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../class/CardsCommand'
import { InteractionReply } from '../class/InteractionReply'
import { Lang } from '../class/Lang'

/**
 * @class slashCommand
 * @extends CardsCommand
 * 
 * A slash command
 * 
 * @public @property {ApplicationCommandData} commandData - The data to send to the Discord API
 * @protected @property {UserHandlerMode} mode - The mode of the UserHandler
 */
export class slahCommand extends CardsCommand {
	public commandData: ApplicationCommandData
  protected mode: UserHandlerMode = 'TRADING' 

  /**
   * @constructor
   */
	constructor() {
    super()
		this.commandData = {
			name: 'trade_accept',
			description: 'Accept the trade invitation if any'
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
    let reply: InteractionReply = TradeHandler.acceptTrade(interaction.user.id, interaction, lang)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
			ephemeral: true
		})
	}
}
