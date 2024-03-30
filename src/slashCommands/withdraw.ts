import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { getUser, createUser, removeFromBank, addToWallet } from "../economy";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("withdraw")
    .addStringOption(option => {
      return option
        .setName("amount")
        .setDescription("The amount of YunBucks you wish to withdraw")
        .setRequired(true);
    })
    .setDescription("Withdraw YunBucks from bank")
    ,
    execute: async interaction => {
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to withdraw smh.\nIt's ok, I will make one for you <3")
        }

        const amount = interaction.options.getString("amount");
        if (!amount) return interaction.reply("Bruh, you need amount to withdraw idiot")

        if (amount.toUpperCase() == "ALL") {
            const all = user.bank;
            addToWallet(userID, all);
            removeFromBank(userID, all);
            return interaction.reply(`You deposited ¥${all} **YunBucks** into your bank`);
        }

        if (!/^\d+$/.test(amount)) return interaction.reply("Withdraw amount must be positive numbers (or 'all') you baka >.<");

        const amountNumber = parseInt(amount);

        if (amountNumber <= 0) return interaction.reply("Withdraw amount must be positive numbers (or 'all') you baka >.<");

        if (amountNumber > user.bank) return interaction.reply("You don't have that amount of **YunBucks** in your bank to withdraw");

        removeFromBank(userID, amountNumber);
        addToWallet(userID, amountNumber);
        return interaction.reply(`You withdrew ¥${amountNumber} **YunBucks** into your wallet`);
    },
    cooldown: 600
}

export default command