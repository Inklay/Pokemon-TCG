import { config } from 'dotenv'
config()

if (!process.env.TOKEN) {
  throw 'Token not in env, aborting'
}

export const token = process.env.TOKEN
export const appId = process.env.APP_ID
export const isDebug = process.env.IS_DEBUG === 'true'
export const guildId = process.env.IS_DEBUG === 'true' ? process.env.GUILD_ID : undefined
