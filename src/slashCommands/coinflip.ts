import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    removeFromWallet,
    addToWallet,
    removeEffect,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("coinflip")
        .addStringOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of YunBucks you wish to gamble away >:)")
                .setRequired(true);
        })
        .setDescription("lmao gambling addiction moment"),
    execute: async (interaction) => {
        const emoji = await getEmoji(interaction.client);
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const randomChance = Math.random();

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to gamble smh.\nIt's ok, I will make one for you <3"
            );
        }

        const amount = interaction.options.getString("amount");
        if (!amount) return interaction.reply("Bruh, you need amount to gamble idiot");

        let gamble: number;
        if (amount.toUpperCase() == "ALL") {
            gamble = user.wallet;
        } else {
            if (!/^\d+$/.test(amount))
                return interaction.reply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            gamble = parseInt(amount);

            if (gamble <= 0)
                return interaction.reply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            if (gamble > user.wallet)
                return interaction.reply(
                    "You don't have that amount of **YunBucks** in your wallet to gamble"
                );
        }

        const effectIDs = user.active.map((effect) => effect[0]);
        let messageActive: String = "";

        const luckActive = effectIDs.includes(3); // 3 is Luck effect
        const luckBonus = luckActive ? 1.08 : 1;
        if (luckActive) {
            removeEffect(userID, 3, 1);
            messageActive += ":four_leaf_clover: Luck of 8% bonus has been activated\n";
        }

        const coinBonusActive = effectIDs.includes(0); // 0 is The Coin of 69 Bonus
        const coinBonus = coinBonusActive ? 0.19 : 0;
        if (coinBonusActive) {
            removeEffect(userID, 0, 1);
            messageActive += `${emoji["69coin"]} **The Coin of 69** has been activated\n`;
        }

        if (messageActive) messageActive += "\n";

        if (randomChance > (0.5 + coinBonus) * luckBonus) {
            removeFromWallet(userID, gamble);
            return interaction.reply(
                `${messageActive}LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${addCommas(gamble)} **YunBucks** was taken from your wallet`
            );
        }

        addToWallet(userID, gamble);
        return interaction.reply(
            `${messageActive}AYYY YOU WON!!! ¥${addCommas(gamble)} **YunBucks** was added into your wallet`
        );
    },
    cooldown: 10,
};

export default command;
