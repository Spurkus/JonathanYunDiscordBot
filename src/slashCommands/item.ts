import { SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js";
import { SlashCommand, rarityType } from "../utility/types";
import { getItemName, getAllItems } from "../utility/database";
import { addCommas } from "../utility/functions";
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
        await interaction.deferReply();
        const emoji = await getEmoji(interaction.client);
        const itemName = interaction.options.getString("name");
        if (!itemName) return interaction.editReply("You need to specify an item silly!");

        const item = await getItemName(itemName);
        if (!item) return interaction.editReply(`This item does not exist silly!! ${emoji.jonuwu}`);

        const itemEmoji = emoji[item.emoji];
        if (!itemEmoji) return interaction.editReply("This item has an invalid emoji!!");

        const rarityColour = rarityColours[item.rarity];
        if (!rarityColour) return interaction.editReply("The rarity is invalid");

        const thumbnailUrl = itemEmoji.id
            ? itemEmoji.url
            : `https://emojicdn.elk.sh/${item.emoji}?style=twitter`;

        const price = item.price == -1 ? "unfinity" : item.price;

        const embed = new EmbedBuilder()
            .setTitle(`${item.id}: ${item.name}`)
            .setDescription(
                `**[${item.rarity}]**\n${item.description}\n\n**Price:** ¥${typeof price === "number" ? addCommas(price) : price}${"\u00A0\u00A0\u00A0\u00A0"}**Consumable:** ${item.consumable}${"\u00A0\u00A0\u00A0\u00A0"}**Giftable:** ${item.giftable}\n**Attributes:** ${item.attributes}`
            )
            .setThumbnail(thumbnailUrl)
            .setColor(rarityColour)
            .setFooter({ text: "Yun Shops™" });

        await interaction.editReply({
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
