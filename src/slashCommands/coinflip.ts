import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../utility/types";
import { getUser, createUser, removeFromWallet, addToWallet } from "../utility/database";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("coinflip")
    .addStringOption(option => {
      return option
        .setName("amount")
        .setDescription("The amount of YunBucks you wish to gamble away >:)")
        .setRequired(true);
    })
    .setDescription("lmao gambling addiction moment")
    ,
    execute: async interaction => {
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const randomChance = Math.random();

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to gamble smh.\nIt's ok, I will make one for you <3")
        }

        const amount = interaction.options.getString("amount");

        if (!amount) return interaction.reply("Bruh, you need amount to gamble idiot")

        if (amount.toUpperCase() == "ALL") {
            const all = user.wallet;

            if (randomChance < 0.5) {
                removeFromWallet(userID, all);
                return interaction.reply(`LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${all} **YunBucks** was taken from your wallet`);
            }

            addToWallet(userID, all);
            return interaction.reply(`AYYY YOU WON!!! ¥${all} **YunBucks** was added into your wallet`);
        }

        if (!/^\d+$/.test(amount)) return interaction.reply("Gamble amount must be positive numbers (or 'all') you baka >.<");
        
        const amountNumber = parseInt(amount);

        if (amountNumber <= 0) return interaction.reply("Gamble amount must be positive numbers (or 'all') you baka >.<");

        if (amountNumber > user.wallet) return interaction.reply("You don't have that amount of **YunBucks** in your wallet to gamble");

        if (randomChance < 0.5) {
            removeFromWallet(userID, amountNumber);
            return interaction.reply(`LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${amountNumber} **YunBucks** was taken from your wallet`);
        }

        addToWallet(userID, amountNumber);
        return interaction.reply(`AYYY YOU WON!!! ¥${amountNumber} **YunBucks** was added into your wallet`);
    },
    cooldown: 10
}

export default command