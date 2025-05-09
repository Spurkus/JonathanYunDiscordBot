import { Client, GatewayIntentBits, Collection } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});

import { SlashCommand } from "./utility/types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { addFieldToUsers, createItem, createEffect, addFieldToItems } from "./utility/database";
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client);
});

// addFieldToUsers("active", []);
// addFieldToItems("attributes", []);
// createItem(
//     22,
//     "Goat Fish",
//     "goatfish",
//     "Epic",
//     "Ain't no freakin way its the GOAT fish. Goated with the sauce with the goat fish? :goat:",
//     ["Fish"],
//     69000,
//     false,
//     false,
//     true
// );
// createEffect(3, "Luckiness :3", "luckpotion", "Boosts all **luck events** by **8%**", 10);

client.login(process.env.TOKEN);
