const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ca va faire pong askip'),
	async execute(interaction, lang) {
		await interaction.reply(lang.help.description);
	}
}