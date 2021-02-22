const Discord = require('discord.js');

class helpHandler
{
    embed = new Discord.MessageEmbed()
    channel
    authorId
    isAdmin
    commandList
    basicDescription
    isViewingAdminPage = false
    viewCommandDescription
    buyCommandDescription
    moneyCommandDescription
    languageCommandDescription
    languageListCommandDescription
    prefixCommandDescription
    deleteMessageCommandDescription

    constructor (member, channel, language)
    {
        this.channel = channel
        this.authorId = member.user.id
        this.isAdmin = member.hasPermission("ADMINISTRATOR")
        switch (language)
        {
            case "français":
                this.commandList = "Liste des commands"
                this.adminCommandList = "Liste des commandes administrateur"
                this.viewCommandDescription = "Voir votre collection de carte"
                this.buyCommandDescription = "Acheter des boosters"
                this.moneyCommandDescription = "Recevoir 10$ (toutes les heures)"
                this.languageCommandDescription = "Changer la langue du bot"
                this.languageListCommandDescription = "Voir la liste des langues supportées"
                this.prefixCommandDescription = "Changer le prefix du bot"
                this.deleteMessageCommandDescription = "Désactiver/activer la suppression de message"
                break
            case "english":
            default:
                this.commandList = "Command list"
                this.adminCommandList = "Administrator command list"
                this.viewCommandDescription = "View your card's collection"
                this.buyCommandDescription = "Buy new boosters"
                this.moneyCommandDescription = "Receive 10$ (every hour)"
                this.languageCommandDescription = "Change the language of the bot"
                this.languageListCommandDescription = "View the list of supported languages"
                this.prefixCommandDescription = "Change the bot's prefix"
                this.deleteMessageCommandDescription = "Enable/disable the deletation of message"
                break
        }
    }

    drawAdminHelp()
    {
        this.embed.setTitle(this.adminCommandList)
        this.embed.setColor("#f7432f")
        this.embed.fields = []
        this.embed.addFields(
            { name: "tcg language", value: this.languageCommandDescription, inline: true},
            { name: "tcg language list", value: this.languageListCommandDescription, inline: true},
            { name: "tcg prefix", value: this.prefixCommandDescription},
            { name: "tcg delete_message", value: this.deleteMessageCommandDescription, inline: true},
        )
    }

    drawBasicHelp()
    {
        this.embed.setTitle(this.commandList)
        this.embed.setColor("#3679f5")
        this.embed.fields = []
        this.embed.addFields(
            { name: "tcg v || view", value: this.viewCommandDescription, inline: true},
            { name: "tcg b || buy", value: this.buyCommandDescription, inline: true},
            { name: "tcg m || money", value: this.moneyCommandDescription},
        )
    }

    createMessage()
    {
        this.drawBasicHelp()
        if (!this.isAdmin)
        {
            this.channel.send(this.embed)
        }
        else
        {
            this.channel.send(this.embed).then(msg =>
            {
                msg.react('⬅').then(r =>
                {
                    msg.react('➡').then(() =>
                    {
                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === this.authorId
                        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === this.authorId

                        const backwards = msg.createReactionCollector(backwardsFilter)
                        const forwards = msg.createReactionCollector(forwardsFilter)

                        backwards.on('collect', (r, _) =>
                        {
                            if (this.isViewingAdminPage)
                            {
                                this.drawBasicHelp()
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                this.isViewingAdminPage = false
                            }
                        })

                        forwards.on('collect', (r, _) =>
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
        }
    }

    view()
    {
        this.createMessage()
    }
}

module.exports = { helpHandler }