const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client();
const prefix = require('./prefix.js')
const language = require('./language.js');
const user = require('./user.js')

token = fs.readFileSync('token.txt', 'utf8').replace('\n', '')

// Create data folder if it doesn't exist
if (!fs.existsSync('data/'))
{
    fs.mkdirSync('data/')
}

// Create server.json if it doesn't exist or is corrupted
if (!fs.existsSync('data/server.json')) {
    rawData = '{"servers":[]}'
    fs.writeFileSync('data/server.json', rawData);
} else
    rawData = fs.readFileSync('data/server.json');
try {
    JSON.parse(rawData);
} catch {
    rawData = '{"servers":[]}';
    fs.writeFileSync('data/server.json', rawData);
}

// Create user.json if it doesn't exist or is corrupted
if (!fs.existsSync('data/user.json')) {
    rawData = '{"users":[]}'
    fs.writeFileSync('data/user.json', rawData);
} else
    rawData = fs.readFileSync('data/user.json');
try {
    JSON.parse(rawData);
} catch {
    rawData = '{"users":[]}';
    fs.writeFileSync('data/user.json', rawData);
}

client.on('ready', () => {
    console.log(`app.js: Logged in as ${client.user.username}!`)
    client.user.setActivity('tcg help', {type: 'PLAYING'})
})

client.on('message', msg => {
    const author = msg.author
    const contentWithPrefix = msg.content.toLocaleLowerCase()
    const channel = msg.channel
     
    // Check if the bot is in a guild or in private message
    if (msg.guild) {
        channelType = 'guild'
        id = msg.guild.id
    } else {
        channelType = 'user'
        id = msg.author.id
    }

    const guildLanguage = language.get(id, channelType)
    const guildPrefix = prefix.get(id, channelType)

    // Check if message starts with prefix
    if (contentWithPrefix.startsWith("tcg "))
        content = contentWithPrefix.substr(4).toLocaleLowerCase()
    else if (contentWithPrefix.startsWith(`${guildPrefix}`))
        content = contentWithPrefix.substr(guildPrefix.length).toLocaleLowerCase()
    else
        return

    // Language handling
    if (content == "language list") {
        language.list(channel)
        return
    } else if (content.startsWith("language ")) {
        language.set(content.substring(9), channel, id, channelType)
        return
    }

    // Prefix handling
    if (content == "prefix") {
        prefix.show(guildPrefix, guildLanguage, channel)
        return
    } else if (content.startsWith("prefix ")) {
        prefix.set(id, channelType, content.substring(7), guildLanguage, channel)
        return
    }

    // Booster handling
    if (content == "buy" || content == "b") {
        handler = new user.userHandler(author.id, channel, guildLanguage)
        handler.buy(msg)
        return
    }

    // Money request handling
    if (content == "money" || content == "m") {
        handler = new user.userHandler(author.id, channel, guildLanguage)
        handler.money(guildLanguage)
        return
    }

    // View request handling
    if (content == "view" || content == "v") {
        handler = new user.userHandler(author.id, channel, guildLanguage)
        handler.view(msg)
        return
    }

    // Help
    if (content == "help" || content == "h") {
        switch (guildLanguage) {
            case "français":
                channel.send("```Voir le préfix actuel: tcg prefix\nChanger le préfix: tcg prefix [prefix]\nVoir la liste des langues supportées: tcg language list\n" +
                "Changer la langue du serveur: tcg language [langue]\nAcheter un booster: tcg buy ou tcg b\nRecevoir de l'argent: tcg money ou tcg m\nVoir vos cartes: tcg view ou tcg v```")
                return
            case "english":
            default:
                channel.sendMessage("```See configured prefix: pokedex prefix\nChange prefix: pokedex prefix [prefix]\nSee the list of supported language: pokedex language list\n" +
                "Change guild language: pokedex language [language]\nBuy a booster: tcg buy or tcg b_n\nreceive money: tcg money or tcg m\nView your cards: tcg view or tcg v```")
                return
        }

    }
})

client.login(token)