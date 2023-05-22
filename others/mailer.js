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
        console.log("inside");
        var mail_ids = res.data.values[0];
        var names = res.data.values[1];
        await interaction.reply(`***Found ${names.length} Entries***`);

        for (let i = 0; i < names.length; i++) {
          const files = fs
            .readdirSync("./others/mail_attachments")
            .filter((f) => f.endsWith(".pdf"));
          for (let a of files) {
            var act_name = path.parse(a).name;
            act_name = act_name.toLowerCase().split(" ").join(""); //file name
            s_name = names[i].toLowerCase().split(" ").join(""); //sheets name
            if (act_name == s_name) {
              console.log("Matched name".bgGreen, act_name, s_name);
              console.log(
                `Mail id: ${mail_ids[i]}, Name: ${names[i].toLowerCase()} `
              );

              const attachments = [
                {
                  filename: "Certificate of Participation.pdf",
                  path: `./others/mail_attachments/${a}`,
                },
              ];

              const options = {
                to: `${mail_ids[i]}`,
                subject: `e-Certificate Battle for Flags `,
                text: `
Dear CTF player,
🏁 We would like to extend our heartfelt appreciation for your participation in Battle For Flags. Your enthusiasm and dedication made the event a great success. We hope you had an exciting and fulfilling experience throughout the challenges.
              
✅ To ensure that you stay updated with the latest information and receive the writeups for the challenges, we have created a dedicated Discord server for Battle For Flags. You can access the server using the following invite link: [Discord server invite link: https://discord.gg/QKjrhegdx5]. 

We are pleased to inform you that our team has decided to extend the availability of the server [ https://whitehatians.tech ] so that you can continue practicing. We understand the importance of both practical and theoretical knowledge, and we believe that the updated writeups will provide valuable insights for further improvement.
                
📑 As the writeups get updated, we will notify you about the deadline for server availability. This will allow you to practice using the updated writeups, both practically and theoretically, enhancing your skills and knowledge.
                
🔖 Your feedback is incredibly important to us, as it helps us improve and enhance future events. We kindly request you to take a moment to fill out the feedback form for Battle For Flags. Your valuable insights and suggestions will be instrumental in shaping the future of our competitions. You can find the feedback form at [https://forms.gle/cue4fGtzLwsEcrtD7].
                
Here is your e-Certificate attached to this mail. If you encounter any issues or have any queries related to Battle For Flags, we have set up a dedicated channel on our Discord server called "support-bff" under the category "Battle For Flags". Feel free to reach out to us there, and we will be more than happy to assist you.

Once again, we sincerely thank you for your participation and look forward to your continued engagement. We hope to see you in future events as well. 
                
Best regards,
Team Whitehatians,
Department of Cyber Security,
SRM Valliammai Engineering Collge.`,

                attachments: attachments,
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
