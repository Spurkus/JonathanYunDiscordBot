import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getUser, createUser, removeFromBank, addToWallet } from "../utility/database";
import { addCommas } from "../utility/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("withdraw")
        .addStringOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of YunBucks you wish to withdraw")
                .setRequired(true);
        })
        .setDescription("Withdraw YunBucks from bank"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.editReply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to withdraw smh.\nIt's ok, I will make one for you <3"
            );
        }

        const amount = interaction.options.getString("amount");
        if (!amount) return interaction.editReply("Bruh, you need amount to withdraw idiot");

        if (amount.toUpperCase() == "ALL") {
            const all = user.bank;
            addToWallet(userID, all);
            removeFromBank(userID, all);
            return interaction.editReply(
                `You withdrew ¥${addCommas(all)} **YunBucks** into your wallet`
            );
        }

        if (!/^\d+$/.test(amount))
            return interaction.editReply(
                "Withdraw amount must be positive numbers (or 'all') you baka >.<"
            );

        const amountNumber = parseInt(amount);

        if (amountNumber <= 0)
            return interaction.editReply(
                "Withdraw amount must be positive numbers (or 'all') you baka >.<"
            );

        if (amountNumber > user.bank)
            return interaction.editReply(
                "You don't have that amount of **YunBucks** in your bank to withdraw"
            );

        removeFromBank(userID, amountNumber);
        addToWallet(userID, amountNumber);
        return interaction.editReply(
            `You withdrew ¥${addCommas(amountNumber)} **YunBucks** into your wallet`
        );
    },
    cooldown: 10,
};

export default command;
