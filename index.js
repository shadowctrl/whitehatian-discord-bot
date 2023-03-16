const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const mongodb = require("./mongodb/mongoose.js");
const Discord = require("discord.js");
const Token = process.env.token;

const config = require("./config.json");
const colors = require("colors");
require("dotenv").config();

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

//const std_log = require('./logs/std_log.js');

client.discord = Discord;
client.config = config;
//client.std_log = std_log;
module.exports = client;

//events Read
fs.readdirSync("./events").filter((dir) => {
  let files = fs
    .readdirSync(`./events/${dir}`)
    .filter((file) => file.endsWith(".js"));
  for (let file of files) {
    const event = require(`./events/${dir}/${file}`);
    client.on(event.name, (...args) => {
      event.execute(...args, client);
    });
  }
});

/*const i_create=require('./events/client/interaction_create');
const ready= require('./events/client/ready');

client.on('ready',(a)=> ready.execute(a,client));
client.on('interactionCreate',(i)=>{ console.log("logged"); i_create.execute(i,client)});*/

//Ticket Handlers
/*const ticket=require('./handlers/apply-instagram')
client.on('interactionCreate', (...args) => ticket.execute(...args, client));
*/

client.login(Token).catch((err) => {
  console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
  console.error(err);
  return process.exit();
});

//Error Handling
// process.on("unhandledRejection", async (err, promise) => {
//   handle.createrr(client, undefined, undefined, err);
// });

// process.on("uncaughtException", async (err, origin) => {
//   handle.createrr(client, undefined, undefined, err);
// });

//mongodb.login(client);

// -------------------------------------- Express ---------------------------------------

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/post", (req, res) => {
  console.log("Connected to React");
  res.redirect("/");
});
const port = 8080;
app.use(cors());
app.listen(port, console.log("listening on port 8080"));
