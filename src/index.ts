import { Client, GatewayIntentBits, Collection, GuildEmoji } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})

import { SlashCommand } from "./utility/types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { addFieldToUsers } from "./scripts/script";
import { createItem } from "./utility/database";
config()

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

// addFieldToUsers();
// createItem(0, "69 Coin Buff");

client.login(process.env.TOKEN)