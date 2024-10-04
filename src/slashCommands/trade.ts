import { ApplicationCommandData, CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { Lang } from '../class/Lang'
import { getUserHandler, UserHandler, UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../class/CardsCommand'
import { TradeHandler } from '../commandsHandler/tradeHandler'

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
			name: 'trade',
			description: 'Trade one of your cards for another and/or money',
      options: [{
        required: true,
        name: 'user',
        description: 'The user you want to trade with',
        type: 6
      }]
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
    const member: GuildMember | null = interaction.options.getMember('user') as GuildMember | null
		const reply = await new TradeHandler(interaction.user.id, member!.id, lang, interaction).notifyTarget(interaction.channel as TextChannel, member!.user, interaction.member!.user.username)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
      ephemeral: true
		})
	}
}
