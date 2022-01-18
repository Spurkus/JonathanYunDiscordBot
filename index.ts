import Discord, { Intents, Interaction } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'
import 'dotenv/config'

dotenv.config();

const prefix = '!J';

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', async () => {
    console.log("Jonathan Yun is online!");
    
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['904159855424733194', '888050919550382090'],
        mongoUri: process.env.MONGO_URI,
    })
    .setDefaultPrefix(prefix)
})

client.login(process.env.TOKEN);