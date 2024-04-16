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
// createItem(
//     7,
//     "JonaCondom",
//     "jonacondom",
//     "Legendary",
//     "The Legendary JonaCondom was once used by **Jonathan Yun** himself. But darkness befell as he put the JonaCondom on and gave **Jennifer Yun** a UTI. Now only the most worthy can have the JonaCondom.",
//     10000000000000000000000000,
//     false,
//     false,
//     true
// );
// createEffect(3, "Luckiness :3", "luckpotion", "Boosts all **luck events** by **8%**", 10);

client.login(process.env.TOKEN);
