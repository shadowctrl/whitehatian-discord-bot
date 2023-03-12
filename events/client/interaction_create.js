const fs = require("fs");
const apply_post = require("../../handlers/apply-post");

module.exports = {
  name: "interactionCreate",
  execute: async (interaction, client) => {
    //if (!interaction.type === InteractionType.ApplicationCommand) return
    //console.log(interaction);

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        await command.execute(interaction, client);
      }
    }

    if (!interaction.isChatInputCommand()) {
      apply_post.execute(interaction, client);
      //   const tickets = fs
      //     .readdirSync("./handlers")
      //     .filter((f) => f.endsWith(".js"));
      //   for (let arr of tickets) {
      //     const file = require(`./handlers/${arr}`);
      //     file.execute(interaction, client);
      //   }
    }
  },
};
