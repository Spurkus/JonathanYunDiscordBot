import { Client, GuildEmoji } from "discord.js"

const getEmoji = async (client: Client) => {
    var emoji: { [key: string]: GuildEmoji | undefined } = {}
    var emojiID = {
        jonathan: "<:jonathan:1217063765518848011>",
    }

    for (const [key, value] of Object.entries(emojiID)) {
        emoji[key] = client.emojis.cache.get(value);
    }

    return emoji
}

export default getEmoji