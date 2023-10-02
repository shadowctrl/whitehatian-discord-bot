const request = require("request");
const { error } = require("../../handlers/logs/error");

module.exports = {
  name: "messageCreate",
  execute: async (interaction, client) => {
    if (interaction.author.bot) return;
    // -------------------------------------- Express ---------------------------------------
    if (
      interaction.channel.id.toString() !==
      client.config.chatbot.test_channel.toString()
    )
      return;

    const data = {
      json: {
        message: interaction.content,
      },
    };

    const callback = (err, response, body) => {
      if (err) {
        return error(client, interaction, "Chatbot", err);
      }
      try {
        interaction.reply(response.body);
      } catch (err) {
        error(client, interaction, "Chatbot", err);
      }
    };
    request.post("http://127.0.0.1:5000/request", data, callback);
  },
};
