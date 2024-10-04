import { Routes, REST, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js'
import * as Config from './config'
import fs from 'fs'
import path from 'path'
import { Command } from './class/Command';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

async function loadCommands() {
  const foldersPath = path.join(__dirname, 'commands');
  const fileExtension = Config.isDebug ? '.ts' : '.js'
  const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(fileExtension))
  for (const file of commandFiles) {
    const commandPath = path.join(foldersPath, file)
    const commandImport = await import(commandPath)
    const command: Command = new commandImport.slahCommand()
    commands.push(command.data.toJSON())
  }
}

async function registerCommands() {
  const rest = new REST().setToken(Config.token);

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

    if (!Config.appId || !Config.guildId) {
      console.log('Missing configuration for command registration, aborting.')
      return
    }

		const data = await rest.put(
			Routes.applicationGuildCommands(Config.appId, Config.guildId),
			{ body: commands },
		) as any[];

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

loadCommands().then(() => {
  registerCommands().then(() => {
    console.log('Application reloaded.')
  })
})
