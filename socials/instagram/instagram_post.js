const fs = require("fs");
require("colors");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { Curl } = require("node-libcurl");
function auth(token, client) {
  console.log("Instagram Authenticated Successfully!".bgYellow);
  setInterval(() => {
    const curl = new Curl();

    curl.setOpt(
      Curl.option.URL,
      `https://graph.instagram.com/me/media?fields=media_url,permalink,caption&limit=1&access_token=${token.access_token}`
    );
    curl.on("end", function (response, data) {
      if (data.error) console.log("Error in instagram api", data);
      const media = JSON.parse(data).data[0].media_url;
      const feed = JSON.parse(data).data[0].permalink;
      const caption = JSON.parse(data).data[0].caption;

      const db = fs.readFileSync("./db/instagram_feed_ids.txt", "utf8");
      if (db.length > 0) {
        if (feed == db) {
          //pass
        } else {
          const embed = new EmbedBuilder()
            .setColor("DarkVividPink")
            .setTitle("WhiteHatians On Instagram")
            .setDescription(`${caption}`)
            .setImage(`${media}`)
            .setURL("https://instagram.com/whitehatians")
            .setFooter({
              text: "WhiteHatians Srmvec",
              iconURL: `${client.config.whitehatians.logo}`,
            });

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setURL(`${feed}`)
              .setLabel("View Post")
              .setStyle(ButtonStyle.Link)
          );
          var insta_channel = client.channels.cache.get(
            `${client.config.socials.instagram_feed_cid}`
          );
          insta_channel.send({ embeds: [embed], components: [row] });
          fs.writeFileSync("./db/instagram_feed_ids.txt", feed);
        }
      }
    });
    curl.perform();
  }, 300000);
}
module.exports = {
  main(client) {
    const token = fs.readFileSync("./socials/instagram/long_token.json");
    if (!token) console.log("Instagram Api Credentials not found...".bgRed);
    else auth(JSON.parse(token), client);
  },
};
