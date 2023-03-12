const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ding Ding"),
    async execute(interaction, client) {
        await interaction.reply("hello")

    }
}