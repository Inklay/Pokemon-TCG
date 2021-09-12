const fs = require('fs');
const Discord = require('discord.js');
const deleteMessage = require('./deleteMessage.js')

class userHandler
{
    embed = new Discord.MessageEmbed()
    serie = 0
    series = []
    extensions = []
    baseDescription
    hasValidated = false
    extension = 0
    baseAuthorExt
    baseAuthorSerie
    dir
    price = 0
    hasOpened = false
    cards = []
    card = 0
    sell
    moneySell = 0
    isBuyable = true
    listExt
    new
    cardsNew = []
    serieNumber
    id
    notEnoughMoney
    noCardsInThisSerie
    noCardsInThisExpansion
    hasOneCard = false
    authorId
    delete_message = false
    secretCard
    secretCards

    constructor(id, channel, language, authorId, guildId, guildType)
    {
        this.id = id
        this.channel = channel
        this.authorId = authorId
        this.delete_message = deleteMessage.get(guildId, guildType)
        switch (language)
        {
            case "français":
                this.dir = "fr"
                this.price = "Prix"
                this.baseDescription = `Vous avez`
                this.baseAuthorExt = "Sélectionnez l'extension voulue"
                this.baseAuthorSerie = "Sélectionnez la série voulue"
                this.sell = "Vous avez vendu les cartes que vous aviez déjà, vous avez gagné"
                this.listExt = "Liste des extensions existantes pour cette série"
                this.new = "Nouvelle carte!"
                this.serieNumber = "Numéro dans la série"
                this.notEnoughMoney = "Vous n'avez pas assez d'argent pour acheter ce booster"
                this.noCardsInThisSerie = "Vous n'avez pas de carte dans cette série"
                this.noCardsInThisExpansion = "Vous n'avez pas de carte dans cette extension"
                this.secretCard = "carte secrete"
                this.secretCards = "cartes secretes"
                break
            case "english":
            default:
                this.dir = "en"
                this.price = "Price"
                this.baseDescription = `You Have`
                this.baseAuthorExt = "Choose the expansion you want"
                this.baseAuthorSerie = "Choose the serie you want"
                this.sell = "You sold the cards that you already had, you earned"
                this.listExt = "List of the extisting expansions for this serie"
                this.new = "New card!"
                this.serieNumber = "Number in the serie"
                this.notEnoughMoney = "You don't have enough money to buy this booster"
                this.noCardsInThisSerie = "You don't have any card in this serie"
                this.noCardsInThisExpansion = "You don't have any carte in this expansion"
                this.secretCard = "secret card"
                this.secretCards = "secret cards"
                break
        }
        this.series = JSON.parse(fs.readFileSync(`cards/${this.dir}/series.json`))
    }

    addCards()
    {
        var rawData = fs.readFileSync('data/user.json')
        var data = JSON.parse(rawData)
        for (let i in data.users)
        {
            if (data.users[i].id == this.id)
            {
                if (!data.users[i].hasOwnProperty(this.extensions[this.extension].id))
                {
                    data.users[i][this.extensions[this.extension].id] = []
                    for (let j in this.cards)
                    {
                        data.users[i][this.extensions[this.extension].id].push(this.cards[j].id)
                        this.cardsNew.push(true)
                    }
                }
                else
                {
                    var found = false
                    for (let j in this.cards)
                    {
                        found = false
                        for (let k in data.users[i][this.extensions[this.extension].id])
                        {
                            if (data.users[i][this.extensions[this.extension].id][k] == this.cards[j].id)
                            {
                                found = true
                                switch (this.cards[this.card].rarity)
                                {
                                    case "common":
                                        this.moneySell += Math.floor(1 * this.extensions[this.extension].price) / 10
                                        break;
                                    case "uncommon":
                                        this.moneySell += Math.floor(2 * this.extensions[this.extension].price) / 10
                                        break;
                                    case "rare":
                                        this.moneySell += Math.floor(5 * this.extensions[this.extension].price) / 10
                                        break;
                                    case "special":
                                        this.moneySell += Math.floor(8 * this.extensions[this.extension].price) / 10
                                        break;
                                    case "ultraRare":
                                        this.moneySell += Math.floor(12 * this.extensions[this.extension].price) / 10
                                        break;
                                    case "secret":
                                        this.moneySell += Math.floor(50 * this.extensions[this.extension].price) / 10
                                        break;
                                }
                            }
                        }
                        if (!found)
                        {
                            data.users[i][this.extensions[this.extension].id].push(this.cards[j].id)
                            this.cardsNew.push(true)
                        }
                        else
                        {
                            this.cardsNew.push(false)
                        }
                    }
                }
                data.users[i].money += this.moneySell - this.extensions[this.extension].price
                data.users[i][this.extensions[this.extension].id] = data.users[i][this.extensions[this.extension].id].sort(function(a, b) {return a - b})
                break
            }
        }
        var json = JSON.stringify(data)
        fs.writeFileSync('data/user.json', json)
    }

    createMessage(userMsg)
    {
        this.drawSerie()
        this.channel.send(this.embed).then(msg =>
        {
            msg.react('⬅').then(r =>
            {
                msg.react('➡').then(r =>
                {
                    msg.react('✔️').then(r =>
                    {
                        msg.react('❌').then(() =>
                        {
                            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === this.authorId
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === this.authorId
                            const validateFilter = (reaction, user) => reaction.emoji.name === '✔️' && user.id === this.authorId
                            const cancelFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === this.authorId
            
                            const backwards = msg.createReactionCollector(backwardsFilter)
                            const forwards = msg.createReactionCollector(forwardsFilter)
                            const validate = msg.createReactionCollector(validateFilter)
                            const cancel = msg.createReactionCollector(cancelFilter)
                            
                            backwards.on('collect', (r, _) =>
                            {
                                if (!this.hasValidated && this.serie != 0)
                                {
                                    this.serie--
                                    this.drawSerie()
                                }
                                else if (this.hasValidated && this.extension != 0 && !this.hasOpened)
                                {
                                    this.extension--
                                    this.drawExtension()
                                }
                                else if (this.hasOpened && this.card != 0)
                                {
                                    this.card--
                                    this.drawCard()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            forwards.on('collect', (r, _) =>
                            {
                                if (!this.hasValidated && this.serie < this.series.length - 1)
                                {
                                    this.serie++
                                    this.drawSerie()
                                }
                                else if (this.hasValidated && this.extension < this.extensions.length - 1 && !this.hasOpened)
                                {
                                    this.extension++
                                    this.drawExtension()
                                }
                                else if (this.hasOpened && this.card < this.cards.length - 1)
                                {
                                    this.card++
                                    this.drawCard()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            validate.on('collect', (r, _) =>
                            {
                                if (!this.hasValidated)
                                {
                                    if (!(!this.isBuyable && !this.hasOneCard))
                                    {
                                        this.hasValidated = true
                                        this.drawExtension()
                                    }
                                }
                                else if (this.extensions[this.extension].released && !this.hasOpened)
                                {
                                    if (this.isBuyable)
                                    {
                                        if (this.extensions[this.extension].price <= this.get("money"))
                                        {
                                            this.open()
                                        }
                                    }
                                    else
                                    {
                                        if (!(!this.isBuyable && !this.hasOneCard))
                                        {
                                            let cards = this.get(this.extensions[this.extension].id)
                                            for (let i in cards)
                                            {
                                                this.cards.push({"id": cards[i]})
                                            }
                                            if (this.cards.length != 0)
                                            {
                                                this.drawCard()
                                            }
                                            this.hasOpened = true
                                        }
                                    }
                                }
                                else if (this.hasOpened)
                                {
                                    this.card = 0
                                    this.cards = []
                                    this.cardsNew = []
                                    this.moneySell = 0
                                    this.hasOpened = false
                                    this.drawExtension()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            cancel.on('collect', (r, _) =>
                            {
                                if (!this.hasValidated)
                                {
                                    msg.delete()
                                    if (this.delete_message && msg.member.hasPermission("MANAGE_MESSAGES"))
                                    {
                                        userMsg.delete()
                                    }
                                    delete this
                                }
                                else if (this.hasValidated && !this.hasOpened)
                                {
                                    this.hasValidated = false
                                    this.extension = 0
                                    this.drawSerie()
                                    msg.edit(this.embed)
                                    r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                }
                                else if (this.hasOpened)
                                {
                                    msg.delete()
                                    if (this.delete_message && msg.member.hasPermission("MANAGE_MESSAGES"))
                                    {
                                        userMsg.delete()
                                    }
                                    delete this
                                }
                            })
                        })
                    })
                })
            })
        })
    }
}