import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'
import { drawSerie, nextSerie, prevSerie } from '../commandsHandler/buyHandler'

export class slahCommand implements Command {
	commandData: ApplicationCommandData

	constructor() {
		this.commandData = {
			name: 'buy',
			description: 'Buy cards from the desired expansion'
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = drawSerie(lang, interaction.user.id)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined
		})
	}

	async handleButtons(interaction: ButtonInteraction, lang: Lang) {
		switch (interaction.customId) {
			case 'serieNext': {
				const reply = nextSerie(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined
				})
				return
			}
			case 'seriePrev': {
				const reply = prevSerie(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined
				})
				return
			}
		}
	}
}
