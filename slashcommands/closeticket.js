const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forcecloseticket")
    .setDescription("For internal use"),
  async execute(interaction, client) {
    if (interaction.user.id != client.config.social_mods.mod1) {
      await interaction.deferReply();
      await interaction.editReply({
        content: "Only for internal use.",
        ephermal: true,
      });
    } else {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close-ticket")
          .setEmoji("🎫")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
      );
      await interaction.channel.send({ components: [row] });
    }
  },
};
