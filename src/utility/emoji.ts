import { Client, GuildEmoji } from "discord.js"

const getEmoji = async (client: Client) => {
    var emoji: { [key: string]: GuildEmoji | undefined } = {}
    var emojiID = {
        "jonathan": "1217063765518848011",
        "69coin": "1225056226325303356",
        "jonathicc": "1225042213868929104",
        "jonuwu": "1225042266129961104",
        "shieldyun": "1225286828525879347",
    }

    for (const [key, value] of Object.entries(emojiID)) {
        emoji[key] = client.emojis.cache.get(value);
    }

    return emoji
}

export default getEmoji