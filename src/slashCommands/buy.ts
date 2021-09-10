import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow, Message } from 'discord.js'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'
import { drawExpansion, drawSerie, nextCard, nextExpansion, nextSerie, openBooster, prevCard, prevExpansion, prevSerie } from '../commandsHandler/buyHandler'

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
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
		})
	}

	async handleButtons(interaction: ButtonInteraction, lang: Lang) {
		switch (interaction.customId) {
			case 'serieNext': {
				const reply = nextSerie(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'seriePrev': {
				const reply = prevSerie(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'serieBack': {
				(interaction.message as Message).delete()
				return
			}
			case 'serieSelect': {
				const reply = drawExpansion(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'expansionNext': {
				const reply = nextExpansion(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'expansionPrev': {
				const reply = prevExpansion(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'expansionBack': {
				const reply = drawSerie(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'expansionSelect': {
				const reply = openBooster(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'cardNext': {
				const reply = nextCard(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'cardPrev': {
				const reply = prevCard(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
			case 'cardBack': {
				const reply = drawExpansion(lang, interaction.user.id)
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)] : undefined
				})
				return
			}
		}
	}
}
