import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { basicHelp, adminHelp } from '../commandsHandler/helpHandler'
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

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = basicHelp(lang, interaction.member as GuildMember)
		const row = new MessageActionRow().addComponents(reply.buttons)
		await interaction.reply({
			embeds: [reply.embed],
			components: [row]
		})
	}

	async handleButtons(interaction: ButtonInteraction, lang: Lang) {
		switch (interaction.customId) {
			case 'adminHelp': {
				const reply = adminHelp(lang)
				const row = new MessageActionRow().addComponents(reply.buttons)
				await interaction.update({
					embeds: [reply.embed],
					components: [row]
				})
				return
			}
			case 'basicHelp': {
				const reply = basicHelp(lang, interaction.member as GuildMember)
				const row = new MessageActionRow().addComponents(reply.buttons)
				await interaction.update({
					embeds: [reply.embed],
					components: [row]
				})
				return
			}
		}
	}
}
