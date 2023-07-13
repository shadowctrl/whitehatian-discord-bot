const { google } = require("googleapis");

const gmail_cred = require("../credentials/google/gmail_whitehatian.json");
const { client_secret, client_id, redirect_uris } = gmail_cred.installed;

const tokens = require("./token.json");
const MailComposer = require("nodemailer/lib/mail-composer");
const { gmail } = require("googleapis/build/src/apis/gmail");

async function get_gmail() {
  const oauth2 = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oauth2.setCredentials(tokens);
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2,
  });
  return gmail;
}

async function rawconvert(msg) {
  return Buffer.from(msg)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function create_mail(options) {
  const mailcomposer = new MailComposer(options);
  const msg = await mailcomposer.compile().build();
  return rawconvert(msg);
}

async function send_mail(options) {
  const gmail = await get_gmail();
  const msg = await create_mail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: "me",
    resource: { raw: msg },
  });
  console.log("Message id", id);
}

module.exports = send_mail;
