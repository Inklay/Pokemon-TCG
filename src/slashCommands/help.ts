import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { basicHelp, adminHelp } from '../commandsHandler/helpHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand implements Command {
	commandData: ApplicationCommandData

	constructor() {
		this.commandData = {
			name: 'help',
			description: 'Prints a message with all the command and their usage in the server\'s configured language'
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = basicHelp(lang, interaction.member as GuildMember)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
			ephemeral: true
		})
	}

	async handleButtons(interaction: ButtonInteraction, lang: Lang) {
		switch (interaction.customId) {
			case 'adminHelp': {
				const reply = adminHelp(lang)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined
				})
				return
			}
			case 'basicHelp': {
				const reply = basicHelp(lang, interaction.member as GuildMember)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined
				})
				return
			}
		}
	}
}
