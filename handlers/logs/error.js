const { EmbedBuilder, Embed } = require("discord.js");

function error(client, interaction, identifier, msg) {
  const embed = new EmbedBuilder()
    .setColor("DarkRed")
    .setTitle(`Error Occurred - ${identifier}`)
    .addFields({ name: "Message", value: `${msg}` })
    .setTimestamp();

  client.channels.cache.get(client.config.logs.error_logs).send({
    embeds: [embed],
  });
}
module.exports = { error };
