import { ApplicationCommandData, CommandInteraction, GuildMember } from 'discord.js'
import { Lang } from '../class/Lang'
import { getUserHandler, UserHandler, UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../class/CardsCommand'

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
	protected mode: UserHandlerMode = 'VIEWING'

	/**
	 * @constructor
	 */
	constructor() {
		super()
		this.commandData = {
			name: 'view',
			description: 'View your or your friend\'s cards',
      options: [{
        required: false,
        name: 'user',
        description: 'The user you whose you want to see it\'s collection',
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
    let handler: UserHandler
    const member: GuildMember | null = interaction.options.getMember('user') as GuildMember | null
    if (member != null) {
      handler = getUserHandler(lang, interaction.user.id, 'VIEWING', member.user.id, member.nickname ? member.nickname : member.user.username)
    } else {
      handler = getUserHandler(lang, interaction.user.id, 'VIEWING')
    }
		const reply = handler.drawSerie()
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
			ephemeral: true
		})
	}
}
