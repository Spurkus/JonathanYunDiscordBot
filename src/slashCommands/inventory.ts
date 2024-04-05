import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../utility/types";
import { getUser, createUser, getItem } from "../utility/database";
import { capitalisedName } from "../utility/functions";
import getEmoji from "../utility/emoji";

const formatName = (name: string): string => {
    if (name[name.length - 1] == "s") {
        return capitalisedName(name) + "' Inventory";
    }
    return capitalisedName(name) + "'s Inventory";
}

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Shows the items in your inventory :3")
    ,
    execute: async interaction => {
        const emoji = await getEmoji(interaction.client);

        const userID = interaction.user.id;
        const user = await getUser(userID);
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to see the items you've never bought :sob:.\nIt's ok, I will make one for you <3")
        }

        const inventory = user.inventory;

        if (!inventory) return interaction.reply(`${interaction.member} has an empty inventory :rofl:`);

        const itemDisplay = inventory.map(async (item) => {
            const fetchedItem = await getItem(item[0]);
            if (!fetchedItem) throw new Error(`Item with ID ${item[0]} not found.`); 

            return {
                name: `${emoji[fetchedItem.emoji]} **${fetchedItem.name}** (${item[1]})`,
                value: `**Consumable:** ${fetchedItem.consumable}${"\u00A0\u00A0\u00A0\u00A0"}**Giftable:** ${fetchedItem.giftable}`
            };
        });

        const embed = new EmbedBuilder()
        .setTitle(`${formatName(interaction.user.username)}`)
        .setDescription("If the item is consumable, you can try `/use [item]` to use it :3")
        .setColor("Fuchsia")
        .setFields(...(await Promise.all(itemDisplay)))
        .setFooter({text: "Yunventory™"})

        await interaction.reply({
            embeds: [embed],
        })
    },
    cooldown: 5
}

export default command