const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const colors = require("colors");
const cred = require("../credentials/google/apikeys.json");
const send_mail = require("./composer.js");

module.exports = {
  async execute(interaction, client, spreadsheet_id) {
    const spreadsheet = google.sheets({
      version: "v4",
      auth: `${cred.sheets}`,
    });
    //get colums
    await spreadsheet.spreadsheets.values
      .get({
        spreadsheetId: `${spreadsheet_id}`,
        range: "Sheet1",
        majorDimension: "COLUMNS",
      })
      .then(async (res) => {
        var mail_ids = res.data.values[0];
        // var names = res.data.values[1];
        await interaction.reply(`***Found ${mail_ids.length} Entries***`);

        for (let i = 0; i < mail_ids.length; i++) {
          // const files = fs
          //   .readdirSync("./others/mail_attachments")
          //   .filter((f) => f.endsWith(".jpg"));
          // for (let a of files) {
          // var act_name = path.parse(a).name;
          // act_name = act_name.toLowerCase().split(" ").join(""); //file name
          // s_name = names[i].toLowerCase().split(" ").join(""); //sheets name
          // if (act_name == s_name) {
          // console.log("Matched name".bgGreen, act_name, s_name);
          // console.log(
          // `Mail id: ${mail_ids[i]}, Name: ${names[i].toLowerCase()} `
          // );
          console.log(`Mail id: ${mail_ids[i]} `);

          const attachments = [
            {
              filename: "Invitation.jpeg",
              path: `./others/mail_attachments/poster.jpeg`,
            },
          ];

          const options = {
            to: `${mail_ids[i]}`,
            subject: `Payment Acknowlegement - Hack-A-Tank `,
            html: `
              <html>
                <body>
                  <p>
                    Dear Participant,
                    <br />
                    <br />
                    We acknowlege the payment of Rs.999 towards
                    "<strong>Hack-A-Tank</strong>", scheduled for 8th September and 9th
                    September. Your payment has been received and processed. You
                    are officially registered, and we look forward to your
                    participation. 
                    <br /> <br />
                    <strong>Get ready to hack and innovate!</strong>
                    <br />
                    <br />
                    🚦We wanted to share the social media profiles for our cyber
                    club with you. Our club is dedicated to exploring the world
                    of cybersecurity, and we post regular updates and resources
                    on our social media pages.
                    <br /> <br />
                    🔖Instagram - https://instagram.com/whitehatians
                    <br />
                    🔖 LinkedIn - https://linkedin.com/company/whitehatians
                    <br />
                    🔖Discord - https://discord.gg/Qkjrhegdx5
                    <br />
                    🔖YouTube - https://youtube.com/@whitehatians
                    <br />
                    🔖Facebook - https://facebook.com/whitehatians
                    <br />
                    <br />
                    Best Regards, <br />
                    Team Hack-A-Tank,
                    <br />
                    Srmvec.
                  </p>
                </body>
              </html>
            `,
            // attachments: attachments,
            textEncoding: "base64",
            headers: [
              {
                key: "X-Application-Developer",
                value: "https://www.shadowctrl.me",
              },
              { key: "X-Application-Version", value: "v1.0" },
            ],
          };
          const msg_id = await send_mail(options, interaction).catch((err) =>
            console.log(err)
          );

          // }
        }
        // }
      })
      .then((msgid) => console.log("All mails sent"));
  },
};
