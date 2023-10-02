require('dotenv').config();
const mongo = require('mongoose');
const cert = '/home/raghav/Documents/code/whitehatian/credentials/mongodb/cert.pem'
//const err_log = require("../logs/err_log.js")
var colors = require('colors');

module.exports={
    login(client)
    {   
        mongo.connect(process.env.mongodb_url,{
            useNewUrlParser: true,
            autoIndex:false,
            connectTimeoutMS:10000,
            keepAlive:true,
            //sslKey:cert,
            //sslCert:cert,
        })

        mongo.connection.on('connected',() => {
            console.log("[DB] Connected.".bgGreen.bold.italic);
            //client.err_log.error(client,file="mongoose.js",line="20",err="[DB] CONNECTED")
        });

        mongo.connection.on('error',(err) => {
            console.log("[DB] ERROR".bgRed,err);
            //client.err_log.error(client,file="mongoose.js",line="21",err=err);
        });  

        mongo.connection.on('disconnect',() => {
            console.log("[DB] Disconnected".bgRed.black.bold);
            //client.err_log.error(client,file="mongoose.js",line="24",err="[DB] DISCONNECTED");
        });
        
    }    
}