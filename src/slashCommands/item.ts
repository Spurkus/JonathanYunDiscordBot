import { SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js";
import { SlashCommand, rarityType } from "../utility/types";
import { getItemName, getAllItems } from "../utility/database";
import getEmoji from "../utility/emoji";

const rarityColours: Record<rarityType, ColorResolvable> = {
    Special: "Red",
    Mythic: "LuminousVividPink",
    Legendary: "Gold",
    Epic: "Purple",
    Rare: "Blue",
    Uncommon: "Green",
    Common: "White",
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("item")
        .addStringOption((option) => {
            return option
                .setName("name")
                .setDescription("The name of the item's information/details you want to see")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .setDescription("Check an item's information/details"),
    autocomplete: async (interaction) => {
        const focusedValue = interaction.options.getFocused();
        const itemData = await getAllItems();
        const choices = itemData.map((i) => ({ name: i.name, value: i.name }));

        let filtered: { name: string; value: string }[] = [];
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            if (choice.name.includes(focusedValue)) filtered.push(choice);
        }
        await interaction.respond(filtered);
    },
    execute: async (interaction) => {
        const emoji = await getEmoji(interaction.client);
        const itemName = interaction.options.getString("name");
        if (!itemName) return interaction.reply("You need to specify an item silly!");

        const item = await getItemName(itemName);
        if (!item) return interaction.reply(`This item does not exist silly!! ${emoji.jonuwu}`);

        const itemEmoji = emoji[item.emoji];
        if (!itemEmoji) return interaction.reply("This item has an invalid emoji!!");

        const rarityColour = rarityColours[item.rarity];
        if (!rarityColour) return interaction.reply("The rarity is invalid");

        const thumbnailUrl = itemEmoji.id
            ? itemEmoji.url
            : `https://emojicdn.elk.sh/${item.emoji}?style=twitter`;

        const embed = new EmbedBuilder()
            .setTitle(`${item.id}: ${item.name}`)
            .setDescription(
                `**${item.rarity}**\n${item.description}\n\n**Price:** ¥${item.price}${"\u00A0\u00A0\u00A0\u00A0"}**Consumable:** ${item.consumable}${"\u00A0\u00A0\u00A0\u00A0"}**Giftable:** ${item.giftable}`
            )
            .setThumbnail(thumbnailUrl)
            .setColor(rarityColour)
            .setFooter({ text: "Yun Shops™" });

        await interaction.reply({
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
