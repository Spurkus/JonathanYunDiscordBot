import Discord, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs';
dotenv.config();

const prefix = '!J';

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log("Jonathan Yun is online!")
})

client.on('messageCreate', (message) => {
    if (message.content === 'pee'){
        message.reply({
            content: 'pong',
        })
    }
})

client.login(process.env.TOKEN)