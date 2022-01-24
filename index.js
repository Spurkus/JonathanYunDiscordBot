const Discord = require('discord.js');
require('dotenv').config();
const mongoose = require("mongoose");
const client = new Discord.Client({
     partials: [ "MESSAGE", "CHANNEL", "REACTION" ],
     intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
     ]
    });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to the database babyy!!!");
}).catch((err) =>{
    console.log(err);
});

client.login(process.env.TOKEN);