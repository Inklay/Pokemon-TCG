import { GuildMember, MessageButton, MessageEmbed, Permissions } from "discord.js";
import { InteractionReply } from "../structure/InteractionReply";
import { Lang } from "../structure/Lang";
import { setLang, getLang } from "../dataManager/lang"
import fs from 'fs'

/**
 * @function list - Returns the list of the languages
 * 
 * @param {Lang} lang - The lang of the server
 * @param {GuildMember} member - The member ran the command
 * @returns {InteractionReply} - The reply of the command
 */
export function list(lang: Lang, member: GuildMember) : InteractionReply {
  const embed = new MessageEmbed()
  const buttons : MessageButton[] = []
  if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    embed.setTitle(lang.lang.langList)
    embed.setDescription(`${lang.lang.french}\n${lang.lang.english}`)
  } else {
    embed.setTitle(lang.global.permissionMissing)
    embed.setDescription(lang.global.doNotHavePermission)
  }
  embed.setColor("#f7432f")
  return new InteractionReply(embed, buttons)
}

/**
 * @function basicHelp - Sets the language of the server
 * 
 * @param {Lang} lang - The lang of the server
 * @param {GuildMember} member - The member ran the command
 * @param {string} language - The name of the language
 * @param {string} id - The id of the server
 * @param {string} type - The type of the server (either guild or user)
 * @returns {InteractionReply} - The reply of the command
 */
export function set(lang: Lang, member: GuildMember, language: string, id: string, type: string) : InteractionReply {
  const embed = new MessageEmbed()
  const buttons : MessageButton[] = []
  if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    setLang(language, id, type)
    lang = JSON.parse(fs.readFileSync(`src/lang/${getLang(id, type)}.json`).toString()) as Lang
    embed.setTitle(lang.lang.langUpdated)
    embed.setDescription(lang.lang.langSet)
  } else {
    embed.setTitle(lang.global.permissionMissing)
    embed.setDescription(lang.global.doNotHavePermission)
  }
  embed.setColor("#f7432f")
  return new InteractionReply(embed, buttons)
}
