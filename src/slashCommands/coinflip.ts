import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    removeFromWallet,
    addToWallet,
    removeEffect,
} from "../utility/database";
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

        const coinBonusActive = user.active.map((effect) => effect[0]).includes(0);
        if (coinBonusActive) removeEffect(userID, 0, 1);
        const bonus = coinBonusActive ? 0.19 : 0;
        const messageActive = coinBonusActive
            ? `${emoji["69coin"]} **The Coin of 69** has been activated\n`
            : "";

        if (randomChance > 0.5 + bonus) {
            removeFromWallet(userID, gamble);
            return interaction.reply(
                `${messageActive}LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${gamble} **YunBucks** was taken from your wallet`
            );
        }

        addToWallet(userID, gamble);
        return interaction.reply(
            `${messageActive}AYYY YOU WON!!! ¥${gamble} **YunBucks** was added into your wallet`
        );
    },
    cooldown: 10,
};

export default command;
