import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getItemName,
    getAllItems,
    getUser,
    createUser,
    addToWallet,
    removeFromInventory,
    addEffect,
    getEffect,
} from "../utility/database";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("use")
        .addStringOption((option) => {
            return option
                .setName("item")
                .setDescription("The name of the item you want to use")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .setDescription("Use a consumable item from Yunventory™"),
    autocomplete: async (interaction) => {
        const focusedValue = interaction.options.getFocused();
        const itemData = await getAllItems();

        const user = await getUser(interaction.user.id);
        const inventoryItemIDs = user?.inventory.map((item) => item[0]);

        const choices = itemData
            .filter((item) => inventoryItemIDs?.includes(item.id) && item.consumable)
            .map((item) => ({ name: item.name, value: item.name }));

        let filtered: { name: string; value: string }[] = [];
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            if (choice.name.includes(focusedValue)) filtered.push(choice);
        }
        await interaction.respond(filtered);
    },
    execute: async (interaction) => {
        const emoji = await getEmoji(interaction.client);

        const userID = interaction.user.id;
        const user = await getUser(userID);
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to use items silly.\nIt's ok, I will make one for you <3"
            );
        }

        const itemName = interaction.options.getString("item");
        if (!itemName) return interaction.reply("You need to specify an item silly!");

        const item = await getItemName(itemName);
        if (!item) return interaction.reply(`This item does not exist silly!! ${emoji.jonuwu}`);

        const itemEmoji = emoji[item.emoji];
        if (!itemEmoji) return interaction.reply("This item has an invalid emoji!!");

        const userItem = user.inventory.find((userItem) => userItem[0] === item.id);
        if (!userItem)
            return interaction.reply(
                `You don't even have ${emoji[item.emoji]} **${item.name}** in your inventory XD`
            );

        if (!item.consumable)
            return interaction.reply(`You cannot consume this item silly!! ${emoji.jonathicc}`);

        const effect = await getEffect(item.id);
        if (!effect)
            return interaction.reply(`wtf this effect does not exist silly!? ${emoji.jonuwu}`);

        removeFromInventory(userID, item.id, 1);
        addEffect(userID, item.id, effect.uses);

        return interaction.reply(`Successfully used ${emoji[item.emoji]} **${item.name}**`);
    },
    cooldown: 5,
};

export default command;
