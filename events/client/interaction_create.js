const fs = require("fs");
const apply_post = require("../../handlers/apply-post");

module.exports = {
  name: "interactionCreate",
  execute: async (interaction, client) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        await command.execute(interaction, client);
      }
    }
  },
};
