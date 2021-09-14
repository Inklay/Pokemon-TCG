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
        type: 5,
        name: 'value',
        description: 'The value of the automatic sell',
        required: true,
      }]
    }
  }

  async execute(interaction: CommandInteraction, lang: Lang): Promise<void> {
    const reply = setAutoSell(interaction.user.id, interaction.options.getBoolean('value', true), lang)
    await interaction.reply({
      embeds: [reply.embed],
      components: reply.hasButton() ? reply.buttons : undefined,
      ephemeral: true
    })
  }

  handleButtons(_: ButtonInteraction, __: Lang): void {}
}
