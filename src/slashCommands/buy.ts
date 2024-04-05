import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../utility/types";
import { getItemName, getAllItems, getUser, createUser, removeFromWallet, addToInventory } from "../utility/database";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("buy")
    .addStringOption(option => {
        return option
            .setName("item")
            .setDescription("The name of the item's information/details you want to see")
            .setRequired(true)
            .setAutocomplete(true)
    })
    .setDescription("Buy an item from Yun Shops™")
    ,
    autocomplete: async interaction => {
        const focusedValue = interaction.options.getFocused();
        const itemData = await getAllItems();
        const choices = itemData.map((i) => ({ name: i.name, value: i.name }));

        let filtered: { name: string, value: string }[] = []
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            if (choice.name.includes(focusedValue)) filtered.push(choice);
        }
        await interaction.respond(
            filtered
        );
    },
    execute: async interaction => {
        const emoji = await getEmoji(interaction.client);

        const userID = interaction.user.id;
        const user = await getUser(userID);
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to buy items :O.\nIt's ok, I will make one for you <3")
        }

        const itemName = interaction.options.getString("item");
        if (!itemName) return interaction.reply("You need to specify an item silly!");

        const item = await getItemName(itemName);
        if (!item) return interaction.reply(`This item does not exist silly!! ${emoji.jonuwu}`);

        const itemEmoji = emoji[item.emoji];
        if (!itemEmoji) return interaction.reply("This item has an invalid emoji!!");

        if (user.wallet < item.price) {
            return interaction.reply(`YOU'RE POOR :rofl: You don't have enough **YunBucks** in your wallet to buy **${item.name}**`);
        }

        removeFromWallet(userID, item.price);
        addToInventory(userID, item.id);

        return interaction.reply(`Successfully bought 1 ${emoji[item.emoji]} **${item.name}**`);
    },
    cooldown: 5
}

export default command