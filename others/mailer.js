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
                subject: ` E-Certificate for Hack-a-Tank - National Level 24-Level Hackathon`,
                html: (
                  <html>
                    <body>
                      Dear Participant,
                      <br /> <br />
                      We are delighted to present you with your well-deserved
                      E-Certificate for participating in Hack-a-Tank, the
                      National Level 24-Level Hackathon!
                      <br /> <br />
                      <strong>Hack-a-Tank</strong> has been an exhilarating
                      journey of innovation, problem-solving, and technical
                      excellence, and your active involvement and dedication
                      have truly shone throughout the competition. As a
                      testament to your outstanding efforts and token of our
                      appreciation, we are pleased to present you with the
                      official E-certificate of participation. Please find the
                      E-certificate attached to this email.
                      <br /> <br />
                      If you have any questions or require any further
                      information, please feel free to reach out to us by
                      replying to this mail.
                      <strong>
                        Thank you for being a part of the National Level 24-hour
                        Hackathon on occasion of celebrating 25th year of
                        SRMVEC, and we wish you every success in your future
                        endeavors.
                      </strong>
                    </body>
                  </html>
                ),

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
