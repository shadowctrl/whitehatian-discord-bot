var colors = require("colors");

const { EmbedBuilder, ActivityType, Embed } = require("discord.js");
const fs = require("fs");
const internal = require("stream");
const deploy = require("../../deploy.js");

module.exports = {
  name: "ready",
  async execute(client) {
    console.log(`${client.user.tag} Ready to go.`.bgWhite.italic.bold.black);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Bot Restart Completed")
      .setFooter({
        text: "Whitehatians",
        iconURL: client.config.whitehatians.logo,
      })
      .setTimestamp();

    await client.channels.cache
      .get(client.config.logs.start_log)
      .send({ embeds: [embed] });
    //client.user.setStatus("dnd");

    fs.readdirSync(`./socials`).filter((dir) => {
      var files = fs
        .readdirSync(`./socials/${dir}`)
        .filter((file) => file.endsWith(".js"));
      for (let x of files) {
        const social = require(`../../socials/${dir}/${x}`);
        social.main(client);
      }
    });

    //Err
    //const err_chanid = client.config.ERR_LOG.CHAN_ID
    //const err_logchan = client.channels.cache.get(err_chanid);

    const activities = [
      { name: `The Cyberspace 👀`, type: ActivityType.Watching },
      { name: `Detecting Intrusions`, type: ActivityType.Competing },
      { name: `your Queries 24/7!`, type: ActivityType.Listening },
      { name: `White Hatians ❤️`, type: ActivityType.Playing },
      {
        name: `${client.users.cache.size} Users!`,
        type: ActivityType.Watching,
      },
      { name: `Information Security`, type: ActivityType.Competing },
      { name: "Inauguration Event", type: ActivityType.Watching },
      { name: "Cyber Awarness Expo", type: ActivityType.Watching },
      { name: "Cyber Warfare", type: ActivityType.Competing },
      { name: "Youtube", type: ActivityType.Watching },
      { name: "Event", type: ActivityType.Streaming },
      { name: "Hackathon", type: ActivityType.Competing },
      { name: "Whitehatians 🎩", type: ActivityType.Listening },
      { name: "Logo art design", type: ActivityType.Competing },
    ];

    let i = 0;
    setInterval(() => {
      if (i >= activities.length) i = 0;
      client.user.setActivity(activities[i]);
      i++;
    }, 30000);

    await deploy.execute(client);
  },
};
