import { Client, GuildEmoji } from "discord.js";
import { EmojiMap } from "./types";

const getEmoji = async (client: Client) => {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
        throw new Error("Guild ID is not defined in the environment variables.");
    }

    const guild = await client.guilds.fetch(guildId);
    const emojis: EmojiMap = (await guild).emojis.cache.reduce(
        (acc: EmojiMap, emoji: GuildEmoji) => {
            if (emoji.name != null) {
                acc[emoji.name] = emoji;
            }
            return acc;
        },
        {}
    );

    return emojis;
};

export default getEmoji;
