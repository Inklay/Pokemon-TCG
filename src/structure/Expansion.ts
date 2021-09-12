import { MessageButton, MessageEmbed } from "discord.js"
import { UserHandlerMode } from "../commandsHandler/userHandler"
import { InteractionReply } from "./InteractionReply"
import { Lang } from "./Lang"

/**
 * @class Expansion
 * 
 * The Expansion object
 * 
 * @public @property {string} name - The name of the expansion
 * @public @property {number} price - The price of the expansion
 * @public @property {string} id - The id of the expansion
 * @public @property {string} image - The logo of the expansion
 * @public @property {string} cardsBaseImage - The base URL for the image of the cards of the expansion
 * @public @property {string} infoBaseUrl - The base URL for the infomation of the cards of the expansion
 * @public @property {boolean} released - Whether or not this expansion is released
 * @public @property {boolean} fixNumber - Whether or not the number of the cards should be fixed
 * @public @property {number[]} common - The common cards
 * @public @property {number[]} uncommon - The uncommon cards
 * @public @property {number[]} rare - The rare cards
 * @public @property {number[]} special - The special cards
 * @public @property {number[]} ultraRare - The ultrarare cards
 * @public @property {boolean} canGetSecret - Whether or not the user can obtain secret cards
 * @public @property {number[]} secret - The secret cards
 */
export class Expansion {
  public name: string = ''
  public price: number = 0
  public id: string = ''
  public image: string = ''
  public cardsBaseImage: string = ''
  public infoBaseUrl: string = ''
  public released: Boolean = false
  public fixNumber: Boolean = false
  public common: number[] = []
  public uncommon: number[] = []
  public rare: number[] = []
  public special: number[] = []
  public ultraRare: number[] = []
  public size: number = 0
  public canGetSecret: Boolean = false
  public secret: number[] = []

  /**
   * @public @method
   * 
   * Draws an expansion in a Discord embed message
   * 
   * @param {number} idx - The index of this expansion in the expansion array
   * @param {Lang} lang - The lang of the server 
   * @param {UserHanlerMode} mode - The current mode of the handler
   * @param {number} max - The size of the expansion array
   * @param {number} userMoney - The money of the user
   * @param {boolean} isFavourite - Whether or not this expansion is the user's favourite
   * @returns {InteractionReply} The reply of the interaction
   */
  public draw(idx: number, lang: Lang, mode : UserHandlerMode, max: number, userMoney: number, isFavourite: boolean) : InteractionReply {
    const canBuy: boolean = this.price <= userMoney
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = this.createButton(idx, max, mode, lang, canBuy, isFavourite)
    embed.setTitle(this.name)
    embed.setFooter(`${idx + 1}/${max + 1}`)
    embed.setAuthor(lang.expansion.selectExpansion)
    let description: string = ""
    if (!canBuy && mode == 'BUYING') {
      description = `${lang.money.dontHaveEnough}\n`
    }
    if (mode == 'BUYING') {
      description += `${lang.expansion.costs} ${this.price}$\n${lang.global.youHave}: ${userMoney}$`
    }
    embed.setDescription(description)
    embed.setImage(this.image)
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
   * @param {boolean} canBuy - Whather or not thie user can buyt this expansion
   * @param {boolean} isFavourite - Whether or not this expansion is the user's favourite
   * @returns {MessageButton[]} The buttons to add to the message
   */
  private createButton(idx: number, max: number, mode: UserHandlerMode, lang: Lang, canBuy: boolean, isFavourite: boolean) : MessageButton[] {
    const buttons : MessageButton[] = []
    if (idx != 0) {
      buttons.push(new MessageButton({
        customId: 'expansionPrev',
        style: "PRIMARY",
        emoji: '⬅️'
      }))
    }
    if (idx != max) {
      buttons.push(new MessageButton({
        customId: 'expansionNext',
        style: "PRIMARY",
        emoji: '➡️'
      }))
    }
    if (mode == 'BUYING' && canBuy) {
      buttons.push(new MessageButton({
        label: lang.expansion.select,
        customId: 'expansionSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    } else if (mode == 'VIEWING') {
      buttons.push(new MessageButton({
        label: lang.expansion.select,
        customId: 'expansionViewSelect',
        style: "SUCCESS",
        emoji: '✔️'
      }))
    }
    buttons.push(new MessageButton({
      label: lang.global.back,
      customId: 'expansionBack',
      style: "DANGER",
      emoji: '❌'
    }))
    if (mode == 'BUYING') {
      if (isFavourite) {
        buttons.push(new MessageButton({
          label: lang.expansion.unsetFav,
          customId: 'expansionUnsetFav',
          style: 'SECONDARY',
          emoji: '🌟'
        }))
      } else {
        buttons.push(new MessageButton({
          label: lang.expansion.setFav,
          customId: 'expansionSetFav',
          style: 'SECONDARY',
          emoji: '⭐'
        }))
      }
    }
    return buttons
  }
}
