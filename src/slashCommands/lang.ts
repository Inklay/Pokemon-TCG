import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { list, set } from '../commandsHandler/langHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand implements Command {
	commandData: ApplicationCommandData

	constructor() {
		this.commandData = {
			name: 'language',
			description: 'Manage the language of the server',
      options: [{
        name: 'list',
        description: 'Prints the currently supported language',
        type: 1
      }, {
				name: 'set',
				description: 'Change the language of the bot for this server',
				type: 1,
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
			}]
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		switch (interaction.options.getSubcommand()) {
			case 'list': {
				const reply = list(lang, interaction.member as GuildMember)
				await interaction.reply({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
					ephemeral: true
				})
				return
			}
			case 'set': {
				const reply = set(lang, interaction.member as GuildMember, interaction.options.getString('language') as string, interaction.inGuild() ? interaction.guildId : interaction.user.id, interaction.inGuild() ? 'guild' : 'user')
				await interaction.reply({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
					ephemeral: true
				})
				return
			}
		}
	}

  async handleButtons(_: ButtonInteraction, __: Lang) {
		return
	}
}
