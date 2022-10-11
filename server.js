const config = require('./config.json');
const { Client } = require('discord.js');
const { connect } = require('mongoose');

const client = new Client();

client.login(config.bot.token);
client.on("ready",()=>{
console.log(client.user.username)
})
connect(config.mongoURL,
    { useNewUrlParser: true, useUnifiedTopology: true, 
},() => console.log('Connected to db! :)'));
module.exports = client;

require('./dashboard/server');

require('./bot/server');
