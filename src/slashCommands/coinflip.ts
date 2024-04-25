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

        await interaction.deferReply();

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.editReply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to gamble smh.\nIt's ok, I will make one for you <3"
            );
        }

        const amount = interaction.options.getString("amount");
        if (!amount) return interaction.editReply("Bruh, you need amount to gamble idiot");

        let gamble: number;
        if (amount.toUpperCase() == "ALL") {
            gamble = user.wallet;
        } else {
            if (!/^\d+$/.test(amount))
                return interaction.editReply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            gamble = parseInt(amount);

            if (gamble <= 0)
                return interaction.editReply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            if (gamble > user.wallet)
                return interaction.editReply(
                    "You don't have that amount of **YunBucks** in your wallet to gamble"
                );

            if (gamble > 1000000)
                return interaction.editReply(
                    "You can't gamble more than ¥1,000,000 **YunBucks!!**"
                );
        }

        gamble = gamble > 1000000 ? 1000000 : gamble;

        const effectIDs = user.active.map((effect) => effect[0]);
        let messageActive: String = "";
        let boost: Array<number> = [];
        let luckBonus = 1;
        let coinBonus = 0;

        for (let i = 0, len = effectIDs.length; i < len; i++) {
            // 0 is The Coin of 69
            if (effectIDs[i] == 0) {
                messageActive += `${emoji["69coin"]} **The Coin of 69** has been activated\n`;
                boost.push(0);
                coinBonus = 0.19;
                continue;
            }

            // 3 is Luck effect
            if (effectIDs[i] == 3) {
                messageActive += ":four_leaf_clover: Luck of 8% bonus has been activated\n";
                boost.push(3);
                luckBonus = 1.08;
                continue;
            }
        }
        removeEffect(userID, boost, 1);
        if (messageActive) messageActive += "\n";

        if (randomChance > (0.5 + coinBonus) * luckBonus) {
            removeFromWallet(userID, gamble);
            return interaction.editReply(
                `${messageActive}LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${addCommas(gamble)} **YunBucks** was taken from your wallet`
            );
        }

        addToWallet(userID, gamble);
        return interaction.editReply(
            `${messageActive}AYYY YOU WON!!! ¥${addCommas(gamble)} **YunBucks** was added into your wallet`
        );
    },
    cooldown: 10,
};

export default command;
