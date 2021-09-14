import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow, Message, GuildManager, GuildMember } from 'discord.js'
import { Lang } from '../structure/Lang'
import { getUserHandler, UserHandler, UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../structure/CardsCommand'

export class slahCommand extends CardsCommand {
	public commandData: ApplicationCommandData
	protected mode: UserHandlerMode = 'VIEWING'

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

	async execute(interaction: CommandInteraction, lang: Lang) {
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
		})
	}
}
