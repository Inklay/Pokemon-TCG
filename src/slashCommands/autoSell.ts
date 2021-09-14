import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow } from "discord.js"
import { getUserHandler } from "../commandsHandler/userHandler"
import { Command } from "../structure/Command"
import { Lang } from "../structure/Lang"

export class slahCommand implements Command {
	commandData: ApplicationCommandData

  constructor() {
		this.commandData = {
			name: 'auto_sell',
      description: 'Toggle the automatic sell of your duplicate cards',
      options: [{
        type: 5,
        name: 'value',
        description: 'The value of the automatic sell',
        required: true,
      }]
    }
  }

  async execute(interaction: CommandInteraction, lang: Lang): Promise<void> {
    const handler = getUserHandler(lang, interaction.user.id, 'OTHER')
    const reply = handler.setAutoSell(interaction.options.getBoolean('value', true))
    await interaction.reply({
      embeds: [reply.embed],
      components: reply.hasButton() ? reply.buttons : undefined,
      ephemeral: true
    })
  }

  handleButtons(_: ButtonInteraction, __: Lang): void {}
}
