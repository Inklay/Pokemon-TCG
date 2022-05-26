import { User } from "../structure/User"
import { Lang } from "../structure/Lang"
import { MessageButton, MessageEmbed } from "discord.js"
import { InteractionReply } from "../structure/InteractionReply"

/**
 * @function addMoney - Adds 10$ to the user
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} - The reply of the command
 */
export function addMoney(lang: Lang, id: string) : InteractionReply {
  const user = User.create(id)
  const now = Date.now()
  const embed = new MessageEmbed()
  const buttons : MessageButton[] = []
  embed.setColor("#3679f5")
  embed.setTitle(lang.money.yourMoney)
  if (now - user.date >= 1000 * 60 * 60) {
    user.money += 10
    user.date = now
    embed.description = `${lang.money.gotMoney}\n`
    User.update(user)
  } else
    embed.description = `${lang.money.youHaveToWait} ${Math.floor((user.date + 60 * 60 * 1000 - now) / 1000 / 60)} ${lang.money.minutes}\n`
  embed.description += `${lang.global.youHave} : ${user.money}$`
  return new InteractionReply(embed, buttons)
}

/**
 * @function notEnoughMoney - Tells the user they don't have enough money
 * 
 * @param {Lang} lang - The lang of the server
 * @returns {InteractionReply} - The reply of the command
 */
export function notEnoughMoney(lang: Lang) : InteractionReply {
  const embed = new MessageEmbed()
  const buttons : MessageButton[] = []
  embed.setTitle(lang.money.notEnough)
  embed.setDescription(lang.money.dontHaveEnough)
  buttons.push(new MessageButton({
    customId: 'moneyGoBack',
    style: 'SUCCESS'
  }))
  return new InteractionReply(embed, buttons)
}
