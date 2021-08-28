import { GuildMember, MessageButton, MessageEmbed, Permissions } from "discord.js";
import { InteractionReply } from "../structure/InteractionReply";
import { Lang } from "../structure/Lang";
import { setLang, getLang } from "../dataManager/lang"
import fs from 'fs'

export function list(lang: Lang, member: GuildMember) : InteractionReply
{
  let embed = new MessageEmbed()
  let buttons : MessageButton[] = []
  if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    embed.setTitle(lang.lang.embed.langList)
    embed.setDescription(`${lang.lang.embed.french}\n${lang.lang.embed.english}`)
  } else {
    embed.setTitle(lang.global.permissionMissing)
    embed.setDescription(lang.global.doNotHavePermission)
  }
  embed.setColor("#f7432f")
  return new InteractionReply(embed, buttons)
}

export function set(member: GuildMember, language: string, id: string, type: string) : InteractionReply
{
  setLang(language, id, type)
  let embed = new MessageEmbed()
  let buttons : MessageButton[] = []
  const lang = JSON.parse(fs.readFileSync(`src/lang/${getLang(id, type)}.json`).toString()) as Lang
  if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    embed.setTitle(lang.lang.embed.langUpdated)
    embed.setDescription(lang.lang.embed.langSet)
  } else {
    embed.setTitle(lang.global.permissionMissing)
    embed.setDescription(lang.global.doNotHavePermission)
  }
  embed.setColor("#f7432f")
  return new InteractionReply(embed, buttons)
}