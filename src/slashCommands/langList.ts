import { ApplicationCommandData, ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js'
import { list } from '../commandsHandler/langHandler'
import { Command } from '../structure/Command'
import { Lang } from '../structure/Lang'

export class slahCommand extends Command {
	commandData: ApplicationCommandData

	constructor() {
		super()
		this.commandData = {
			name: 'language',
			description: 'Prints the currently supported language',
      options: [{
        name: 'list',
        description: 'Prints the currently supported language',
        type: 1
      }]
		}
	}

	async execute(interaction: CommandInteraction, lang: Lang) {
		const reply = list(lang, interaction.member as GuildMember)
		await interaction.reply({
			embeds: [reply.embed],
			components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
			ephemeral: true
		})
	}

  async handleButtons(interaction: ButtonInteraction, lang: Lang) {
		/*switch (interaction.customId) {
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
		}*/
	}
}
