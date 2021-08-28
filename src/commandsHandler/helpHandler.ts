import { GuildMember, MessageButton, MessageEmbed, Permissions } from 'discord.js';
import { InteractionReply } from '../structure/InteractionReply';
import { Lang } from '../structure/Lang'

export function basicHelp(lang: Lang, member: GuildMember) : InteractionReply
{
    let embed = new MessageEmbed()
    let buttons : MessageButton[] = []
    embed.setTitle(lang.help.embed.commandList)
    embed.setColor("#3679f5")
    embed.setFields(
        { name: "tcg v || view", value: lang.help.embed.viewCommandDescription, inline: true},
        { name: "tcg b || buy", value: lang.help.embed.buyCommandDescription, inline: true},
        { name: "tcg m || money", value: lang.help.embed.moneyCommandDescription}
    )
    if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        buttons.push(new MessageButton({
            label: lang.help.labels.adminCommands,
            customId: 'adminHelp',
            style: "DANGER"
        }))
    }
    return new InteractionReply(embed, buttons)
}

export function adminHelp(lang: Lang) : InteractionReply
{
    let embed = new MessageEmbed()
    let buttons : MessageButton[] = []
    embed.setTitle(lang.help.embed.adminCommandList)
    embed.setColor("#f7432f")
    embed.setFields(
        { name: "tcg language", value: lang.help.embed.languageCommandDescription, inline: true},
        { name: "tcg language list", value: lang.help.embed.languageListCommandDescription, inline: true},
        { name: "tcg prefix", value: lang.help.embed.prefixCommandDescription},
        { name: "tcg delete_message", value: lang.help.embed.deleteMessageCommandDescription, inline: true}
    )
    buttons.push(new MessageButton({
        label: lang.help.labels.userCommands,
        customId: 'basicHelp',
        style: "PRIMARY"
    }))
    return new InteractionReply(embed, buttons)
}
