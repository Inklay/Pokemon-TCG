import { MessageButton, MessageEmbed } from 'discord.js'
import { Expansion } from './Expansion'
import { InteractionReply } from './InteractionReply'
import { Lang } from './Lang'
import { UserHandlerMode } from '../commandsHandler/userHandler'

/**
 * @class Serie
 * 
 * The Serie object
 * 
 * @private @property {string} name - The name of the Serie
 * @private @property {string} id - The id of the Serie
 */
export class Serie {
  private name: string = ""
  public id: string = ""

  /**
   * @public @method
   * 
   * Draws a serie in a Discord embed message
   * 
   * @param {Expansion[]} expansions - All the expansion in this serie
   * @param {number} idx - The index of this serie in the card array 
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @param {number} max - The size of the serie array 
   * @returns 
   */
  public draw(expansions: Expansion[], idx: number, lang: Lang, mode : UserHandlerMode, max: number) : InteractionReply {
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx, max, mode, lang)
    embed.setTitle(this.name)
    let description = ''
    expansions.forEach(e => {
      description += `• ${e.name}\n`
    })
    embed.description = description
    embed.setAuthor(lang.serie.selectSerie)
    embed.setFooter(`${idx + 1}/${max + 1}`)
    return new InteractionReply(embed, buttons)
  }

    /**
   * @private @method
   * 
   * Creates button for the embed message
   * 
   * @param {number} idx - The index of this expansion in the expansion array
   * @param {number} max - The size of the array expansion array
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @param {Lang} lang - The lang of the server 
   * @returns {MessageButton[]} The buttons to add to the message
   */
  private createButton(idx: number, max: number, mode: UserHandlerMode, lang: Lang) : MessageButton[] {
    const buttons : MessageButton[] = []
    if (idx != 0) {
      buttons.push(new MessageButton({
        customId: 'seriePrev',
        style: "PRIMARY",
        emoji: '⬅️'
      }))
    }
    if (idx != max) {
      buttons.push(new MessageButton({
        customId: 'serieNext',
        style: "PRIMARY",
        emoji: '➡️'
      }))
    }
    if (mode == 'BUYING') {
      buttons.push(new MessageButton({
        label: lang.serie.select,
        customId: 'serieSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'serieBack',
      style: "DANGER",
      emoji: '❌'
    }))
    return buttons
  }
}
