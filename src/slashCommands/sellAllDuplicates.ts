import { ApplicationCommandData, ButtonInteraction, CommandInteraction, MessageActionRow } from "discord.js"
import { getUserHandler, UserHandler } from "../commandsHandler/userHandler"
import { Command } from "../structure/Command"
import { InteractionReply } from "../structure/InteractionReply"
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
    const handler: UserHandler = getUserHandler(lang, interaction.user.id, 'OTHER')
    const reply: InteractionReply = handler.sellAllDuplicates()
      await interaction.reply({
        embeds: [reply.embed],
        components: reply.hasButton() ? reply.buttons : undefined,
        ephemeral: true
      })
      return
  }

  handleButtons(_: ButtonInteraction, __: Lang): void {}
}
