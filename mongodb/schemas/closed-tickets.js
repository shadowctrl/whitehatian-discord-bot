const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const details = new Schema({
  user_id: String,
  user_ticket_no: Number,
  ticket_status: String,
  platform: String,
  channel_id: String,
  message_id: String,
  name: String,
  dept: String,
  contact_num: String,
  social_username: String,
  content_url: String,
});

module.exports = model("closed-ticket-details", details);
