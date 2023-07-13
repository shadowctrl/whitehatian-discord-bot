require("dotenv").config();
require("colors");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const Discord = require("discord.js");
const Token = process.env.token;
const config = require("./config.json");
const mongodb = require("./mongodb/mongoose.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    status: "online",
  },
  // shards: "auto",
});

client.commands = new Collection();
client.discord = Discord;
client.config = config;

fs.readdirSync("./events").filter((dir) => {
  let files = fs
    .readdirSync(`./events/${dir}`)
    .filter((file) => file.endsWith(".js")); //events Read

  for (let file of files) {
    const event = require(`./events/${dir}/${file}`);
    client.on(event.name, (...args) => {
      event.execute(...args, client);
    });
  }
});

client.login(Token).catch((err) => {
  console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
  console.error(err);
  return process.exit();
}); //Client Logon

mongodb.login(client); //mongoDB Logon

module.exports = client;
