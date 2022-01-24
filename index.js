const Discord = require('discord.js');
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

client.login('OTE3NjcxNjQ0MDUzNTI0NTEw.Ya8GUQ.nnptun2v6Y2oEHCqdlV2W0Yxepk');