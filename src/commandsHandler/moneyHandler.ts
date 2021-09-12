import { User } from "../structure/User"
import { Lang } from "../structure/Lang"
import { MessageButton, MessageEmbed } from "discord.js"
import { InteractionReply } from "../structure/InteractionReply"

/**
 * @function
 * 
 * Adds 50$ to the user
 * 
 * @param {Lang} lang - The lang of the server 
 * @param {string} id - The ID of the user 
 * @returns {InteractionReply} - The information as a Discord embed messge
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
  } else {
    embed.description = `${lang.money.youHaveToWait} ${Math.floor((user.date + 60 * 60 * 1000 - now) / 1000 / 60)} ${lang.money.minutes}\n`
  }
  embed.description += `${lang.global.youHave} : ${user.money}$`
  return new InteractionReply(embed, buttons)
}

/**
 * @function
 * 
 * Tells the user that it doesn't have enough money to buy this
 * 
 * @param {Lang} lang - The lang of the server 
 * @returns {InteractionReply} - The information as a Discord embed messge
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
