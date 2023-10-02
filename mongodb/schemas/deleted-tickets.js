const { Schema, model } = require("mongoose");

const details = new Schema({
  user_id: String,
  user_ticket_no: Number,
  ticket_status: String,
  channel_id: String,
  message_id: String,
  name: String,
  dept: String,
  contact_num: String,
  social_username: String,
  content_url: String,
  published_content1: String,
  published_content2: String,
});

module.exports = model("published-ticket-details", details);
