import { Client as DiscordClient, ClientOptions, Collection } from 'discord.js'
import * as Config from '../config'
import fs from 'fs'
import path from 'path'
import { Command } from '../class/Command'

export default class Client extends DiscordClient {
  public commands: Collection<string, any>

  constructor(options: ClientOptions) {
    super(options)
    this.commands = new Collection();
    this.loadCommands()
  }

  async loadCommands() {
    const foldersPath = path.join(__dirname, '../commands');
    const fileExtension = Config.isDebug ? '.ts' : '.js'
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(fileExtension))
    for (const file of commandFiles) {
      const commandPath = path.join(foldersPath, file)
      const commandImport = await import(commandPath)
      const command: Command = new commandImport.slahCommand()
      this.commands.set(command.data.name, command)
    }
  }
}