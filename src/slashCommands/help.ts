import { ApplicationCommandData, BaseCommandInteraction, GuildMember, MessageActionRow, MessageButton } from 'discord.js'
import { helpHandler } from '../commandsHandler/helpHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand extends Command {
	commandData: ApplicationCommandData

	constructor() {
		super()
		this.commandData = {
			name: 'help',
			description: 'test help 2'
		}
	}

	async execute(interaction: BaseCommandInteraction, lang: Lang) {
		const embed = new helpHandler(interaction.member as GuildMember, lang).createEmbed()
		const row = new MessageActionRow()
			.addComponents(new MessageButton({
				label: lang.help.labels.adminCommands,
				customId: 'helpAdminCommand',
				style: "DANGER"
			})
			)
		await interaction.reply({
			embeds: [embed],
			components: [row]
		})
	}
}
