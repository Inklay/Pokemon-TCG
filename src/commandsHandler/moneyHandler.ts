import { User } from "../structure/User"
import { Lang } from "../structure/Lang"
import { MessageButton, MessageEmbed } from "discord.js"
import { InteractionReply } from "../structure/InteractionReply"

export function addMoney(lang: Lang, id: string) : InteractionReply {
  const user = User.create(id)
  const now = Date.now()
  const embed = new MessageEmbed()
  const buttons : MessageButton[] = []
  embed.setColor("#3679f5")
  embed.setTitle(lang.money.embed.yourMoney)
  if (now - user.date >= 1000 * 60 * 60) {
    user.money += 10
    user.date = now
    embed.description = `${lang.money.embed.gotMoney}\n`
    User.update(user)
  } else {
    embed.description = `${lang.money.embed.youHaveToWait} ${Math.floor((user.date + 60 * 60 * 1000 - now) / 1000 / 60)} ${lang.money.embed.minutes}\n`
  }
  embed.description += `${lang.money.embed.youHave} : ${user.money}$`
  return new InteractionReply(embed, buttons)
}
