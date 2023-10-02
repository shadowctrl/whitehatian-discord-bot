const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../mongodb/schemas/deleted-tickets");
const db2 = require("../mongodb/schemas/closed-tickets");
const db3 = require("../mongodb/schemas/non-publish-tickets");
const db4 = require("../mongodb/schemas/user_ticket_details");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket_details")
    .setDescription("For internal use")
    .addUserOption((opt) =>
      opt.setName("target").setDescription("user").setRequired(true)
    ),
  async execute(interaction, client) {
    const permissions = [
      "758579147009163304", //raghav
      "1042486391105388554", //shree
      "655824007345602561", //tech monkey
    ];
    const error_embed = new EmbedBuilder()
      .setTitle("Access Blocked")
      .setColor("Red");
    if (!permissions.includes(interaction.user.id.toString())) {
      return await interaction
        .reply({
          content: "You don't have proper permission to use this command",
          ephemeral: true,
        })
        .then(
          error_embed.addFields({ name: "User", value: `${interaction.user}` }),
          error_embed.addFields({ name: "Command", value: "ticket_details" }),
          error_embed.addFields({ name: "Result", value: "Access Blocked" }),
          await client.channels.cache.get(client.config.logs.other_logs).send({
            embeds: [error_embed],
          })
        );
    }
    const user = interaction.options.getUser("target");
    const embed = new EmbedBuilder()
      .setTitle(`Contribution Details - ${user.username} A.K.B (${user.id})`)
      .setColor("Yellow");
    //await interaction.deferReply();
    //await interaction.user.editreply("Checking Published Tickets");
    await db.find({ user_id: user.id }).then(async (data) => {
      embed.addFields({ name: "Published Tickets", value: `${data.length}` });
    });

    //await interaction.user.editreply("Checking Non Published Tickets");
    await db3.find({ user_id: user.id }).then(async (data) => {
      embed.addFields({
        name: "Non Published Tickets",
        value: `${data.length}`,
      });
    });

    //await interaction.user.editreply("Checking Closed Tickets");
    await db2.find({ user_id: user.id }).then(async (data) => {
      embed.addFields({ name: "Closed Tickets", value: `${data.length}` });
    });

    // await interaction.user.editreply("Checking Open Tickets");
    await db4.find({ user_id: user.id }).then(async (data) => {
      embed.addFields({ name: "Open Tickets", value: `${data.length}` });
    });

    const success_embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Access Allowed");
    await interaction.user
      .send({
        embeds: [embed],
        content: " ",
      })
      .then(
        await interaction.reply({
          content: "Details sent as Direct Message to you.",
          ephemeral: true,
        }),
        success_embed.addFields({ name: "user", value: `${interaction.user}` }),
        success_embed.addFields({ name: "Command", value: "ticket_details" }),
        success_embed.addFields({ name: "Result", value: "Access Granted" }),
        await client.channels.cache.get(client.config.logs.other_logs).send({
          embeds: [success_embed],
        })
      );
  },
};
