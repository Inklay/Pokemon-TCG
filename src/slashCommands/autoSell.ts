import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow } from "discord.js"
import { setAutoSell } from "../commandsHandler/userHandler"
import { Command } from "../structure/Command"
import { Lang } from "../structure/Lang"

export class slahCommand implements Command {
	commandData: ApplicationCommandData

  constructor() {
		this.commandData = {
			name: 'auto_sell',
      description: 'Toggle the automatic sell of your duplicate cards',
      options: [{
        type: 3,
        name: 'value',
        description: 'The value of the automatic sell',
        required: true,
        choices: [{
          'value': 'true',
          'name': 'Yes'
        }, {
          'value': 'false',
          'name': 'No'
        }]
      }]
    }
  }

  async execute(interaction: CommandInteraction, lang: Lang): Promise<void> {
    switch (interaction.options.getString('value')) {
      case 'true': {
        const reply = setAutoSell(interaction.user.id, true, lang)
				await interaction.reply({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
					ephemeral: true
				})
				return
      }
      case 'false': {
        const reply = setAutoSell(interaction.user.id, false, lang)
				await interaction.reply({
					embeds: [reply.embed],
					components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
					ephemeral: true
				})
        return
      }
    }
  }

  handleButtons(_: ButtonInteraction, __: Lang): void {}
}
