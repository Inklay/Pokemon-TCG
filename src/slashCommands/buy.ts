import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow, Message } from 'discord.js'
import { Lang } from '../structure/Lang'
import { getUserHandler, UserHandlerMode } from '../commandsHandler/userHandler'
import { CardsCommand } from '../structure/CardsCommand'

export class slahCommand extends CardsCommand {
	public commandData: ApplicationCommandData
	protected mode: UserHandlerMode = 'BUYING'

	constructor() {
		super()
		this.commandData = {
			name: 'buy',
			description: 'Buy cards from the desired expansion'
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const handler = getUserHandler(lang, interaction.user.id, 'BUYING')
		const reply = handler.drawSerie(true)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
		})
	}
}
