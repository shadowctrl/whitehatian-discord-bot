const { google } = require("googleapis");
const fs = require("fs");
require("colors");

async function auth(cred, client) {
  const apikey = cred.youtube;
  const youtube = google.youtube({
    version: "v3",
    auth: `${apikey}`,
  });
  if (youtube) console.log("Youtube Authenticated Successfully!".bgYellow);

  try {
    setInterval(async () => {
      await youtube.search
        .list({
          part: "snippet",
          channelId: client.config.socials.youtube_channel_id,
          maxResults: "1",
          order: "date",
          type: "video",
        })
        .then(
          async (response) => {
            if (response.status != 200)
              console.log("Error occured- yt_vides.js".bgRed, response);

            const video_id = await response.data.items[0].id.videoId;
            const video_title = await response.data.items[0].snippet.title;
            const video_des = await response.data.items[0].snippet.description;

            const db = fs.readFileSync("./db/youtube_video_ids.txt", "utf8");
            if (db.length > 0) {
              if (video_id == db) {
              } else {
                yt_channel = client.channels.cache.get(
                  `${client.config.socials.youtube_videos_cid}`
                );
                yt_channel.send({
                  content: `***WhiteHatians Uploaded a new video***\nhttps://www.youtube.com/watch?v=${video_id}`,
                });
                fs.writeFileSync("./db/youtube_video_ids.txt", video_id);
              }
            }
          },
          async (error) => {
            console.log("Youtube Search Error".bgRed.black, error);
          }
        );
    }, 1800000); //1800000
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  main(client) {
    const token = fs.readFileSync("./credentials/google/apikeys.json");
    if (!token) console.log("YT Api Credentials not found...".bgRed);
    else auth(JSON.parse(token), client);

    //     fs.readFile('./credentials/google/apikeys.json',async (err,content)=>{
    //     if (err)
    //         console.log("YT Api Credentials not found...".bgRed);

    //     else{
    //     //console.log("Api Credentials Found".italic.dim)
    //     await auth(JSON.parse(content),client);
    // }
    // })
  },
};
