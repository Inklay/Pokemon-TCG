const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client();
const prefix = require('./src/prefix.js')
const language = require('./src/language.js');
const user = require('./src/user.js')

token = fs.readFileSync('token.txt', 'utf8').replace('\n', '')

// Create server.json if it doesn't exist or is corrupted
if (!fs.existsSync('server.json')) {
    rawData = '{"servers":[]}'
    fs.writeFileSync('server.json', rawData);
} else
    rawData = fs.readFileSync('server.json');
try {
    JSON.parse(rawData);
} catch {
    rawData = '{"servers":[]}';
    fs.writeFileSync('server.json', rawData);
}

// Create user.json if it doesn't exist or is corrupted
if (!fs.existsSync('user.json')) {
    rawData = '{"users":[]}'
    fs.writeFileSync('user.json', rawData);
} else
    rawData = fs.readFileSync('user.json');
try {
    JSON.parse(rawData);
} catch {
    rawData = '{"users":[]}';
    fs.writeFileSync('user.json', rawData);
}

client.on('ready', () => {
    console.log(`app.js: Logged in as ${client.user.username}!`)
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
    if (content == "buy") {
        user.buy(guildLanguage, channel, author.id, Discord)
        return
    } else if (content == "b") {
        user.buy(guildLanguage, channel, author.id, Discord)
        return
    }
})

client.login(token)