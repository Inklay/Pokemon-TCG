import { GuildMember, MessageEmbed, Permissions } from 'discord.js';
import { Lang } from '../structure/Lang'

export class helpHandler
{
    embed: MessageEmbed
    authorId: string
    isAdmin: boolean
    isViewingAdminPage: boolean
    lang: Lang

    constructor (member: GuildMember, lang: Lang)
    {
        this.embed = new MessageEmbed()
        this.authorId = member.user.id
        this.isAdmin = member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
        this.isViewingAdminPage = false
        this.lang = lang
    }

    drawAdminHelp()
    {
        
        this.embed.setTitle(this.lang.help.embed.adminCommandList)
        this.embed.setColor("#f7432f")
        this.embed.setFields(
            { name: "tcg language", value: this.lang.help.embed.languageCommandDescription, inline: true},
            { name: "tcg language list", value: this.lang.help.embed.languageListCommandDescription, inline: true},
            { name: "tcg prefix", value: this.lang.help.embed.prefixCommandDescription},
            { name: "tcg delete_message", value: this.lang.help.embed.deleteMessageCommandDescription, inline: true}
        )
    }

    drawBasicHelp()
    {
        this.embed.setTitle(this.lang.help.embed.commandList)
        this.embed.setColor("#3679f5")
        this.embed.setFields(
            { name: "tcg v || view", value: this.lang.help.embed.viewCommandDescription, inline: true},
            { name: "tcg b || buy", value: this.lang.help.embed.buyCommandDescription, inline: true},
            { name: "tcg m || money", value: this.lang.help.embed.moneyCommandDescription}
        )
    }

    createEmbed()
    {
        this.drawBasicHelp()
        return this.embed
        /*if (!this.isAdmin)
        {
            this.channel.send(this.embed)
        }
        else
        {
            this.channel.send(this.embed).then(msg =>
            {
                msg.react('⬅').then(() =>
                {
                    msg.react('➡').then(() =>
                    {
                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === this.authorId
                        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === this.authorId

                        const backwards = msg.createReactionCollector(backwardsFilter)
                        const forwards = msg.createReactionCollector(forwardsFilter)

                        backwards.on('collect', (r) =>
                        {
                            if (this.isViewingAdminPage)
                            {
                                this.drawBasicHelp()
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                this.isViewingAdminPage = false
                            }
                        })

                        forwards.on('collect', (r) =>
                        {
                            if (!this.isViewingAdminPage)
                            {
                                this.drawAdminHelp()
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                this.isViewingAdminPage = true
                            }
                        })
                    })
                })
            })  
        }*/
    }
}