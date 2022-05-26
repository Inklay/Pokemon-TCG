import { CommandInteraction, Message, MessageButton, MessageEmbed, TextChannel, User } from "discord.js"
import { InteractionReply } from "../structure/InteractionReply"
import { Lang } from "../structure/Lang"
import { getUserHandler } from "./userHandler"
import { Trader } from "../structure/Tarder"

export class TradeHandler {
  private issuer: Trader
  private target: Trader
  private lang: Lang
  private inviteMessage: Message | undefined
  
  constructor(issuerId: string, targetId: string, lang: Lang, interaction: CommandInteraction) {
    this.lang = lang
    this.issuer = new Trader(issuerId, lang, interaction)
    this.target = new Trader(targetId, lang)
  }

  public deleteInvite() : void {
    if (this.inviteMessage != undefined) {
      this.inviteMessage.delete()
      this.inviteMessage = undefined
    }
  }

  public async notifyTarget(channel: TextChannel, target: User, issuerNickname: string) : Promise<InteractionReply> {
    const embed: MessageEmbed = new MessageEmbed()
    const buttons: MessageButton[] = []
    if (this.issuer.id == this.target.id) {
      embed.setTitle(this.lang.global.error)
      embed.setDescription(this.lang.trade.cantTradeWithYourself)
    } else if (TradeHandler.get(this.issuer.id) != undefined) {
      embed.setTitle(this.lang.trade.alreadyInTrade)
      embed.setDescription(this.lang.trade.youAreAlreadyInTrade)
    } else if (TradeHandler.get(this.target.id) != undefined) {
      embed.setTitle(this.lang.trade.alreadyInTrade)
      embed.setDescription(`${target.username} ${this.lang.trade.isAlreadyInTrade}`)
    } else {
      embed.setTitle(this.lang.trade.inviteSend)
      embed.setDescription(`${this.lang.trade.waitingForAnswer}`)
      buttons.push(new MessageButton({
        label: this.lang.global.cancel,
        customId: 'tradeCancel',
        style: 'DANGER',
        emoji: '❌'
      }))
      tradeHandlers.push(this)
      const invite: MessageEmbed = new MessageEmbed()
      invite.setTitle(this.lang.trade.tradeInvite)
      invite.setDescription(`${issuerNickname} ${this.lang.trade.invitedYou}`)
      this.inviteMessage = await channel.send({
        embeds: [invite],
        content: target.toString()
      })
    }
    return new InteractionReply(embed, buttons)
  }

  public setTargetInteraction(interaction: CommandInteraction) : void {
    this.target.interaction = interaction
  }

  public deny() : InteractionReply {
    this.deleteInvite()
    tradeHandlers.splice(TradeHandler.getId(this.issuer.id)!, 1)
    const embed: MessageEmbed = new MessageEmbed()
    embed.setTitle(this.lang.trade.denied)
    embed.setDescription(this.lang.trade.wasDenied)
    const reply: InteractionReply = new InteractionReply(embed, [])
    this.updateInteraction(reply, this.issuer.interaction)
    return reply
  }

  public updateInteraction(reply: InteractionReply, interaction: CommandInteraction | undefined, deleteComponents: boolean = false) : void {
    if (interaction != undefined) {
      interaction.editReply({
        embeds: [reply.embed],
        components: deleteComponents ? [] : reply.hasButton() ? reply.buttons : undefined,
      })
    }
  }

  public accept(interaction: CommandInteraction) : InteractionReply {
    this.deleteInvite()
    this.setTargetInteraction(interaction)
    this.target.user = getUserHandler(this.lang, this.target.id, 'TRADING')
    this.updateInteraction((this.issuer.user)!.drawSerie(), this.issuer.interaction)
    return this.target.user.drawSerie()
  }

  public cancel(id: string) : InteractionReply {
    this.deleteInvite()
    tradeHandlers.splice(TradeHandler.getId(this.issuer.id)!, 1)
    if (id == this.issuer.id)
      this.updateInteraction(this.tradeCanceled(), this.target.interaction, true)
    else
      this.updateInteraction(this.tradeCanceled(), this.issuer.interaction, true)
    return this.tradeCanceled()
  }

  public static acceptTrade(id: string, interaction: CommandInteraction, lang: Lang) : InteractionReply {
    const handler: TradeHandler | undefined = TradeHandler.get(id)
    if (handler == undefined)
      return TradeHandler.notInTrade(lang)
    return handler.accept(interaction)
  }

  public static denyTrade(id: string, lang: Lang) : InteractionReply {
    const handler: TradeHandler | undefined = TradeHandler.get(id)
    if (handler == undefined)
      return TradeHandler.notInTrade(lang)
    return handler.deny()
  }

  private tradeCanceled() : InteractionReply {
    const embed: MessageEmbed = new MessageEmbed()
    embed.setTitle(this.lang.trade.canceled)
    embed.setDescription(this.lang.trade.wasCanceled)
    return new InteractionReply(embed, [])
  } 

  public static notInTrade(lang: Lang) : InteractionReply {
    const embed: MessageEmbed = new MessageEmbed()
    embed.setTitle(lang.global.error)
    embed.setDescription(lang.trade.notInTrade)
    return new InteractionReply(embed, [])
  }
  
  public static get(id: string) : TradeHandler | undefined {
    return tradeHandlers.find(t => t.issuer.id == id || t.target.id == id)
  }

  public static getId(id: string) : number | undefined {
    return tradeHandlers.findIndex(t => t.issuer.id == id || t.target.id == id)
  }
}

export const tradeHandlers: TradeHandler[] = []
