import { GuildMember, MessageButton, MessageEmbed, Permissions } from 'discord.js';
import { InteractionReply } from '../structure/InteractionReply';
import { Lang } from '../structure/Lang'

export function basicHelp(lang: Lang, member: GuildMember) : InteractionReply
{
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = []
    embed.setTitle(lang.help.commandList)
    embed.setColor("#3679f5")
    embed.setFields(
        { name: "/view", value: lang.help.viewCommandDescription, inline: true},
        { name: "/buy", value: lang.help.buyCommandDescription, inline: true},
        { name: "/money", value: lang.help.moneyCommandDescription}
    )
    if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        buttons.push(new MessageButton({
            label: lang.help.adminCommands,
            customId: 'adminHelp',
            style: 'DANGER'
        }))
    }
    return new InteractionReply(embed, buttons)
}

export function adminHelp(lang: Lang) : InteractionReply
{
    const embed = new MessageEmbed()
    const buttons : MessageButton[] = []
    embed.setTitle(lang.help.adminCommandList)
    embed.setColor("#f7432f")
    embed.setFields(
        { name: "/language", value: lang.help.languageCommandDescription, inline: true},
        { name: "/language list", value: lang.help.languageListCommandDescription, inline: true}
    )
    buttons.push(new MessageButton({
        label: lang.help.userCommands,
        customId: 'basicHelp',
        style: 'PRIMARY'
    }))
    return new InteractionReply(embed, buttons)
}
