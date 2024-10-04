import { ButtonInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../class/Command'
import { Lang } from '../class/Lang'
import { User } from '../class/User'
import { CardViewer } from '../class/CardViewer'
import { InteractionReply } from '../class/InteractionReply'

export class slahCommand implements Command {
	data: SlashCommandBuilder

	constructor() {
		this.data = new SlashCommandBuilder()
			.setName('buy')
      .setNameLocalizations({
        fr: 'acheter'
      })
			.setDescription('Buy cards from the desired expansion')
      .setDescriptionLocalizations({
        fr: 'Acheter des cartes de l\'extension voulue'
      })
	}

	async execute(interaction: ChatInputCommandInteraction, lang: Lang, user: User) {
    const reply = CardViewer.get(user).drawSerie(lang)

		await interaction.reply({
			embeds: [reply.embed],
			components: reply.buttons,
			ephemeral: true
		})
	}

  async handleButtons(interaction: ButtonInteraction, lang: Lang, user: User) {
		let reply: InteractionReply
		const cardViewer = CardViewer.get(user)
		
		switch (interaction.customId) {
			case 'seriePrev':
				reply = cardViewer.prevSerie(lang)
				break
			case 'serieNext':
				reply = cardViewer.nextSerie(lang)
				break
			case 'serieSelect':
				reply = cardViewer.drawExpansion(lang)
				break
			case 'expansionPrev':
				reply = cardViewer.prevExpansion(lang)
				break
			case 'expansionNext':
				reply = cardViewer.nextExpansion(lang)
				break
			case 'expansionSelect':
				reply = cardViewer.selectExpansion(lang)
				break
			// case 'expansionViewSelect':
			// 	reply = cardViewer.selectSerie(lang)
			// 	break
			// case 'expansionTradeSelect':
			// 	reply = cardViewer.selectSerie(lang)
			// 	break
			case 'expansionBack':
				reply = cardViewer.backExpansion(lang)
				break
			case 'expansionUnsetFav':
				reply = cardViewer.unfavExpansion(lang)
				break
			case 'expansionSetFav':
				reply = cardViewer.favExpansion(lang)
				break
			case 'expansionView':
				reply = cardViewer.viewExpansion(lang)
				break
			case 'expansionSell':
				reply = cardViewer.sellExpansion(lang)
				break
		}

		await interaction.update({
			embeds: [reply!.embed],
			components: reply!.buttons
		})
	}
}
