const fs = require('fs');
const Discord = require('discord.js');
const { reverse } = require('dns');
const { log } = require('console');

module.exports = {
    set: function(id, field, content) {
        var found = false
        rawData = fs.readFileSync('user.json')
        data = JSON.parse(rawData)
        for (i in data.users) {
            if (data.users[i].id == id) {
                data.users[i][field] = content
                found = true
            }
        }
        if (!found) {
            newUser = {}
            newUser['id'] = id
            newUser[field] = content
            data.users.push(newUser)
        }
        json = JSON.stringify(data)
        fs.writeFileSync('user.json', json)
    },
    get: function(id, field)
    {
        rawData = fs.readFileSync('user.json')
        data = JSON.parse(rawData)
        for (i in data.users) {
            if (data.users[i].id == id) {
                if (data.users[i].hasOwnProperty(field))
                    return data.users[i][field]
            }
        }
        if (field == "money") {
            this.set(id, field, 500)
            return 500
        } else
            return null
    },
    addCards: function(id)
    {
        rawData = fs.readFileSync('user.json')
        data = JSON.parse(rawData)
        for (i in data.users) {
            if (data.users[i].id == id) {
                if (!data.users[i].hasOwnProperty(this.extensions[this.extension].id)) {
                    data.users[i][this.extensions[this.extension].id] = []
                    for (j in this.cards) 
                        data.users[i][this.extensions[this.extension].id].push(this.cards[j].id)
                }
                else {
                    var found = false
                    for (j in this.cards) {
                        found = false
                        for (k in data.users[i][this.extensions[this.extension].id]) {
                            if (data.users[i][this.extensions[this.extension].id][k] == this.cards[j].id) {
                                found = true
                                switch (this.cards[this.card].rarity) {
                                    case "common":
                                        this.moneySell += Math.floor(0.1 * this.extensions[this.extension].price)
                                        break;
                                    case "uncommon":
                                        this.moneySell += Math.floor(0.2 * this.extensions[this.extension].price)
                                        break;
                                    case "rare":
                                        this.moneySell += Math.floor(0.5 * this.extensions[this.extension].price)
                                        break;
                                    case "special":
                                        this.moneySell += Math.floor(0.8 * this.extensions[this.extension].price)
                                        break;
                                    case "ultraRare":
                                        this.moneySell += Math.floor(1.2 * this.extensions[this.extension].price)
                                        break;
                                }
                                this.set(id, "money", this.get(id, "money") + this.moneySell)
                            }
                        }
                        if (!found)
                            data.users[i][this.extensions[this.extension].id].push(this.cards[j].id)
                    }
                }
                data.users[i].money -= this.extensions[this.extension].price
                data.users[i][this.extensions[this.extension].id] = data.users[i][this.extensions[this.extension].id].sort(function(a, b) {return a - b})
                break
            }
        }
        json = JSON.stringify(data)
        fs.writeFileSync('user.json', json)
    },
    drawSerie: function(id)
    {
        this.extensions = JSON.parse(fs.readFileSync(`cards/${this.dir}/${this.series[this.serie]}/ext.json`))
        this.embed.setTitle(this.series[this.serie])
        var description = `${this.baseDescription} ${this.get(id, "money")} $\n\n`
        for (let i = 0; i < this.extensions.length; i++)
            description += `• ${this.extensions[i].name}\n`
        this.embed.setDescription(description)
        this.embed.setAuthor(this.baseAuthorSerie)
        this.embed.setImage("")
        this.embed.setFooter(`${this.serie + 1}/${this.series.length}`)
    },
    drawExtension: function(id)
    {
        var description = `${this.baseDescription} ${this.get(id, "money")} $\n\n ${this.price}: ${this.extensions[this.extension].price} $`
        if (!this.extensions[this.extension].released)
            description += `\n ${this.notReleased}`
        this.embed.setAuthor(this.baseAuthorExt)
        this.embed.setTitle(this.extensions[this.extension].name)
        this.embed.setDescription(description)
        this.embed.setImage(this.extensions[this.extension].image)
        this.embed.setFooter(`${this.extension + 1}/${this.extensions.length}`)
    },
    drawCard: function()
    {
        if (this.moneySell > 0)
            this.embed.setDescription(`${this.sell} ${this.moneySell} $`)
        this.embed.setImage(`${this.extensions[this.extension].cardsBaseImage}${this.cards[this.card].id}.png`)
        this.embed.setFooter(`${this.card + 1}/${this.cards.length}`)
    },
    open : function(id)
    {
        this.hasOpened = true

        // 1st card
        var card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 2nd
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 3rd
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 4th
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 5th
        card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id || this.extensions[this.extension].common[card] == this.cards[3].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})

        // 6th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})
        
        // 7th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        while (this.extensions[this.extension].uncommon[card] == this.cards[5].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})

        // 8th
        card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
        while (this.extensions[this.extension].uncommon[card] == this.cards[5].id || this.extensions[this.extension].uncommon[card] == this.cards[6].id)
            card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
        this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})

        // 9th
        var reverse = Math.random()
        if (reverse > 0.95)
            this.cards.push({"id": this.extensions[this.extension].ultraRare[Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)], "rarity": "ultraRare"})
        else if (reverse > 0.8)
            this.cards.push({"id": this.extensions[this.extension].special[Math.floor(Math.random() * this.extensions[this.extension].special.length)], "rarity": "special"})
        else if (reverse > 0.6)
            this.cards.push({"id": this.extensions[this.extension].rare[Math.floor(Math.random() * this.extensions[this.extension].rare.length)], "rarity": "rare"})
        else if (reverse > 0.35) {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].uncommon[card] == this.cards[5].id || this.extensions[this.extension].uncommon[card] == this.cards[6].id || this.extensions[this.extension].uncommon[card] == this.cards[7].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].uncommon.length)
            this.cards.push({"id": this.extensions[this.extension].uncommon[card], "rarity": "uncommon"})
        } else {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].common[card] == this.cards[0].id || this.extensions[this.extension].common[card] == this.cards[1].id || this.extensions[this.extension].common[card] == this.cards[2].id || this.extensions[this.extension].common[card] == this.cards[3].id || this.extensions[this.extension].common[card] == this.cards[4].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].common.length)
            this.cards.push({"id": this.extensions[this.extension].common[card], "rarity": "common"})
        }
        
        // 10th
        var rare = Math.random()
        if (rare > 0.93) {
            card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            while (this.extensions[this.extension].ultraRare[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].ultraRare.length)
            this.cards.push({"id": this.extensions[this.extension].ultraRare[card], "rarity": "ultraRare"})
        } else if (rare > 0.6) {
            card = Math.floor(Math.random() * this.extensions[this.extension].special.length)
            while (this.extensions[this.extension].special[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].special.length)
            this.cards.push({"id": this.extensions[this.extension].special[card], "rarity": "special"})
        } else {
            card = Math.floor(Math.random() * this.extensions[this.extension].rare.length)
            while (this.extensions[this.extension].rare[card] == this.cards[8].id)
                card = Math.floor(Math.random() * this.extensions[this.extension].rare.length)
            this.cards.push({"id": this.extensions[this.extension].rare[card], "rarity": "rare"})
        }
        console.log(this.cards)
        this.embed.setAuthor("")
        this.embed.setDescription("")
        this.addCards(id)
        this.drawCard()
    },
    buy: function(language, channel, id)
    {
       switch (language) {
            case "français":
                this.dir = "fr"
                this.price = "Prix"
                this.baseDescription = `Vous avez`
                this.baseAuthorExt = "Sélectionnez l'extension voulue"
                this.baseAuthorSerie = "Sélectionnez la série voulue"
                this.notReleased = "Cette extension n'est pas encore sortie"
                this.sell = "Vous avez vendu les cartes que vous aviez déjà, vous avez gagné"
                break;
            case "english":
            default:
                this.dir = "en"
                this.price = "Price"
                this.baseDescription = `You Have`
                this.baseAuthorExt = "Choose the extension you want"
                this.baseAuthorSerie = "Choose the serie you want"
                this.notReleased = "This extension isn't released yet"
                this.sell = "You sold the cards that you already had, you earned"
                break;
        }
        this.series = JSON.parse(fs.readFileSync(`cards/${this.dir}/series.json`))
        this.drawSerie()
        channel.send(this.embed).then(msg => {
            msg.react('⬅').then (r => {
                msg.react('➡').then(r => {
                    msg.react('✔️').then(r => {
                        msg.react('❌').then(() => {
                            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === id;
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === id;
                            const validateFilter = (reaction, user) => reaction.emoji.name === '✔️' && user.id === id;
                            const cancelFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === id;
            
                            const backwards = msg.createReactionCollector(backwardsFilter);
                            const forwards = msg.createReactionCollector(forwardsFilter);
                            const validate = msg.createReactionCollector(validateFilter);
                            const cancel = msg.createReactionCollector(cancelFilter);
            
                            backwards.on('collect', (r, u) => {
                                if (!this.hasValidated && this.serie != 0) {
                                    this.serie--
                                    this.drawSerie()
                                } else if (this.hasValidated && this.extension != 0) {
                                    this.extension--
                                    this.drawExtension()
                                } else if (this.hasOpened && this.card != 0 && !this.hasOpened) {
                                    this.card--
                                    this.drawCard()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            forwards.on('collect', (r, u) => {
                                if (!this.hasValidated && this.serie < this.series.length - 1) {
                                    this.serie++
                                    this.drawSerie()
                                } else if (this.hasValidated && this.extension < this.extensions.length - 1 && !this.hasOpened) {
                                    this.extension++
                                    this.drawExtension()
                                } else if (this.hasOpened && this.card < this.cards.length - 1) {
                                    this.card++
                                    this.drawCard()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            validate.on('collect', (r, u) => {
                                if (!this.hasValidated) {
                                    this.hasValidated = true
                                    this.drawExtension()
                                } else if (this.extensions[this.extension].released && !this.hasOpened) {
                                    this.open(id)
                                } else if (this.hasOpened) {
                                    this.card = 0
                                    this.cards = []
                                    this.moneySell = 0
                                    this.hasOpened = false
                                    this.drawExtension()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            cancel.on('collect', (r, u) => {
                                if (!this.hasValidated)
                                    msg.delete()
                                else if (this.hasValidated && !this.hasOpened) {
                                    this.hasValidated = false
                                    this.extension = 0
                                    this.drawSerie()
                                    msg.edit(this.embed)
                                    r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                } else if (this.hasOpened)
                                    msg.delete()
                            })
                        })
                    })
                })
            })
        })
    },
    embed: new Discord.MessageEmbed(),
    serie: 0,
    series: [],
    extensions: [],
    baseDescription: "",
    hasValidated: false,
    extension: 0,
    baseAuthorExt: "",
    baseAuthorSerie: "",
    dir: "",
    notReleased: "",
    price: 0,
    hasOpened: false,
    cards: [],
    card: 0,
    sell: "",
    moneySell: 0
}