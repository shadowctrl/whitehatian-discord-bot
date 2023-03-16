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
        var names = res.data.values[1];
        await interaction.reply(`***Found ${names.length} Entries***`);

        for (let i = 0; i < names.length; i++) {
          const files = fs
            .readdirSync("./others/mail_attachments")
            .filter((f) => f.endsWith(".pdf"));
          for (let a of files) {
            var act_name = path.parse(a).name;
            act_name = act_name.toLowerCase().split(" ").join("");
            s_name = names[i].toLowerCase().split(" ").join("");
            if (act_name == s_name) {
              console.log("Matched name".bgGreen, act_name, s_name);
              console.log(
                `Mail id: ${mail_ids[i]}, Name: ${names[i].toLowerCase()} `
              );
              att = `${a}`;

              const attachments = [
                {
                  //filename:'testing.jpg',
                  path: `/home/raghav/Documents/code/whitehatian/others/mail_attachments/${att}`,
                },
              ];

              const options = {
                to: `${mail_ids[i]}`,
                subject: `Thank You for Your Participation in the RootMe CTF!`,
                text: `
Dear Participants,

We wanted to personally thank every one of you for taking part in the RootMe CTF. Your enthusiasm and commitment to the event were truly inspiring. Your willingness to take on this challenge and push yourselves beyond your limits is truly commendable.

Your contributions not only made the event more exciting and helped us create a challenging and rewarding experience for all participants. We hope you enjoyed the event and found it valuable for your personal and professional development.

The Write-ups of the challenges will be uploaded in the RootMe Section of our Discord Server. Please don't hesitate to contact us for any queries in the forum section.

We wanted to share the social media profiles for our cyber club with you. Our club is dedicated to exploring the world of cybersecurity, and we post regular updates and resources on our social media pages. I thought you might be interested in following us to stay up-to-date on the latest news and developments in the field.
    
🔖Instagram  - https://instagram.com/whitehatians
🔖Discord      - https://discord.gg/Qkjrhegdx5
🔖YouTube    - https://youtube.com/@srmvec_cys_whitehatians
🔖Facebook  - https://facebook.com/srmveccyswhitehatians

Best regards,
White Hatians,
Department of Cyber Security,
SRM Valliammai Engineering College.
                `,
                //attachments: attachments,
                textEncoding: "base64",
                headers: [
                  {
                    key: "X-Application-Developer",
                    value: "https://instagram.com/_.shadowctrl._",
                  },
                  { key: "X-Application-Version", value: "v1.0" },
                ],
              };
              const msg_id = await send_mail(options, interaction);
            }
          }
        }
      });
  },
};
//.then((msgid) => console.log("All mails sent"));
