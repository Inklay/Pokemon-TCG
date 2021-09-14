import { ApplicationCommandData, ButtonInteraction, CommandInteraction, Message, MessageActionRow } from "discord.js";
import { getUserHandler, UserHandlerMode } from "../commandsHandler/userHandler";
import { Command } from "./Command";
import { InteractionReply } from "./InteractionReply";
import { Lang } from "./Lang";

export abstract class CardsCommand implements Command {
  abstract commandData: ApplicationCommandData
  abstract execute(interaction: CommandInteraction, lang: Lang) : void
  protected abstract mode: UserHandlerMode

  async handleButtons(interaction: ButtonInteraction, lang: Lang) : Promise<void> {
		if (interaction.user.id != interaction.message.interaction?.user.id) {
			await interaction.reply({
				content: `${lang.global.doNotHavePermission}`,
				ephemeral: true
			})
			return
		}
    const handler = getUserHandler(lang, interaction.user.id, this.mode)
    let reply: InteractionReply
		switch (interaction.customId) {
			case 'serieNext':
				handler.incSerieIdx()
				reply = handler.drawSerie()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'seriePrev':
				handler.decSerieIdx()
				reply = handler.drawSerie()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'serieBack':
				(interaction.message as Message).delete()
				return
			case 'serieSelect': 
				reply = handler.drawExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionNext': 
				handler.incExpansionIdx()
				reply = handler.drawExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionPrev': 
				handler.decExpansionIdx()
				reply = handler.drawExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionBack':
				reply = handler.drawSerie()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionSelect':
				reply = handler.openBooster()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
      case 'expansionViewSelect':
				reply = handler.view()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionSetFav':
				reply = handler.setFavouriteExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionUnsetFav':
				reply = handler.unsetFavouriteExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'expansionView':
				handler.setMode('VIEWING')
				reply = handler.view()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				handler.setMode(this.mode)
				return
			case 'expansionSell':
				reply = handler.sellFromExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'cardNext':
				handler.incCardIdx()
				reply = handler.drawCard()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'cardPrev':
				handler.decCardIdx()
				reply = handler.drawCard()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
			case 'cardBack':
				reply = handler.drawExpansion()
				await interaction.update({
					embeds: [reply.embed],
					components: reply.hasButton() ? reply.buttons : undefined,
				})
				return
		}
  }
}
