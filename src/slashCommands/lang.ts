import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { list, set } from '../commandsHandler/langHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand implements Command {
	commandData: ApplicationCommandData

	constructor() {
		this.commandData = {
			name: 'language_set',
			description: 'Change the language of the bot for this server',
			options: [{
				name: 'language',
				description: 'the language to use for this server',
				type: 3,
				required: true,
				choices: [{
					name: 'english',
					value: 'en'
				}, {
					name: 'français',
					value: 'fr'
				}]
			}]
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = set(lang, interaction.member as GuildMember, interaction.options.getString('language') as string, interaction.inGuild() ? interaction.guildId : interaction.user.id, interaction.inGuild() ? 'guild' : 'user')
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? reply.buttons : undefined,
			ephemeral: true
		})
	}

  async handleButtons(_: ButtonInteraction, __: Lang) {
		return
	}
}
