import { Client, GuildEmoji } from "discord.js";
import { EmojiMap } from "./types";

const getEmoji = async (client: Client) => {
    const guildId = process.env.GUILD_ID;
    if (!guildId) throw new Error("Guild ID is not defined in the environment variables.");

    const guild = await client.guilds.fetch(guildId);
    const emojis: EmojiMap = new Proxy(
        Object.fromEntries(guild.emojis.cache.map((emoji) => [emoji.name, emoji])),
        {
            get: function (target, name) {
                return target[name] || name; // Uses default emoji tag if not in guild
            },
        }
    );

    return emojis;
};

export default getEmoji;
