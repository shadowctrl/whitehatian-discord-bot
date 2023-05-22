//Drive prerun
const { google } = require("googleapis");
const drive_cred = require("../credentials/google/drive_whitehatians.json");
const { drive } = require("googleapis/build/src/apis/drive");
const drive_scope = ["https://www.googleapis.com/auth/drive"];

const oauth2 = new google.auth.Oauth2(
  drive_cred.installed.client_id,
  drive_cred.installed.client_secret,
  drive_cred.installed.redirect_uris[0]
);

const url = oauth2.generateAuthUrl({
  access,
});
