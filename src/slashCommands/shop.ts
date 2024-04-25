import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getAllItems } from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shows the items you can buy in Yun Shops™"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const emoji = await getEmoji(interaction.client);
        const items = await getAllItems();

        const itemDisplay = items
            .filter((item) => item.buyable) // Filter out items that are not buyable
            .map(async (item) => ({
                name: `${emoji[item.emoji]} **${item.name}** | ¥${addCommas(item.price)}`,
                value: `**[${item.rarity}]** ${item.description}`,
            }));
        const embed = new EmbedBuilder()
            .setTitle(`**Yun Shops™** - The official place to buy cool items!!`)
            .setDescription("You can buy these items with `/buy [item]` :3")
            .setColor("DarkNavy")
            .setFields(...(await Promise.all(itemDisplay)))
            .setImage("https://i.imgur.com/EqDUIMX.png")
            .setFooter({ text: "Yun Shops™" });

        await interaction.editReply({
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
