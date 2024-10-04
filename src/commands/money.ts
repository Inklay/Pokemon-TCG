import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../class/Command'
import { Lang } from '../class/Lang'
import { User } from '../class/User'

export class slahCommand implements Command {
	data: SlashCommandBuilder

	constructor() {
		this.data = new SlashCommandBuilder()
			.setName('money')
      .setNameLocalizations({
        fr: 'argent'
      })
			.setDescription('Gives you $10 once every hour')
      .setDescriptionLocalizations({
        fr: 'Vous donne 10$ une fois par heure'
      })
	}

	async execute(interaction: ChatInputCommandInteraction, lang: Lang, user: User) {
    let embed = new EmbedBuilder()
      .setColor('#3679f5')
      .setTitle(lang.money.yourMoney)
  
		if (user.addHourlyMoney()) {
      embed.setDescription(`${lang.money.gotMoney}\n${lang.global.youHave} : $${user.money}`)
    } else {
      embed.setDescription(`${lang.money.youHaveToWait} ${Math.floor((user.date + 60 * 60 * 1000 - Date.now()) / 1000 / 60)} ${lang.money.minutes}\n${lang.global.youHave} : $${user.money}`)
    }

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		})
	}

  async handleButtons(_: ButtonInteraction, __: Lang) {
		return
	}
}
