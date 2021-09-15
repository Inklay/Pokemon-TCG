import { CommandInteraction, Message, MessageButton, MessageEmbed, TextChannel, User } from "discord.js"
import { InteractionReply } from "../structure/InteractionReply"
import { Lang } from "../structure/Lang"
import { getUserHandler, UserHandler } from "./userHandler"

export class TradeHandler {
  private issuer: UserHandler
  private target: UserHandler | undefined
  public issuerId: string
  public targetId: string
  private issuerIntercation: CommandInteraction
  private targetIntercation: CommandInteraction | undefined
  private lang: Lang
  private inviteMessage: Message | undefined
  
  constructor(issuerId: string, targetId: string, lang: Lang, interaction: CommandInteraction) {
    this.lang = lang
    this.issuer = getUserHandler(lang, issuerId, 'TRADING')
    this.issuerId = issuerId
    this.targetId = targetId
    this.issuerIntercation = interaction
  }

  public deleteInvite() : void {
    if (this.inviteMessage != undefined) {
      this.inviteMessage.delete()
    }
  }

  public async notifyTarget(channel: TextChannel, target: User, issuerNickname: string) : Promise<InteractionReply> {
    const embed: MessageEmbed = new MessageEmbed()
    const buttons: MessageButton[] = []
    if (this.issuerId == this.targetId) {
      embed.setTitle(this.lang.global.error)
      embed.setDescription(this.lang.trade.cantTradeWithYourself)
    } else if (TradeHandler.get(this.issuerId) != undefined) {
      embed.setTitle(this.lang.trade.alreadyInTrade)
      embed.setDescription(this.lang.trade.youAreAlreadyInTrade)
    } else if (TradeHandler.get(this.targetId) != undefined) {
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
    this.targetIntercation = interaction
  }

  public deny() : InteractionReply {
    this.deleteInvite()
    const embed: MessageEmbed = new MessageEmbed()
    embed.setTitle(this.lang.trade.denied)
    embed.setDescription(this.lang.trade.wasDenied)
    const reply: InteractionReply = new InteractionReply(embed, [])
    this.updateInteraction(reply, this.issuerIntercation)
    return reply
  }

  public updateInteraction(reply: InteractionReply, interaction: CommandInteraction | undefined) : void {
    if (interaction != undefined) {
      interaction.editReply({
        embeds: [reply.embed],
        components: reply.hasButton() ? reply.buttons : undefined,
      })
    }
  }

  public accept(interaction: CommandInteraction) : InteractionReply {
    this.deleteInvite()
    this.setTargetInteraction(interaction)
    this.target = getUserHandler(this.lang, this.targetId, 'TRADING')
    this.issuer.setMode('TRADING')
    this.updateInteraction(this.issuer.drawCard(), this.issuerIntercation)
    return this.target.drawCard()
  }

  public cancel(id: string) : InteractionReply {
    this.deleteInvite()
    if (id == this.issuerId) {
      this.updateInteraction(this.tradeCanceled(), this.targetIntercation)
    } else {
      this.updateInteraction(this.tradeCanceled(), this.issuerIntercation)
    }
    return this.tradeCanceled()
  }

  public static acceptTrade(id: string, interaction: CommandInteraction, lang: Lang) : InteractionReply {
    const handler: TradeHandler | undefined = TradeHandler.get(id)
    if (handler == undefined) {
      return TradeHandler.notInTrade(lang)
    }
    return handler.accept(interaction)
  }

  public static denyTrade(id: string, lang: Lang) : InteractionReply {
    const handler: TradeHandler | undefined = TradeHandler.get(id)
    if (handler == undefined) {
      return TradeHandler.notInTrade(lang)
    }
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
    return tradeHandlers.find(t => t.issuerId == id || t.targetId == id)
  }
}

/**
 * @constant {TradeHandler[]}
 */
export const tradeHandlers: TradeHandler[] = []