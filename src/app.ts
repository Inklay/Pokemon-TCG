import fs from 'fs'
import { getLang } from './dataManager/lang'
import * as Config from './config'
import { REST } from '@discordjs/rest'
import { Client, Intents, ApplicationCommandData, Message } from 'discord.js'
import { Command } from './structure/Command'
import { Lang } from './structure/Lang'

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
client.login(Config.token)
const commands: Command[] = []

async function loadCommands() {
    const commandFiles = fs.readdirSync('./src/slashCommands').filter(file => file.endsWith('.ts'))
    const commandsData: ApplicationCommandData[] = []
    for (const file of commandFiles) {
        const commandImport = await import(`./slashCommands/${file}`)
        const command = new commandImport.slahCommand()
        commands.push(command)
        commandsData.push(command.commandData);
        client.application?.commands.create(command.commandData)
    }
    registerCommands(commandsData)
}

function registerCommands(commands: ApplicationCommandData[]) {
    const rest = new REST({ version: '9' }).setToken(Config.token)
    {
        (async () => {
            try {
                console.log('Refreshing application (/) commands.')
                if (Config.isDebug && client.user) {
                    await rest.put(
                        `/applications/${client.user.id}/guilds/${Config.guildId}/commands`,
                        { body: commands },
                    )
                } else if (client.user) {
                    await rest.put(
                        `/applications/${client.user.id}/commands`,
                        { body: commands },
                    ) 
                }
                console.log('Successfully reloaded application (/) commands.')
            } catch (error) {
                console.error(error)
            }
        })()
    }
}

client.once('ready', () => {
	console.log(`app.js: Logged in as ${client.user?.username}!`)
    client.user?.setActivity('tcg help', {type: 'PLAYING'})
    loadCommands()
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
        const command = commands.find(command => command.commandData.name == interaction.commandName)
        if (!command) {
            return
        }
        const id = interaction.inGuild() ? interaction.guildId : interaction.user.id
        const channelType = interaction.inGuild() ? 'guild' : 'user'
        const langFile = JSON.parse(fs.readFileSync(`src/lang/${getLang(id, channelType)}.json`).toString())
        try {
            command.execute(interaction, langFile)
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: langFile.global.commandError, ephemeral: true })
        }
    } else if (interaction.isButton()) {
        const message = interaction.message as Message
        const command = commands.find(command => command.commandData.name == message.interaction?.commandName)
        if (!command) {
            return
        }
        const id = interaction.inGuild() ? interaction.guildId : interaction.user.id
        const channelType = interaction.inGuild() ? 'guild' : 'user'
        const langFile = JSON.parse(fs.readFileSync(`src/lang/${getLang(id, channelType)}.json`).toString()) as Lang
        try {
            command.handleButtons(interaction, langFile)
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: langFile.global.commandError, ephemeral: true })
        }
    }
})
