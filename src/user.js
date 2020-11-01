const fs = require('fs');
const Discord = require('discord.js')

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
    drawSerie: function()
    {
        this.extensions = JSON.parse(fs.readFileSync(`cards/${this.dir}/${this.series[this.serie]}/ext.json`))
        this.embed.setTitle(this.series[this.serie])
        var description = this.baseDescription
        for (let i = 0; i < this.extensions.length; i++)
            description += `• ${this.extensions[i].name}\n`
        this.embed.setDescription(description)
        this.embed.setAuthor(this.baseAuthorSerie)
        this.embed.setImage("")
        this.embed.setFooter(`${this.serie + 1}/${this.series.length}`)
    },
    drawExtension: function()
    {
        var description = `${this.baseDescription} ${this.price}: ${this.extensions[this.extension].price} $`
        if (!this.extensions[this.extension].released)
            description += `\n ${this.notReleased}`
        this.embed.setAuthor(this.baseAuthorExt)
        this.embed.setTitle(this.extensions[this.extension].name)
        this.embed.setDescription(description)
        this.embed.setImage(this.extensions[this.extension].image)
        this.embed.setFooter(`${this.extension + 1}/${this.extensions.length}`)
    },
    open : function()
    {

    },
    buy: function(language, channel, id)
    {
       switch (language) {
            case "français":
                this.dir = "fr"
                this.price = "Prix"
                this.baseDescription = `Vous avez ${this.get(id, "money")} $\n\n`
                this.baseAuthorExt = "Sélectionnez l'extension voulue"
                this.baseAuthorSerie = "Sélectionnez la série voulue"
                this.notReleased = "Cette extension n'est pas encore sortie"
                break;
            case "english":
            default:
                this.dir = "en"
                this.price = "Price"
                this.baseDescription = `You Have ${this.get(id, "money")} $\n\n`
                this.baseAuthorExt = "Choose the extension you want"
                this.baseAuthorSerie = "Choose the serie you want"
                this.notReleased = "This extension isn't released yet"
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
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            forwards.on('collect', (r, u) => {
                                if (!this.hasValidated && this.serie < this.series.length - 1) {
                                    this.serie++
                                    this.drawSerie()
                                } else if (this.hasValidated && this.extension < this.extensions.length - 1) {
                                    this.extension++
                                    this.drawExtension()
                                }
                                msg.edit(this.embed)
                                r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                            })
                            validate.on('collect', (r, u) => {
                                if (!this.hasValidated) {
                                    this.hasValidated = true
                                    this.drawExtension()
                                    msg.edit(this.embed)
                                    r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                } else if (this.extensions[this.extension].released)
                                    this.open()
                            })
                            cancel.on('collect', (r, u) => {
                                if (!this.hasValidated)
                                    msg.delete()
                                else {
                                    this.hasValidated = false
                                    this.extension = 0
                                    this.drawSerie()
                                    msg.edit(this.embed)
                                    r.users.remove(r.users.cache.filter(u => u !== msg.author).first())
                                }
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
    price: 0
}