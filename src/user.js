const fs = require('fs');
const Discord = require('discord.js');

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
    notReleased
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

    constructor(id, channel, language)
    {
        this.id = id
        this.channel = channel
        switch (language)
        {
            case "français":
                this.dir = "fr"
                this.price = "Prix"
                this.baseDescription = `Vous avez`
                this.baseAuthorExt = "Sélectionnez l'extension voulue"
                this.baseAuthorSerie = "Sélectionnez la série voulue"
                this.notReleased = "Cette extension n'est pas encore disponnible sur le bot"
                this.sell = "Vous avez vendu les cartes que vous aviez déjà, vous avez gagné"
                this.listExt = "Liste des extensions existantes pour cette série"
                this.new = "Nouvelle carte!"
                this.serieNumber = "Numéro dans la série"
                this.notEnoughMoney = "Vous n'avez pas assez d'argent pour achater ce booster"
                break
            case "english":
            default:
                this.dir = "en"
                this.price = "Price"
                this.baseDescription = `You Have`
                this.baseAuthorExt = "Choose the expansion you want"
                this.baseAuthorSerie = "Choose the serie you want"
                this.notReleased = "This expansion isn't available on the bot yet"
                this.sell = "You sold the cards that you already had, you earned"
                this.listExt = "List of the extisting expansions for this serie"
                this.new = "New card!"
                this.serieNumber = "Number in the serie"
                this.notEnoughMoney = "You don't have enough money to buy this booster"
                break
        }
        this.series = JSON.parse(fs.readFileSync(`cards/${this.dir}/series.json`))
    }

    set(field, content)
    {
        var found = false
        var rawData = fs.readFileSync('data/user.json')
        var data = JSON.parse(rawData)
        for (let i in data.users)
        {
            if (data.users[i].id == this.id)
            {
                data.users[i][field] = content
                found = true
            }
        }
        if (!found)
        {
            var newUser = {}
            newUser['id'] = this.id
            newUser[field] = content
            newUser['date'] = Date.now()
            data.users.push(newUser)
        }
        var json = JSON.stringify(data)
        fs.writeFileSync('data/user.json', json)
    }

    get(field)
    {
        var rawData = fs.readFileSync('data/user.json')
        var data = JSON.parse(rawData)
        for (let i in data.users)
        {
            if (data.users[i].id == this.id && data.users[i].hasOwnProperty(field))
            {
                return data.users[i][field]
            }
        }
        if (field == "money")
        {
            this.set(field, 50)
            return 50
        }
        else
        {
            return null
        }
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
    
    drawSerie()
    {
        var description = ""
        this.extensions = JSON.parse(fs.readFileSync(`cards/${this.dir}/${this.series[this.serie].id}.json`))
        this.embed.setTitle(this.series[this.serie].name)
        if (this.isBuyable)
        {
            description += `${this.baseDescription} ${this.get("money")} $\n\n`
        }
        description += `${this.listExt}\n\n`
        for (let i = 0; i < this.extensions.length; i++)
        {
            description += `• ${this.extensions[i].name}\n`
        }
        this.embed.setDescription(description)
        this.embed.setAuthor(this.baseAuthorSerie)
        this.embed.setImage("")
        this.embed.setFooter(`${this.serie + 1}/${this.series.length}`)
    }

    drawExtension()
    {
        var description = ""
        if (this.isBuyable)
        {
            description += `${this.baseDescription} ${this.get("money")} $\n\n${this.price}: ${this.extensions[this.extension].price} $`
            if (this.get("money") < this.extensions[this.extension].price)
            {
                description += `\n\n${this.notEnoughMoney}`
            }
        }
        if (!this.extensions[this.extension].released)
        {
            description += `\n\n${this.notReleased}`
        }
        this.embed.setAuthor(this.baseAuthorExt)
        this.embed.setTitle(this.extensions[this.extension].name)
        this.embed.setDescription(description)
        this.embed.setImage(this.extensions[this.extension].image)
        this.embed.setFooter(`${this.extension + 1}/${this.extensions.length}`)
    }

    drawCard()
    {
        var description = ""

        if (this.moneySell > 0)
        {
            description += `${this.sell} ${this.moneySell} $\n\n`
        }
        if (this.isBuyable && this.cardsNew[this.card])
        {
            description += `${this.new}\n\n`
        }
        else if (!this.isBuyable)
        {    
            description += `${this.serieNumber}: ${this.cards[this.card].id}/${this.extensions[this.extension].size}`
        }
        this.embed.setDescription(description)
        if (this.extensions[this.extension].fixNumber)
        {
            let fix = ""
            if (this.cards[this.card].id < 10)
            {
                fix = "00"
            }
            else if (this.cards[this.card].id < 100)
            {
                fix = "0"
            }
            this.embed.setImage(`${this.extensions[this.extension].cardsBaseImage}${fix}${this.cards[this.card].id}.png`)
        }
        else
        {
            this.embed.setImage(`${this.extensions[this.extension].cardsBaseImage}${this.cards[this.card].id}.png`)
        }
        this.embed.setFooter(`${this.card + 1}/${this.cards.length}`)
        this.embed.setAuthor("")
    }

    open()
    {
        this.hasOpened = true

        // 1st card
        var card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 2nd
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 3rd
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 4th
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 5th
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id || this.extensions[this.extension].common[card] == this.cards[3].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 6th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})
        
        // 7th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        while (this.extensions[this.extension].uncommon[card] == this.cards[5].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})

        // 8th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        while (this.extensions[this.extension].uncommon[card] == this.cards[5].id || this.extensions[this.extension].uncommon[card] == this.cards[6].id)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        }
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})

        // 9th
        var reverse = Math.random()
        if (reverse > 0.95)
        {
            this.cards.push({"id": this.extensions[this.extension].ultraRare[Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)], "rarity": "ultraRare"})
        }
        else if (reverse > 0.8)
        {
            this.cards.push({"id": this.extensions[this.extension].special[Math.floor(Math.random() * this.extensions[this.extension].special.length)], "rarity": "special"})
        
        }
        else if (reverse > 0.6)
        {
            this.cards.push({"id": this.extensions[this.extension].rare[Math.floor(Math.random() * this.extensions[this.extension].rare.length)], "rarity": "rare"})
        }
        else if (reverse > 0.35)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].uncommon[card] == this.cards[5].id || this.extensions[this.extension].uncommon[card] == this.cards[6].id || this.extensions[this.extension].uncommon[card] == this.cards[7].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
            this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})
        }
        else
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id || this.extensions[this.extension].common[card] == this.cards[3].id || this.extensions[this.extension].common[card] == this.cards[4].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
            this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})
        }
        
        // 10th
        var rare = Math.random()
        if (rare > 0.99 && this.extensions[this.extension].canGetSecret)
        {
            this.cards.push({"id": this.extensions[this.extension].secret[Math.floor(Math.random() * this.extensions[this.extension].secret.length)], "rarity": "secret"})
        }
        else if (rare > 0.93)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].ultraRare[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            this.cards.push({"id": this.extensions[this.extension].ultraRare[card], "rarity": "ultraRare"})
        }
        else if (rare > 0.6)
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].special.length)
            while (this.extensions[this.extension].special[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].special.length)
            this.cards.push({"id": this.extensions[this.extension].special[card], "rarity": "special"})
        }
        else
        {
            card = Math.floor(Math.random() * this.extensions[this.extension].rare.length)
            while (this.extensions[this.extension].rare[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].rare.length)
            this.cards.push({"id": this.extensions[this.extension].rare[card], "rarity": "rare"})
        }
        this.embed.setAuthor("")
        this.embed.setDescription("")
        this.addCards()
        this.drawCard()
    }

    createMessage(userMsg)
    {
        this.drawSerie()
        this.channel.send(this.embed).then(msg =>
            {
            msg.react('⬅').then (r =>
                {
                msg.react('➡').then(r =>
                    {
                    msg.react('✔️').then(r =>
                        {
                        msg.react('❌').then(() =>
                        {
                            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === this.id;
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === this.id;
                            const validateFilter = (reaction, user) => reaction.emoji.name === '✔️' && user.id === this.id;
                            const cancelFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === this.id;
            
                            const backwards = msg.createReactionCollector(backwardsFilter);
                            const forwards = msg.createReactionCollector(forwardsFilter);
                            const validate = msg.createReactionCollector(validateFilter);
                            const cancel = msg.createReactionCollector(cancelFilter);
                            
                            backwards.on('collect', (r, u) =>
                            {
                                if (!this.hasValidated && this.serie != 0)
                                {
                                    this.serie--
                                    this.drawSerie()
                                }
                                else if (this.hasValidated && this.extension != 0)
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
                            forwards.on('collect', (r, u) =>
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
                            validate.on('collect', (r, u) =>
                            {
                                if (!this.hasValidated)
                                {
                                    this.hasValidated = true
                                    this.drawExtension()
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
                            cancel.on('collect', (r, u) =>
                            {
                                if (!this.hasValidated)
                                {
                                    msg.delete()
                                    userMsg.delete()
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
                                    userMsg.delete()
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    view(userMsg)
    {
        this.isBuyable = false
        this.createMessage(userMsg)
    }

    buy(userMsg)
    {
        this.createMessage(userMsg)
    }

    money(language) 
    {
        var date = this.get("date")
        if (date == null)
        {
            this.get(id, "money")
        }
        var now = Date.now()
        if (now - date >= 1000 * 60 * 60)
        {
            this.set("money", this.get("money") + 10)
            this.set("date", now)
            switch (language)
            {
                case "français":
                    this.channel.send("Vous avez reçu 10 $")
                    break;
                case "english":
                default:
                    this.channel.send("You received 10 $")
                    break;
            }
        }
        else
        {
            switch (language)
            {
                case "français":
                    this.channel.send(`Vous devez encore attendre ${Math.floor((date + 60 * 60 * 1000 - now) / 1000 / 60)} minutes pour recevoir à nouveau de l'argent`)
                    break;
                case "english":
                default:
                    this.channel.send(`You have to wait ${Math.floor(60 + (now - date) / 1000 / 60)} minutes to receive money again`)
                    break;
            }
        }
    }
}

module.exports = {userHandler}