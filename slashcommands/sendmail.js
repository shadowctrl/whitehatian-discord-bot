const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  Embed,
} = require("discord.js");
const mailer = require("../others/mailer.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmail")
    .setDescription("For internal use only")
    .addStringOption((opt) =>
      opt
        .setName("sid")
        .setDescription("spreadsheetid")
        .setRequired(true)
        .setMaxLength(50)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction, client) {
    if (
      interaction.user.id == client.config.mailer.rakshith ||
      interaction.user.id == client.config.mailer.raghav
    ) {
      var chn = await interaction.guild.channels.cache.get(
        client.config.logs.auth_log
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Authentication logger")
        .addFields(
          { name: "Granted access", value: "Mailer (send mail)" },
          { name: "Authenticated By", value: `${interaction.user}` }
        )
        .setFooter({
          text: "Whitehatian Patrol",
          iconURL: `${client.config.whitehatians.logo}`,
        })
        .setTimestamp();

      const sid = await interaction.options.getString("sid");
      await chn.send({ embeds: [embed] });
      await mailer.execute(interaction, client, sid);
    } else {
      var chn = await interaction.guild.channels.cache.get(
        client.config.logs.auth_log
      );
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Authentication logger")
        .addFields(
          { name: "Access Restricted", value: "Mailer (send mail)" },
          { name: "Authenticated By", value: `${interaction.user}` }
        )
        .setFooter({
          text: "Whitehatian Patrol",
          iconURL: `${client.config.whitehatians.logo}`,
        })
        .setTimestamp();

      const dec_embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Whitehatian Patrol")
        .addFields({
          name: "Access Restricted",
          value: "This command is for internal use only.",
        })
        .setFooter({
          text: "Whitehatian Patrol",
          iconURL: `${client.config.whitehatians.logo}`,
        })
        .setTimestamp();

      await interaction.reply({ embeds: [dec_embed] });
      await chn.send({ embeds: [embed] });
    }
  },
};
