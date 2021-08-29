import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { addMoney } from '../commandsHandler/moneyHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand extends Command {
	commandData: ApplicationCommandData

	constructor() {
		super()
		this.commandData = {
			name: 'money',
			description: 'Gives you 10$ every hour'
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = addMoney(lang, interaction.user.id)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
			ephemeral: true
		})
	}

	async handleButtons(_: ButtonInteraction, __: Lang) {
	}
}
