import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    addToWallet,
    removeFromWallet,
    getAllItems,
    getItemName,
    removeFromInventory,
    addToInventory,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("give")
        .addUserOption((option) => {
            return option
                .setName("target")
                .setDescription("The person you want to give YunBucks to")
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of the YunBucks/item you want to give")
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .setName("item")
                .setDescription("The name of the item you want to give")
                .setAutocomplete(true);
        })
        .setDescription("Give another user YunBucks or an item from your inventory :3"),
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
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const targetExists = interaction.options.getUser("target");
        const emoji = await getEmoji(interaction.client);
        const amount = interaction.options.getString("amount");
        let amountNumber: number;

        if (!targetExists)
            return interaction.reply("You gotta tell me who you're giving YunBucks/items to :sob:");
        if (!amount)
            return interaction.reply("You have to specify an amount you're giving to someone");

        const target = await getUser(targetExists.id);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to give people stuff :sob:.\nIt's ok, I will make one for you <3"
            );
        }

        // Target has not tried any economy
        if (!target)
            return interaction.reply(
                `${targetExists} hasn't even opened up a bank account in 'Yun Banks™' yet and you're trying to give stuff to them :sob:`
            );

        const itemName = interaction.options.getString("item");
        if (!itemName) {
            // Giving YunBucks :33
            if (amount.toUpperCase() == "ALL") {
                amountNumber = user.wallet;
            } else if (/^\d+$/.test(amount)) {
                amountNumber = parseInt(amount);
            } else {
                return interaction.reply("Silly!!! You have to input positive whole numbers!!");
            }

            if (user.wallet < amountNumber)
                return interaction.reply(
                    "You can't have enough YunBucks in your wallet to give to the person :3"
                );

            removeFromWallet(userID, amountNumber);
            addToWallet(targetExists.id, amountNumber);
            return interaction.reply(
                `You gave ${targetExists}, ¥${addCommas(amountNumber)} **YunBucks**!`
            );
        } else {
            // Giving Items!!
            const item = await getItemName(itemName);
            if (!item) return interaction.reply(`This item does not exist silly!! ${emoji.jonuwu}`);

            const itemEmoji = emoji[item.emoji];
            if (!itemEmoji) return interaction.reply("This item has an invalid emoji!!");

            const userItem = user.inventory.find((userItem) => userItem[0] === item.id);
            if (!userItem)
                return interaction.reply(
                    `You don't even have ${emoji[item.emoji]} **${item.name}** in your inventory XD`
                );

            if (amount.toUpperCase() == "ALL") {
                amountNumber = userItem[1];
            } else if (/^\d+$/.test(amount)) {
                amountNumber = parseInt(amount);
            } else {
                return interaction.reply("Silly!!! You have to input positive whole numbers!!");
            }

            if (userItem[1] < amountNumber)
                return interaction.reply(
                    `You don't have enough ${emoji[item.emoji]} **${item.name}** to sell!`
                );

            removeFromInventory(userID, item.id, amountNumber);
            addToInventory(targetExists.id, item.id, amountNumber);
            return interaction.reply(
                `Successfully gave ${amountNumber} ${emoji[item.emoji]} **${item.name}** to ${targetExists}`
            );
        }
    },
    cooldown: 20,
};

export default command;
