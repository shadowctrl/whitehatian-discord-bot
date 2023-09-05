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
        range: "Sheet2",
        majorDimension: "COLUMNS",
      })
      .then(async (res) => {
        var mail_ids = res.data.values[0];
        var names = res.data.values[1];
        await interaction.reply(`***Found ${names.length} Entries***`);

        for (let i = 0; i < names.length; i++) {
          const files = fs
            .readdirSync("./others/mail_attachments")
            .filter((f) => f.endsWith(".png"));
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
                  filename: "Certificate of Participation.png",
                  path: `./others/mail_attachments/${a}`,
                },
              ];

              const options = {
                to: `${mail_ids[i]}`,
                subject: `e-Certificate: CSI-G20 Webinar, August 2nd, 2023`,
                text: `
Dear all,

We value your participation in the webinar "இணைய பாதுகாப்பு - தேவை தற்காப்பு". As a token of appreciation, please find attached your e-certificate.
                
Best regards,
CSI - Organizing Committee
                
                
அனைவருக்கும் வணக்கம்,
                
"இணைய பாதுகாப்பு - தேவை தற்காப்பு" என்ற இணைய வழி நிகழ்ச்சியில் உங்கள் பங்கேற்பை நாங்கள் மிகவும் மதிக்கிறோம். பங்களிப்புக்கான அடையாளமாக,  e-சான்றிதழை இணைத்துள்ளோம்.
                
அன்புடன்,
CSI - ஏற்பாட்டுக் குழு`,

                attachments: attachments,
                textEncoding: "base64",
                headers: [
                  {
                    key: "X-Application-Developer",
                    value: "https://www.shadowctrl.me",
                  },
                  { key: "X-Application-Version", value: "v1.0" },
                ],
              };
              const msg_id = await send_mail(options, interaction);
            }
          }
        }
      })
      .then((msgid) => console.log("All mails sent"));
  },
};
