const dotenv = require('dotenv')
dotenv.config()

if (!process.env.TOKEN) {
  throw 'Token not in env, aborting'
}

module.exports = {
  token: process.env.TOKEN,
  isDebug: process.env.IS_DEBUG === 'true',
  guildId: process.env.IS_DEBUG === 'true' ? process.env.GUILD_ID : undefined
}
