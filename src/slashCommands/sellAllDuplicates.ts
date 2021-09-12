import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow } from "discord.js"
import { sellAllDuplicates } from "../commandsHandler/userHandler"
import { Command } from "../structure/Command"
import { Lang } from "../structure/Lang"

export class slahCommand implements Command {
	commandData: ApplicationCommandData

  constructor() {
		this.commandData = {
			name: 'sell_all_duplicates',
      description: 'Sell all your duplicate cards'
    }
  }

  async execute(interaction: CommandInteraction, lang: Lang): Promise<void> {
    const reply = sellAllDuplicates(interaction.user.id, lang)
      await interaction.reply({
        embeds: [reply.embed],
        components: reply.hasButton() ? [new MessageActionRow().addComponents(reply.buttons)]: undefined,
        ephemeral: true
      })
      return
  }

  handleButtons(_: ButtonInteraction, __: Lang): void {}
}
