import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { getUser, createUser, removeFromWallet, addToBank } from "../database";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("deposit")
    .addStringOption(option => {
      return option
        .setName("amount")
        .setDescription("The amount of YunBucks you wish to deposit into your bank")
        .setRequired(true);
    })
    .setDescription("Deposit YunBucks to bank")
    ,
    execute: async interaction => {
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to deposit smh.\nIt's ok, I will make one for you <3")
        }

        const amount = interaction.options.getString("amount");

        if (!amount) return interaction.reply("Bruh, you need amount to deposit idiot")

        if (amount.toUpperCase() == "ALL") {
            const all = user.wallet;
            addToBank(userID, all);
            removeFromWallet(userID, all);
            return interaction.reply(`You deposited ¥${all} **YunBucks** into your bank`);
        }

        if (!/^\d+$/.test(amount)) return interaction.reply("Withdraw amount must be positive numbers (or 'all') you baka >.<");
        
        const amountNumber = parseInt(amount);

        if (amountNumber <= 0) return interaction.reply("Deposit amount must be positive numbers (or 'all') you baka >.<");

        if (amountNumber > user.wallet) return interaction.reply("You don't have that amount of **YunBucks** in your wallet to deposit");

        removeFromWallet(userID, amountNumber);
        addToBank(userID, amountNumber);
        return interaction.reply(`You deposited ¥${amountNumber} **YunBucks** into your bank`);
    },
    cooldown: 600
}

export default command