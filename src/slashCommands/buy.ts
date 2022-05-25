import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow, Message } from 'discord.js'
import { Lang } from '../structure/Lang'
import { getUserHandler, UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../structure/CardsCommand'

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
	protected mode: UserHandlerMode = 'BUYING'

	/**
	 * @constructor
	 */
	constructor() {
		super()
		this.commandData = {
			name: 'buy',
			description: 'Buy cards from the desired expansion'
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
	async execute(interaction: CommandInteraction, lang: Lang) : Promise<void> {
		const handler = getUserHandler(lang, interaction.user.id, 'BUYING')
		const reply = handler.drawSerie(true)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
			ephemeral: true
		})
	}
}
