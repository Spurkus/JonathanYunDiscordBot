const Discord = require('discord.js');
require('dotenv').config();
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

client.login(process.env.TOKEN);