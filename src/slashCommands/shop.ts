import { SlashCommandBuilder, EmbedBuilder, Emoji } from "discord.js"
import { SlashCommand } from "../utility/types";
import { getAllItems } from "../utility/database";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Shows the items you can buy in Yun Shops™")
    ,
    execute: async interaction => {
        const emoji = await getEmoji(interaction.client);
        const items = await getAllItems();

        const itemDisplay = items.map(async (item) => ({
            name: `${emoji[item.emoji]} **${item.name}** | ¥${item.price}`,
            value: `**[${item.rarity}]** ${item.description}`
        }));
        const embed = new EmbedBuilder()
        .setTitle(`**Yun Shops™** - The official place to buy cool items!!`)
        .setDescription("You can buy these items with `/buy [item]` :3")
        .setColor("DarkNavy")
        .setFields(...(await Promise.all(itemDisplay)))
        .setImage("https://i.imgur.com/EqDUIMX.png")
        .setFooter({text: "Yun Shops™"})

        await interaction.reply({
            embeds: [embed],
        })
    },
    cooldown: 5
}

export default command