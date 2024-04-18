import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getItemName,
    getAllItems,
    getUser,
    createUser,
    addToWallet,
    removeFromInventory,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("sell")
        .addStringOption((option) => {
            return option
                .setName("item")
                .setDescription("The name of the item you want to sell")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .addStringOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of the item you want to sell");
        })
        .setDescription("Sell an item for 85% of its bought price from Yunventory™"),
    autocomplete: async (interaction) => {
        const focusedValue = interaction.options.getFocused();
        const itemData = await getAllItems();

        const user = await getUser(interaction.user.id);
        const inventoryItemIDs = user?.inventory.map((item) => item[0]);

        const choices = itemData
            .filter((item) => inventoryItemIDs?.includes(item.id))
            .map((item) => ({ name: item.name, value: item.name }));

        let filtered: { name: string; value: string }[] = [];
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            if (choice.name.includes(focusedValue)) filtered.push(choice);
        }
        await interaction.respond(filtered);
    },
    execute: async (interaction) => {
        const SELLING_PRICE_CONSTANT = 0.85;

        const emoji = await getEmoji(interaction.client);

        const userID = interaction.user.id;
        const user = await getUser(userID);
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to sell items silly.\nIt's ok, I will make one for you <3"
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

        let amountNumber;
        const amount = interaction.options.getString("amount");
        if (amount) {
            if (amount.toUpperCase() == "ALL") {
                amountNumber = userItem[1];
            } else if (/^\d+$/.test(amount)) {
                amountNumber = parseInt(amount);
            } else {
                return interaction.reply(
                    "Sell amount must be positive numbers (or 'all') you baka >.<"
                );
            }
        } else {
            amountNumber = 1;
        }

        if (userItem[1] < amountNumber)
            return interaction.reply(
                `You don't have enough ${emoji[item.emoji]} **${item.name}** to sell!`
            );

        const totalPrice = Math.floor(item.price * amountNumber * SELLING_PRICE_CONSTANT);
        addToWallet(userID, totalPrice);
        removeFromInventory(userID, item.id, amountNumber);

        return interaction.reply(
            `Successfully sold ${amountNumber} ${emoji[item.emoji]} **${item.name}** for ¥${addCommas(totalPrice)}`
        );
    },
    cooldown: 5,
};

export default command;
