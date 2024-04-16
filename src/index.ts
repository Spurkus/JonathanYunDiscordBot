import { Client, GatewayIntentBits, Collection, GuildEmoji } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});

import { SlashCommand } from "./utility/types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { addFieldToUsers, createItem, createEffect } from "./utility/database";
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client);
});

// addFieldToUsers("active", []);
// createItem(2, "Flower of Yun", "floweryun", "Common", "A cute flower :3", 500, false, true, true);
// createEffect(1, "Shield of Yun", "shieldyun", "**blocks** robs if someone tries to rob you <3", 10);

client.login(process.env.TOKEN);
