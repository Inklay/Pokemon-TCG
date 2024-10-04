import fs from 'fs'
import * as Config from './config'
import { ActivityType, GatewayIntentBits, Events } from 'discord.js'
import Client from './utils/client'
import { User } from './class/User'
import { Lang } from './class/Lang'
import path from 'path'
import { Serie } from './class/Serie'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.login(Config.token)

if (!fs.existsSync('./data/')) {
  fs.mkdirSync('./data')
}
if (!fs.existsSync('./data/user.json')) {
  fs.writeFileSync('./data/user.json', '[]')
}

const locales = new Map<string, Lang>
const foldersPath = path.join(__dirname, 'locale');
const files = fs.readdirSync(foldersPath)

Serie.load()

for (const file of files) {
  const filePath = path.join(foldersPath, file)
  const rawData = fs.readFileSync(filePath).toString()
  const data = JSON.parse(rawData) as Lang
  locales.set(data.global.dir, data)
}

client.once('ready', () => {
	console.log(`app.js: Logged in as ${client.user?.username}!`)
  client.user?.setActivity('tcg help', {type: ActivityType.Playing})
})

client.on(Events.InteractionCreate, async interaction => {
  const lang = locales.get(interaction.locale)!
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName)
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction, lang, User.get(interaction.user.id))
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: lang.global.commandError, ephemeral: true })
      } else {
        await interaction.reply({ content: lang.global.commandError, ephemeral: true })
      }
    }
  } else if (interaction.isButton()) {
    const command = client.commands.get(interaction.message.interaction!.commandName)
    try {
      command.handleButtons(interaction, lang, User.get(interaction.user.id))
    } catch (error) {
      console.error(error)
      await interaction.followUp({ content: lang.global.commandError, ephemeral: true })
    }
  }
})
