const { Schema, model} = require('mongoose');

const details = new Schema({
    guild_id:String,
    global_ticket_no: Number,
});

module.exports = model('global-ticket-details', details);