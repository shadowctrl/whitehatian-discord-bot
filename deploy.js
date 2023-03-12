var colors = require("colors");

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
  name: "ready",
  async execute(client) {
    const clientID = process.env.client_id;
    const guildID = process.env.guild_id;
    const Token = process.env.token;
    const slashcommands = [];
    const slashcommandFiles = fs
      .readdirSync("./slashcommands")
      .filter((file) => file.endsWith(".js"));
    for (const file of slashcommandFiles) {
      const command = require(`./slashcommands/${file}`);
      slashcommands.push(command.data.toJSON());

      client.commands.set(command.data.name, command);
    }
    const rest = new REST({
      version: "10",
    }).setToken(Token);

    rest
      .put(Routes.applicationCommands(clientID, guildID), {
        body: slashcommands,
      })
      .then(() =>
        console.log(
          "Successfully registered application commands.".bgBlue.bold.black
            .italic
        )
      )
      .catch((err) => {
        console.log(`${err}`.bgRed);
      });
    slashcommands.forEach((eachcommands) => {
      console.log(`${eachcommands.name} has been loaded`.bgBlue);
    });
  },
};
