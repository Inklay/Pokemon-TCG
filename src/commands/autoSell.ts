import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../class/Command'
import { Lang } from '../class/Lang'
import { User } from '../class/User'

export class slahCommand implements Command {
	data: SlashCommandBuilder

	constructor() {
		this.data = new SlashCommandBuilder()
			.setName('auto-sell')
      .setNameLocalizations({
        fr: 'vente-auto'
      })
			.setDescription('Automaticly sells your duplicate cards when opening a booster')
      .setDescriptionLocalizations({
        fr: 'Vend automatiquement les doublons en ouvrant des booster'
      })

    this.data.addBooleanOption(option => option
      .setRequired(true)
      .setName('value')
      .setNameLocalizations({
        fr: 'valeur'
      })
      .setDescription('Whether or not cards will be automaticly sold')
      .setDescriptionLocalizations({
        fr: 'Est-ce que les doublons seront vendus automatiquement'
      })
    )
	}

	async execute(interaction: ChatInputCommandInteraction, lang: Lang, user: User) {
    user.setAutosell(interaction.options.get('value')?.value as boolean)

    let embed = new EmbedBuilder()
      .setColor('#3679f5')
      .setTitle(lang.user.settingsUpdated)
      .setDescription(lang.user.autoSellSet)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		})
	}

  async handleButtons(_: ButtonInteraction, __: Lang) {
		return
	}
}
